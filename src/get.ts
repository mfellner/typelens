import { Indexable, Key } from './Indexable';

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

export default function get(arg0: Key | Key[]): (obj: Indexable) => any | undefined {
  if (Array.isArray(arg0)) {
    return getPath(arg0);
  } else {
    return getKey(arg0);
  }
}
