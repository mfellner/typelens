import { IdentityFunctor } from './functors';
import { Indexable } from './Indexable';
import { Lens } from './lens';

export default function over<T extends Indexable, V>(
  lensFn: Lens<T, V>
): (f: ((x: any) => any)) => (obj: T) => any | undefined {
  return (f: ((x: V) => V)) => (obj: T) => lensFn(y => IdentityFunctor(f(y)))(obj).value();
}
