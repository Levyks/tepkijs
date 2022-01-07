import { createStore } from './index';

import { Server } from 'socket.io';

const io = new Server(3000, {
  cors: {
    origin: '*',
  }
});

const store = createStore({
  name: 'room-01',
  io: io,
  data() {
    return {
      messages: []
    }
  },
  methods: {
    addMessage(message) {
      this.messages.push(message);
    }
  }
});

store.subscribe(state => {
  console.log('state changed', state);
});

console.log('store');

setTimeout(() => {
  console.log("adicionando");
  store.methods.addMessage('hello');
  console.log(store.state);
}, 10000);