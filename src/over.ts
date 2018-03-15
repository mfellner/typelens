import { IdentityFunctor } from './functors';
import { Indexable } from './Indexable';
import { Lens } from './lens';

export default function over<T extends Indexable>(
  lensFn: Lens<T>
): (f: ((x: any) => any)) => (obj: T) => any | undefined {
  return (f: ((x: any) => any)) => (obj: T) => lensFn(y => IdentityFunctor(f(y)))(obj).value();
}
