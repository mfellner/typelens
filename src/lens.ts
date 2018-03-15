import { ValueFunctor } from './functors';
import { Indexable } from './Indexable';

export type ToFunctor<V> = (v: V) => ValueFunctor<V>;
export type Lens<T extends Indexable, V> = (toFunctor: ToFunctor<V>) => (obj: T) => ValueFunctor<V>;

export default function lens<T extends Indexable, V>(
  get: ((obj: T) => V),
  set: ((val: V) => (obj: T) => any)
): Lens<T, V> {
  return (toFunctor: ToFunctor<V>) => (target: T) =>
    toFunctor(get(target)).map(focus => set(focus)(target));
}
