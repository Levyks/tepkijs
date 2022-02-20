import { Socket, Server } from 'socket.io';

export type Path = (string | [string, 'array'])[]

export type Subscription<T> = (data: T, diff?: {path: Path, value: any}) => any

export type Methods = {
  [key: string]: (socket?: Socket, ...args: any[]) => any
}

export type CreateStoreOptions<D, M> = {
  name: string,
  io: Server,
  data?: D,
  methods?: M & ThisType<D & M>;
  middleware?: ioMiddleware;
};

export type ioMiddleware = (socket: Socket, next: (err?: any) => void) => void;