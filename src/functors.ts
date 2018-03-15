import { Functor, Value } from './types';

export interface ValueFunctor<V> extends Functor<V>, Value<V> {
  map<B>(f: (a: V) => B): ValueFunctor<B>;
  value(): V;
}

export function ConstFunctor<V>(v: V): ValueFunctor<V> {
  return {
    map() {
      return this as ValueFunctor<any>;
    },
    value() {
      return v;
    }
  };
}

export function IdentityFunctor<V>(v: V): ValueFunctor<V> {
  return {
    map<B>(f: (a: V) => B) {
      return IdentityFunctor(f(v));
    },
    value() {
      return v;
    }
  };
}
