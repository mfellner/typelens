import { ConstFunctor } from './functors';
import { Indexable } from './Indexable';
import { Lens } from './lens';

export default function view<T extends Indexable>(lensFn: Lens<T>): (obj: T) => any | undefined {
  return (obj: T) => lensFn<any>(ConstFunctor)(obj).value();
}
