import { ConstFunctor } from './functors';
import { Indexable } from './Indexable';
import { Lens } from './lens';

export default function view<T extends Indexable, V>(lensFn: Lens<T, V>): (obj: T) => V {
  return (obj: T) => lensFn(ConstFunctor)(obj).value();
}
