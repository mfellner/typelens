import { Indexable, Key } from './Indexable';

function getKey<T>(key: Key, obj: Indexable): T | undefined {
  if (typeof obj === 'undefined' || obj === null) {
    return;
  }
  return obj[key];
}

function getKeyCurry<T>(key: Key): (obj: Indexable) => T | undefined {
  return (obj: Indexable) => getKey(key, obj);
}

function getPath<T>(keys: Key[], obj: Indexable): T | undefined {
  let val: any = obj;
  for (const key of keys) {
    if (typeof val === 'undefined' || val === null) {
      return;
    }
    val = val[key];
  }
  return val;
}

function getPathCurry<T>(keys: Array<string | number>): (obj: Indexable) => T | undefined {
  return (obj: Indexable) => getPath(keys, obj);
}

export default function get<T = any>(arg0: Key | Key[]): (obj: Indexable) => T | undefined {
  if (Array.isArray(arg0)) {
    return getPathCurry(arg0);
  } else {
    return getKeyCurry(arg0);
  }
}
