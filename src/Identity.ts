import { Comparable, Monad, Value } from './types';

export default class Identity<A> extends Monad<A> implements Comparable<Identity<A>>, Value<A> {
  public map<B>(f: (a: A) => B): Identity<B> {
    return new Identity(f(this.x));
  }

  public ap<B>(f: Identity<(a: A) => B>): Identity<B> {
    return new Identity(f.x(this.x));
  }

  public chain<B>(f: (a: A) => Identity<B>): Identity<B> {
    return f(this.x);
  }

  public equals(other: Identity<A>): boolean {
    return this.x === other.x;
  }

  public value(): A {
    return this.x;
  }
}
