import { ConstFunctor, IdentityFunctor, ValueFunctor } from './functors';
import { Indexable } from './Indexable';

export type Key = string | number;

function getKeyFn(key: Key, obj: Indexable): any | undefined {
  if (typeof obj === 'undefined' || obj === null) {
    return;
  }
  return obj[key];
}

function getKey(key: Key): (obj: Indexable) => any | undefined {
  return (obj: Indexable) => getKeyFn(key, obj);
}

function getPathFn(keys: Key[], obj: Indexable): any | undefined {
  let val: any = obj;
  for (const key of keys) {
    if (typeof val === 'undefined' || val === null) {
      return;
    }
    val = val[key];
  }
  return val;
}

function getPath(keys: Array<string | number>): (obj: Indexable) => any | undefined {
  return (obj: Indexable) => getPathFn(keys, obj);
}

export function get(arg0: Key | Key[]): (obj: Indexable) => any | undefined {
  if (Array.isArray(arg0)) {
    return getPath(arg0);
  } else {
    return getKey(arg0);
  }
}

function shallowCopy<T extends Indexable>(obj: T): T {
  if (Array.isArray(obj)) {
    return Object.assign([], obj);
  } else {
    return Object.assign({}, obj);
  }
}

function setKeyFn<T extends Indexable>(key: Key, val: any, obj: T): T | undefined {
  if (typeof obj === 'undefined' || obj === null) {
    return;
  }
  const copy: T = shallowCopy(obj);
  copy[key] = val;
  return copy;
}

function setKey(key: Key): (val: any) => <T extends Indexable>(obj: T) => T | undefined {
  return (val: any) => <T extends Indexable>(obj: T) => setKeyFn(key, val, obj);
}

function setPath(
  keys: Key[]
): (val: any) => <T extends Indexable>(obj: T) => Indexable | undefined {
  return (val: any) => <T extends Indexable>(obj: T) => {
    if (typeof obj === 'undefined' || obj === null) {
      return;
    }
    const copy = shallowCopy(obj);
    let currentChild: Indexable = copy;
    for (let i = 0; i < keys.length - 1; i += 1) {
      const k = keys[i];
      if (typeof currentChild[k] === 'undefined' || currentChild[k] === null) {
        currentChild[k] = typeof keys[i + 1] === 'number' ? [] : {};
      }
      currentChild = currentChild[keys[i]];
    }
    const lastKey = keys[keys.length - 1];
    currentChild[lastKey] = val;
    return copy;
  };
}

export function set(
  arg0: Key | Key[]
): (val: any) => <T extends Indexable>(obj: T) => Indexable | undefined {
  if (Array.isArray(arg0)) {
    return setPath(arg0);
  } else {
    return setKey(arg0);
  }
}

// export interface Functor {
//   map(f: (...args: any[]) => any): Functor;
// }

// export interface Container<T> extends Functor {
//   map(f: (...args: any[]) => any): Container<T>;
//   value(): T;
// }

// function isFunctor(obj: any): obj is Functor {
//   return obj && typeof obj.map === 'function';
// }

// function toContainer<T extends Indexable>(obj: T): Container<T> {
//   if (isFunctor(obj)) {
//     return {
//       map(f: (...args: any[]) => any) {
//         const copy = obj.map(f) as any;
//         return toContainer(copy);
//       },
//       value() {
//         return obj;
//       }
//     };
//   }
//   return {
//     map(f: (...args: any[]) => any) {
//       const copy = shallowCopy(obj);
//       if (typeof copy.length === 'number') {
//         for (let i = 0; i < copy.length; i += 1) {
//           copy[i] = f(copy[i]);
//         }
//       } else {
//         for (const k of Object.keys(copy)) {
//           copy[k] = f(copy[k]);
//         }
//       }
//       return toContainer(copy);
//     },
//     value() {
//       return obj;
//     }
//   };
// }

// function mapFn<T>(f: (...args: any[]) => any, obj: Container<T>): Container<T> | undefined {
//   if (typeof obj === 'undefined' || obj === null) {
//     return;
//   }
//   // return obj.map(f).value();
//   // const copy = shallowCopy(obj);
//   // if (typeof copy.length === 'number') {
//   //   for (let i = 0; i < copy.length; i += 1) {
//   //     copy[i] = fn(copy[i]);
//   //   }
//   // } else {
//   //   for (const k of Object.keys(copy)) {
//   //     copy[k] = fn(copy[k]);
//   //   }
//   // }
//   // return copy;
// }

// export function map<T extends Indexable>(fn: (val: T[keyof T]) => any): (obj: T) => T | undefined {
//   // return (obj: T) => mapFn(fn, obj);
//   return (obj: T) =>
//     toContainer(obj)
//       .map(fn)
//       .value();
// }

export type LensFunction<T extends Indexable> = (
  toFunctor: <V>(v: V) => ValueFunctor<V>
) => (obj: T) => T;

export function lens<T extends Indexable>(
  getter: ((obj: T) => any | undefined),
  setter: ((val: any) => (obj: T) => any | undefined)
): LensFunction<T> {
  return (toFunctor: <V>(v: V) => ValueFunctor<V>) => (target: T) =>
    toFunctor(getter(target))
      .map(focus => setter(focus)(target))
      .value();
}

// <T>(x: T) => Functor<T>
// const Const = <T>(x: T) => ({
// const Const: <T>(x: T) => Container<T> = x => ({
//   map() {
//     return this;
//   },
//   value() {
//     return x;
//   }
// });

export function view<T extends Indexable>(lensFn: LensFunction<T>): (obj: T) => any | undefined {
  return (obj: T) => lensFn(ConstFunctor.of)(obj);
}

export function over<T extends Indexable>(
  lensFn: LensFunction<T>
): (f: ((x: any) => any)) => (obj: T) => any | undefined {
  return (f: ((x: any) => any)) => (obj: T) => lensFn(y => ConstFunctor.of(f(y)))(obj);
}
