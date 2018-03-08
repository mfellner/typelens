interface Indexable {
  length?: number;
  [n: number]: any;
  [s: string]: any;
}

type Key = string | number;

function getKey<T>(key: keyof T): (obj: T) => T[keyof T] | undefined {
  return (obj: T) => obj[key];
}

function getPathFn<T extends Indexable>(keys: Array<string | number>, obj: T): any | undefined {
  let val: any = obj;
  for (const key of keys) {
    if (typeof val === 'undefined' || val === null) {
      return;
    }
    val = val[key];
  }
  return val;
}

function getPath<T extends Indexable>(keys: Array<string | number>): (obj: T) => any | undefined {
  return (obj: T) => getPathFn(keys, obj);
}

function get<T>(key: keyof T): (obj: T) => T[keyof T] | undefined;
function get<T extends Indexable>(keys: Key[]): (obj: T) => any | undefined;
function get<T>(arg0: keyof T | Key[]) {
  if (Array.isArray(arg0)) {
    return getPath(arg0);
  } else {
    return getKey(arg0);
  }
}

function setKeyFn<T extends Indexable>(key: Key, val: any, obj: T): T | undefined {
  if (typeof obj === 'undefined' || obj === null) {
    return;
  }
  if (Array.isArray(obj)) {
    const arr: T = Object.assign([], obj);
    arr[key] = val;
    return arr;
  } else {
    return Object.assign({}, obj, { [key]: val });
  }
}

function setKey<T extends Indexable>(key: Key): (val: any) => (obj: T) => T | undefined {
  return (val: any) => (obj: T) => setKeyFn(key, val, obj);
}

function setPath<T extends Indexable>(
  keys: Key[]
): (val: any) => (obj: T) => Indexable | undefined {
  return (val: any) => (obj: T) => {
    const child = getPathFn(keys.slice(0, keys.length - 1), obj);
    const lastKey = keys[keys.length - 1];
    return setKeyFn<Indexable>(lastKey, val, child);
  };
}
