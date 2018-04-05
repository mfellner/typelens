import { toArray, toBool, toFunction, toNumber, toObject, toString, toSymbol } from './resolvers';
import { Comparable, Gettable, Monad } from './types';

export interface Maybe<A> extends Monad<A>, Gettable<A>, Comparable {
  map<B>(f: (a: A) => B): Maybe<B>;
  ap<B>(f: Maybe<(a: A) => B>): Maybe<B>;
  chain<B>(f: (a: A) => Maybe<B>): Maybe<B>;
  get<B = A>(): B | undefined;
  get<B>(f: (a?: A) => B): B;
}

export interface ResolvableMaybe<A> extends Maybe<A> {
  map<B>(f: (a: A) => B): ResolvableMaybe<B>;
  ap<B>(f: ResolvableMaybe<(a: A) => B>): ResolvableMaybe<B>;
  chain<B>(f: (a: A) => ResolvableMaybe<B>): ResolvableMaybe<B>;

  getString(fallback: string): string;
  /**
   * Resolves the value to a string.
   *
   * @param fallback Optional fallback value.
   * @throws TypeError If the value cannot be interpreted as a string.
   * @returns The original string or a stringified object.
   */
  getString(fallback?: string | undefined): string | undefined;

  getNumber(fallback: number): number;
  /**
   * Resolves the value to a number.
   *
   * @param fallback Optional fallback value.
   * @throws TypeError If the value cannot be parsed as a number.
   * @returns The original number or a parsed floating point number.
   */
  getNumber(fallback?: number | undefined): number | undefined;

  getObject(fallback: object): object;
  getObject(fallback?: object | undefined): object | undefined;

  getArray(fallback: any[]): any[];
  getArray(fallback?: any[] | undefined): any[] | undefined;

  getBool(fallback: boolean): boolean;
  getBool(fallback?: boolean | undefined): boolean | undefined;

  getFunction(fallback: Function): Function;
  getFunction(fallback?: Function | undefined): Function | undefined;

  getSymbol(fallback: Symbol): Symbol;
  getSymbol(fallback?: Symbol | undefined): Symbol | undefined;
}

function just<A>(x: A): ResolvableMaybe<A> {
  return {
    map: <B>(f: (a: A) => B): ResolvableMaybe<B> => {
      return just(f(x));
    },
    ap: <B>(f: ResolvableMaybe<(a: A) => B>): ResolvableMaybe<B> => {
      return f.map(g => g(x));
    },
    chain: <B>(f: (a: A) => ResolvableMaybe<B>): ResolvableMaybe<B> => {
      return f(x);
    },
    get: <B>(f: (a?: any) => B = (_: any) => _): B | undefined => {
      return f(x);
    },
    getString: toString(x),
    getNumber: toNumber(x),
    getObject: toObject(x),
    getArray: toArray(x),
    getBool: toBool(x),
    getFunction: toFunction(x),
    getSymbol: toSymbol(x),
    equals: (other: any): boolean => other && typeof other.get === 'function' && other.get() === x
  };
}

function nothing(): ResolvableMaybe<any> {
  return {
    map: () => NOTHING,
    ap: () => NOTHING,
    chain: () => NOTHING,
    get: <B>(f: (a?: any) => B = (_: any) => _): B | undefined => {
      return f();
    },
    getString: toString(undefined),
    getNumber: toNumber(undefined),
    getObject: toObject(undefined),
    getArray: toArray(undefined),
    getBool: toBool(undefined),
    getFunction: toFunction(undefined),
    getSymbol: toSymbol(undefined),
    equals: (other: any): boolean => other === NOTHING
  };
}

const NOTHING: ResolvableMaybe<any> = nothing();

export default function maybe<A>(x?: A): ResolvableMaybe<A> {
  if (typeof x === 'undefined') {
    return NOTHING;
  } else {
    return just(x);
  }
}
