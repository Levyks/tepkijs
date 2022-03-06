import { Namespace, Server, Socket } from 'socket.io';
import { ioMiddleware, Methods, Path, Subscription } from './typings';
import { getPublicState } from './util';

export default class Store<D, M extends Methods > {

  public state?: D;
  public methods?: M;
  private ioNsp: Namespace;

  constructor(
    public name: string,
    private io: Server,
    middleware?: ioMiddleware
  ) {
    this.ioNsp = io.of(`/tepki/${name}`);
    if(middleware) this.ioNsp.use(middleware);
    this.ioNsp.on('connection', s => this.handleSocketConnection(s));
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
    socket.emit('state', getPublicState(this.state));
    const unsubscribe = this.subscribe((_, diff) => socket.emit('change', getPublicState(diff)));
    
    socket.on('call', (data: {method: string, args: any[]}, callback: Function) => {
      
      if(!this.methods?.[data.method] || typeof this.methods[data.method] !== 'function') {
        const error = new Error(`Method '${data.method}' does not exist`);
        if(callback) return callback(false, error);
        else throw error;
      } 

      try {
        const result = this.methods[data.method](socket, ...data.args);
        if(!callback) return;
        
        if(result instanceof Promise) {
          result.then(res => callback(true, res)).catch(err => callback(false, err));
        } else {
          callback(true, result);
        }
        
      } catch(error) {
        if(callback) callback(false, error);
        else throw error;
      }
      
    });

    socket.on('disconnect', unsubscribe);
  }
}


