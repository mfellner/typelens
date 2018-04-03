import { Indexable, Key } from './Indexable';
import maybe, { Maybe } from './maybe';

function getKey<T>(key: Key, obj: Indexable): Maybe<T> {
  if (typeof obj === 'undefined' || obj === null) {
    return maybe();
  }
  return maybe(obj[key]);
}

function getKeyCurry<T>(key: Key): (obj: Indexable) => Maybe<T> {
  return (obj: Indexable) => getKey(key, obj);
}

function getPath<T>(keys: Key[], obj: Indexable): Maybe<T> {
  let val: any = obj;
  for (const key of keys) {
    if (typeof val === 'undefined' || val === null) {
      return maybe();
    }
    val = val[key];
  }
  return maybe(val);
}

function getPathCurry<T>(keys: Array<string | number>): (obj: Indexable) => Maybe<T> {
  return (obj: Indexable) => getPath(keys, obj);
}

export default function get<T = any>(arg0: Key | Key[]): (obj: Indexable) => Maybe<T> {
  if (Array.isArray(arg0)) {
    return getPathCurry(arg0);
  } else {
    return getKeyCurry(arg0);
  }
}
