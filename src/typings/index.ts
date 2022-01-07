export type Methods = {
  [key: string]: Function
}

export type Path = (string | [string, 'array'])[]

export type Subscription<T> = (data: T, diff?: {path: Path, value: any}) => any