import { ValueFunctor } from './functors';
import { Indexable } from './Indexable';

export type ToFunctor<V> = (v: V) => ValueFunctor<V>;
export type Lens<T extends Indexable> = <V>(toFunctor: ToFunctor<V>) => (obj: T) => ValueFunctor<V>;

export default function lens<T extends Indexable>(
  getter: ((obj: T) => any | undefined),
  setter: ((val: any) => (obj: T) => any | undefined)
): Lens<T> {
  return <V>(toFunctor: ToFunctor<V>) => (target: T) =>
    toFunctor(getter(target)).map(focus => setter(focus)(target));
}
