import { Monad } from './types';

export interface Maybe<A> extends Monad<A> {
  map<B>(f: (a: A) => B): Maybe<B>;

  ap<B>(f: Maybe<(a: A) => B>): Maybe<B>;

  chain<B>(f: (a: A) => Maybe<B>): Maybe<B>;

  get<B = A>(): B | undefined;

  get<B>(f: (a?: A) => B): B;
}

function just<A>(x: A): Maybe<A> {
  return {
    map: <B>(f: (a: A) => B): Maybe<B> => {
      return just(f(x));
    },
    ap: <B>(f: Maybe<(a: A) => B>): Maybe<B> => {
      return f.map(g => g(x));
    },
    chain: <B>(f: (a: A) => Maybe<B>): Maybe<B> => {
      return f(x);
    },
    get: <B>(f: (a?: any) => B = (_: any) => _): B | undefined => {
      return f(x);
    }
  };
}

function nothing(): Maybe<any> {
  return {
    map: () => nothing(),
    ap: () => nothing(),
    chain: () => nothing(),
    get: <B>(f: (a?: any) => B = (_: any) => _): B | undefined => {
      return f();
    }
  };
}

export default function maybe<A>(x?: A): Maybe<A> {
  if (typeof x === 'undefined') {
    return nothing();
  } else {
    return just(x);
  }
}
