import { Functor, Value } from './types';

export abstract class ValueFunctor<V> implements Functor<V>, Value<V> {
  protected readonly v: V;

  protected constructor(v: V) {
    this.v = v;
  }

  public abstract map<B>(f: (a: V) => B): ValueFunctor<B>;

  public value(): V {
    return this.v;
  }
}

export class ConstFunctor<V> extends ValueFunctor<V> {
  public static of<V>(v: V): ConstFunctor<V> {
    return new ConstFunctor(v);
  }

  public map<B>(_: (a: V) => B): ValueFunctor<B> {
    return this as any;
  }
}

export class IdentityFunctor<V> extends ValueFunctor<V> {
  public static of<V>(v: V): IdentityFunctor<V> {
    return new IdentityFunctor(v);
  }

  public map<B>(f: (a: V) => B): IdentityFunctor<B> {
    return new IdentityFunctor(f(this.v));
  }
}
