import { createStore } from '.';
import { Server } from 'socket.io';

const io = new Server(5000, {
  cors: {
    origin: '*',
  }
});

const store = createStore({
  io, name: 'room-01',
  data: {
    messages: []
  },
  methods: {
    addMessage(socket, message: string) {
      this.messages.push(message);
    }
  }
});

store.subscribe((value) => {

  console.log('Data -> ', value);

});