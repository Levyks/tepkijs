import { createStore } from '.';
import { Server } from 'socket.io';

const io = new Server(5000, {
  cors: {
    origin: '*',
  }
});

type State = {
  messages: string[]
}

const store = createStore({
  io, name: 'room-01',
  data(): State {
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