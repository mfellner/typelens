import { ValueFunctor } from './functors';
import { Indexable } from './Indexable';

export type ToFunctor<A, B> = (a: A) => ValueFunctor<B>;
export type Lens<T extends Indexable, A, B, C> = (
  toFunctor: ToFunctor<A, B>
) => (obj: T) => ValueFunctor<C>;

export default function lens<T extends Indexable, A, B, C>(
  get: ((obj: T) => A),
  set: ((val: B) => (obj: T) => C)
): Lens<T, A, B, C> {
  return (toFunctor: ToFunctor<A, B>) => (target: T) =>
    toFunctor(get(target)).map(focus => set(focus)(target));
}
