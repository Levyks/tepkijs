import { createStore } from './index';

class Round {

  status: string = 'waiting';

  start() {
    this.status = 'started';
  }

}

class Game {

  started: boolean = false;
  rounds: Round[] = [];

  start() {
    this.started = true;
  }

  createRound() {
    this.rounds.push(new Round());
  }

  
}

class Room {

  game: Game;
  code = "AAAA ";

  createGame() {
    this.game = new Game();
  }

}


const store = createStore(Room);

store.createGame();
store.game.start();
store.game.createRound();
store.game.rounds[0].start();