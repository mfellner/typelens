import { Indexable, shallowCopy } from './Indexable';
import { Functor, Value } from './types';

export default class Collection<A> implements Functor<A>, Value<Indexable> {
  private readonly x: Indexable;

  constructor(x: Indexable) {
    this.x = x;
  }

  public map<B>(f: (a: A) => B): Collection<B> {
    const copy = shallowCopy(this.x);
    if (typeof copy.length === 'number') {
      for (let i = 0; i < copy.length; i += 1) {
        copy[i] = f(copy[i]);
      }
    } else {
      for (const k of Object.keys(copy)) {
        copy[k] = f(copy[k]);
      }
    }
    return new Collection(copy);
  }

  public value(): Indexable {
    return this.x;
  }
}
