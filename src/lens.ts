import { ValueFunctor } from './functors';
import { Indexable } from './Indexable';

export type ToFunctor<A, B> = (a: A) => ValueFunctor<B>;
export type Lens<T extends Indexable, A, B> = (
  toFunctor: ToFunctor<A, B>
) => (obj: T) => ValueFunctor<B>;

export default function lens<T extends Indexable, A, B>(
  get: ((obj: T) => A),
  set: ((val: B) => (obj: T) => any)
): Lens<T, A, B> {
  return (toFunctor: ToFunctor<A, B>) => (target: T) =>
    toFunctor(get(target)).map(focus => set(focus)(target));
}
