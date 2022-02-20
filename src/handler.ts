export default class Handler {

  proxies: { [key: string]: typeof Proxy } = {};

  constructor(
    public callback: (key: any, value: any) => any,
    public path?: string | string[], 
    public parent?: Handler
  ) {}

  createHandler(key: string | string[]) {
    return new Handler((key_child, value) => {
      this.callback([key].concat(key_child), value);
    }, key, this);
  }

  createProxy(target: any, key: string) {
    const elem = target[key];

    let handler_key: string | string[] = key;
    
    if(Array.isArray(elem)) {
      handler_key = [key, 'array']
    } 
    
    return new Proxy(elem, this.createHandler(handler_key));
  }

  get(target, key: string) {
    if(typeof target[key] !== 'object' || key.startsWith('_')) return target[key];
    this.proxies[key] = this.proxies[key] || this.createProxy(target, key);
    return this.proxies[key];
  }

  set(target, key: string, value) {
    target[key] = value;
    if(key.startsWith('_')) return true;
    this.callback([].concat(key), value);
    return true;
  }

}