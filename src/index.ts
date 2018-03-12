export interface Indexable {
  length?: number;
  [n: number]: any;
  [s: string]: any;
}

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

function mapFn<T extends Indexable>(fn: (val: T[keyof T]) => any, obj: T): T | undefined {
  if (typeof obj === 'undefined' || obj === null) {
    return;
  }
  console.log('lets map', fn, obj);
  const copy = shallowCopy(obj);
  if (typeof copy.length === 'number') {
    for (let i = 0; i < copy.length; i += 1) {
      console.log('key', i, 'set', copy[i], 'to', fn(copy[i]));
      copy[i] = fn(copy[i]);
    }
  } else {
    for (const k of Object.keys(copy)) {
      copy[k] = fn(copy[k]);
    }
  }
  return copy;
}

export function map<T extends Indexable>(fn: (val: T[keyof T]) => any): (obj: T) => T | undefined {
  return (obj: T) => mapFn(fn, obj);
}

export type LensFunction<T extends Indexable> = (toFunctor: (x: any) => any) => (obj: T) => T;

export function lens<T extends Indexable>(
  getter: ((obj: T) => any | undefined),
  setter: ((val: any) => (obj: T) => any | undefined)
): LensFunction<T> {
  return (toFunctor: (x: any) => any) => (target: T) =>
    mapFn(focus => setter(focus)(target), toFunctor(getter(target)));
}

export function view<T extends Indexable>(lensFn: LensFunction<T>): (obj: T) => any | undefined {
  return (obj: T) => lensFn(x => [x])(obj)[0];
}
