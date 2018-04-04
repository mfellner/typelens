import { default as getFn } from './get';
import { Indexable, Key } from './Indexable';
import { Maybe } from './maybe';
import { default as setFn } from './set';

export interface Lens<T extends Indexable, A, B> {
  view(obj: T): Maybe<A>;
  set(x: any): (obj: T) => Maybe<T>;
  over(f: (x: A) => B): (obj: T) => Maybe<T>;
  andThen(l: Lens<A, A, B>): Lens<T, A, B>;
}

export function lens<T extends Indexable, A, B>(
  get: ((obj: T) => Maybe<A>),
  set: ((val: B) => (obj: T) => Maybe<T>)
): Lens<T, A, B> {
  return {
    view: (obj: T): Maybe<A> => get(obj),
    set: (x: any) => (obj: T): Maybe<T> => set(x)(obj),
    over: (f: (x: A) => B) => (obj: T): Maybe<T> =>
      get(obj)
        .map(f)
        .chain(val => set(val)(obj)),
    andThen: (l: Lens<A, A, B>) => {
      return lens(
        obj => get(obj).chain(l.view),
        (val: B) => (obj: T): Maybe<T> => get(obj).chain(l.set(val) as any /* FIXME */)
      );
    }
  };
}

export function lensKey<T extends Indexable, A, B>(key: Key | Key[]): Lens<T, A, B> {
  return lens<T, A, B>(getFn(key), setFn(key));
}
