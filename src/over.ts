import { IdentityFunctor } from './functors';
import { Indexable } from './Indexable';
import { Lens } from './lens';

export default function over<T extends Indexable, A, B>(
  lensFn: Lens<T, A, B>
): (f: ((x: A) => B)) => (obj: T) => B {
  return (f: ((x: A) => B)) => (obj: T) => lensFn(y => IdentityFunctor(f(y)))(obj).value();
}
