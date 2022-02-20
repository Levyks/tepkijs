
export type Options<D, M> = {
  data?: D,
  methods?: M & ThisType<D & M>;
};

type Methods = {
  [key: string]: Function
}

function createStore<D, M extends Methods>(options: Options<D, M>) {
  throw new Error('Not implemented');
}

createStore({
  data: {
    message: 'hello world'
  },
  methods: {
    hello() {
      return this.world(); // Error: Property 'world' does not exist in type '{ message: string; }'
    },
    world() {
      return this.message; // No error, auto-complete works, type shows 'string' correctly
    }
  }
})