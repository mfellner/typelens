export interface Functor<A> {
  map<B>(f: (a: A) => B): Functor<B>;
}

export interface Apply<A> extends Functor<A> {
  ap<B>(f: Apply<(a: A) => B>): Apply<B>;
}

export abstract class Applicative<A> implements Apply<A> {
  protected readonly x: A;

  constructor(a: A) {
    this.x = a;
  }

  public abstract map<B>(f: (a: A) => B): Applicative<B>;

  public abstract ap<B>(f: Applicative<(a: A) => B>): Applicative<B>;
}

export interface Chain<A> extends Apply<A> {
  chain<B>(f: (a: A) => Chain<B>): Chain<B>;
}

export abstract class Monad<A> extends Applicative<A> implements Chain<A> {
  public abstract chain<B>(f: (a: A) => Monad<B>): Monad<B>;
}

export interface Comparable<T> {
  equals(other: T): boolean;
}

export interface Value<T> {
  value(): T;
}
