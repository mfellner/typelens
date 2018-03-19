export interface Functor<A> {
  map<B>(f: (a: A) => B): Functor<B>;
}

export interface Apply<A> extends Functor<A> {
  ap<B>(f: Apply<(a: A) => B>): Apply<B>;
}

export interface Applicative<A> extends Apply<A> {
  map<B>(f: (a: A) => B): Applicative<B>;

  ap<B>(f: Applicative<(a: A) => B>): Applicative<B>;
}

export interface Chain<A> extends Apply<A> {
  chain<B>(f: (a: A) => Chain<B>): Chain<B>;
}

export interface Monad<A> extends Applicative<A>, Chain<A> {
  map<B>(f: (a: A) => B): Monad<B>;

  ap<B>(f: Monad<(a: A) => B>): Monad<B>;

  chain<B>(f: (a: A) => Monad<B>): Monad<B>;
}

export interface Comparable {
  equals(other: any): boolean;
}

export interface Value<T> {
  value(): T;
}
