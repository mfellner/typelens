import { Comparable, Gettable, Monad } from './types';

export interface Maybe<A> extends Monad<A>, Gettable<A>, Comparable {
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
    },
    equals: (other: any): boolean => other && typeof other.get === 'function' && other.get() === x
  };
}

function nothing(): Maybe<any> {
  return {
    map: () => NOTHING,
    ap: () => NOTHING,
    chain: () => NOTHING,
    get: <B>(f: (a?: any) => B = (_: any) => _): B | undefined => {
      return f();
    },
    equals: (other: any): boolean => other === NOTHING
  };
}

const NOTHING = nothing();

export default function maybe<A>(x?: A): Maybe<A> {
  if (typeof x === 'undefined') {
    return NOTHING;
  } else {
    return just(x);
  }
}
