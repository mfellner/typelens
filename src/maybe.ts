import { toBool, toFunction, toNumber, toObject, toString, toSymbol } from './resolvers';
import { Comparable, Gettable, Monad } from './types';

export interface Maybe<A> extends Monad<A>, Gettable<A>, Comparable {
  map<B>(f: (a: A) => B): Maybe<B>;
  ap<B>(f: Maybe<(a: A) => B>): Maybe<B>;
  chain<B>(f: (a: A) => Maybe<B>): Maybe<B>;
  get<B = A>(): B | undefined;
  get<B>(f: (a?: A) => B): B;
}

export interface ResolvableMaybe<A> extends Maybe<A> {
  getString<T extends string | undefined>(fallback?: T): T | string;
  getNumber<T extends number | undefined>(fallback?: T): T | number;
  getObject<T extends object | undefined>(fallback?: T): T | object;
  getBool<T extends boolean | undefined>(fallback?: T): T | boolean;
  getFunction<T extends Function | undefined>(fallback?: T): T | Function;
  getSymbol<T extends Symbol | undefined>(fallback?: T): T | Symbol;
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

function withResolvers<A>(m: Maybe<A>): ResolvableMaybe<A> {
  return {
    ...m,
    getString: toString(m.get),
    getNumber: toNumber(m.get),
    getObject: toObject(m.get),
    getBool: toBool(m.get),
    getFunction: toFunction(m.get),
    getSymbol: toSymbol(m.get)
  };
}

const NOTHING = withResolvers(nothing());

export default function maybe<A>(x?: A): ResolvableMaybe<A> {
  if (typeof x === 'undefined') {
    return NOTHING;
  } else {
    return withResolvers(just(x));
  }
}
