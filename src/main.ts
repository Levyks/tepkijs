import { Methods, CreateStoreOptions } from './typings';

import Store from './store';
import Handler from './handler';

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

  const store: Store<T, M> = new Store(options.name, options.io, options.middleware);

  const storeProxy = new Proxy(store, mainProxyHandler);
  store.proxy = storeProxy;

  store.methods = new Proxy(options.methods, createMethodsProxyHandler(storeProxy));
  store.state = new Proxy(options.data, new Handler(store.getStateChangeCallback()));

  return store;
}

export {
  createStore
}