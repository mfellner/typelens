import { Comparable, Monad } from './types';

export default abstract class Maybe<A> extends Monad<A> implements Comparable<Maybe<A>> {
  public static is<A>(obj: any): obj is Maybe<A> {
    return obj instanceof Maybe;
  }

  public static of(x?: any): Maybe<any> {
    if (typeof x === 'undefined') {
      return nothing;
    } else {
      return new Just(x);
    }
  }

  public abstract map<B>(f: (a: A) => B): Maybe<B>;

  public abstract ap<B>(f: Maybe<(a: A) => B>): Maybe<B>;

  public abstract chain<B>(f: (a: A) => Maybe<B>): Maybe<B>;

  public abstract equals(other: Maybe<A>): boolean;

  public abstract get<B = A>(): B | undefined;

  public abstract get<B>(f: (a?: A) => B): B;
}

export class Just<A> extends Maybe<A> {
  public map<B>(f: (a: A) => B): Just<B> {
    return new Just(f(this.x));
  }

  public ap<B>(f: Just<(a: A) => B>): Just<B> {
    return new Just(f.x(this.x));
  }

  public chain<B>(f: (a: A) => Just<B>): Just<B> {
    return f(this.x);
  }

  public equals(other: Just<A>): boolean {
    return this.x === other.x;
  }

  public get<B>(): B | undefined;
  public get<B>(f: (a?: A) => B): B;
  public get<B>(f: (a?: A) => B = (_: any) => _): B | undefined {
    return f(this.x);
  }
}

export class Nothing extends Maybe<any> {
  constructor() {
    super(undefined);
  }

  public map() {
    return this;
  }

  public ap() {
    return this;
  }

  public chain() {
    return this;
  }

  public equals(other: Nothing): boolean {
    return other instanceof Nothing;
  }

  public get<B>(): B | undefined;
  public get<B>(f: (a?: any) => B): B;
  public get<B>(f: (a?: any) => B = (_: any) => _): B | undefined {
    return f();
  }
}

const nothing = new Nothing();
