import { Server, Socket } from 'socket.io';
import Handler from './handler';
import { Methods, Path, Subscription } from './typings';

export default class Store<D, M extends Methods > {

  public state?: D;
  public methods?: M;

  constructor(
    public name: string,
    private io: Server
  ) {
    io.of(`/tepki/${name}`).on('connection', s => this.handleSocketConnection(s));
  }

  private subscription_count = 0;
  private subscriptions: {
    [id: number]: Subscription<D>
  } = {}

  getStateChangeCallback() {
    return (path: Path, value: any) => {
      this.notify({path, value});
    }
  }

  notify(diff?: {path: Path, value: any}) {
    for(let id in this.subscriptions) {
      this.subscriptions[id](this.state, diff);
    }
  }

  subscribe(subscription: Subscription<D>): () => void {
    const id = this.subscription_count++;
    this.subscriptions[id] = subscription;
    const subs = this.subscriptions;
    return function unsubscribe() {
      delete subs[id];
    }
  }

  private handleSocketConnection(socket: Socket) {
    // TODO: better handle connection problems with acknowledgements
    socket.emit('state', this.state);
    const unsubscribe = this.subscribe((_, diff) => socket.emit('change', diff));
    
    socket.on('call', (data: {method: string, args: any[]}, callback: Function) => {
      const result = this.methods[data.method](...data.args);
      if(callback) callback(result);
    });

    socket.on('disconnect', unsubscribe);
  }
}


