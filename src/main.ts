import { Server } from 'socket.io';
import { Methods } from './typings';

import Store from './store';
import Handler from './handler';

type CreateStoreOptions<T, M extends Methods> = {
  name?: string,
  io?: Server,
  data?: () => T,
  methods?: M
};

const mainProxyHandler: ProxyHandler<any> = {
  get: (target, key) => {
    return target[key] ?? target.methods[key] ?? target.state[key];
  }
}

function createMethodsProxyHandler<T, M extends Methods>(mainProxy: Store<T, M>): ProxyHandler<any> {
  return {
    get: (target, key) => {
      if(key in target) {
        return (...args) => target[key].apply(mainProxy, args);
      }
    }
  }
}

function createStore<T, M extends Methods>(options: CreateStoreOptions<T, M>): Store<T, M> {

  const store: Store<T, M> = new Store(options.name, options.io);

  const storeProxy = new Proxy(store, mainProxyHandler);

  store.methods = new Proxy(options.methods, createMethodsProxyHandler(storeProxy));
  store.state = new Proxy(options.data.apply(storeProxy), new Handler(store.getStateChangeCallback()));

  return store;
}

export {
  createStore
}