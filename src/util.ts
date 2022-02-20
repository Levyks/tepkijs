
export function getPublicState(obj: any): any {
  return new Proxy(obj, {
    get: (target, key: string) => {
      if(key.startsWith('_')) return undefined;
      if(typeof target[key] === 'object') return getPublicState(target[key]);
      return target[key];
    }
  });
}