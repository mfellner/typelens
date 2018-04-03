import { Comparable, Monad, Value } from './types';

export interface Identity<A> extends Monad<A>, Value<A>, Comparable {
  map<B>(f: (a: A) => B): Identity<B>;

  ap<B>(f: Identity<(a: A) => B>): Identity<B>;

  chain<B>(f: (a: A) => Identity<B>): Identity<B>;
}

export default function identity<A>(x: A): Identity<A> {
  return {
    map: <B>(f: (a: A) => B): Identity<B> => {
      return identity(f(x));
    },
    ap: <B>(f: Identity<(a: A) => B>): Identity<B> => {
      return f.map(g => g(x));
    },
    chain: <B>(f: (a: A) => Identity<B>): Identity<B> => {
      return f(x);
    },
    value: (): A => x,
    equals: (other: any): boolean =>
      other && typeof other.value === 'function' && other.value() === x
  };
}
