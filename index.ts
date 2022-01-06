import Handler from './src/handler';
import { syncState, shadow_state } from './src/stateSync';
import { Server } from "socket.io";

type CreateStateOptions = {
  name?: string;
  io?: Server;
};

function createState<T>(stateClass: new() => T, name?: string): T {

  const storeName = name || stateClass.name;
  
  const obj = new stateClass();

  Object.assign(shadow_state, JSON.parse(JSON.stringify(obj)));

  console.log(JSON.stringify(shadow_state, null, 2), "\n-----------------\n");

  const proxy = new Proxy(obj, new Handler(syncState));

  return proxy;

}

export {
  createState
}