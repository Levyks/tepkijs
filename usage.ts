import { createStore } from './index';

import { Server } from 'socket.io';

const io = new Server(5000, {
  cors: {
    origin: '*',
  }
});

const store = createStore({
  io, name: 'room-01',
  data() {
    return {
      messages: []
    }
  },
  methods: {
    addMessage(message) {
      this.messages.push(message);
    },
    answer() {
      return 42;
    }
  }
});

store.subscribe(state => {
  console.log('state changed', state);
});