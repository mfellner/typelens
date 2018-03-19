import { Indexable } from './Indexable';
import { Maybe } from './Maybe';

export interface Lens<T extends Indexable, A, B> {
  view(obj: T): Maybe<A>;
  over(f: (x: A) => B): (obj: T) => Maybe<T>;
}

export default function lens<T extends Indexable, A, B>(
  get: ((obj: T) => Maybe<A>),
  set: ((val: B) => (obj: T) => T)
): Lens<T, A, B> {
  return {
    view: (obj: T): Maybe<A> => get(obj),
    over: (f: (x: A) => B) => (obj: T): Maybe<T> =>
      get(obj)
        .map(f)
        .map(val => set(val)(obj))
  };
}
