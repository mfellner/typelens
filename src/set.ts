import { Indexable, Key, shallowCopy } from './Indexable';
import maybe, { Maybe } from './maybe';

function setKey<T extends Indexable, V>(key: Key, val: V, obj: T): Maybe<T> {
  if (typeof obj === 'undefined' || obj === null) {
    return maybe();
  }
  const copy: T = shallowCopy(obj);
  copy[key] = val;
  return maybe(copy);
}

function setKeyCurry<V>(key: Key): (val: V) => <T extends Indexable>(obj: T) => Maybe<T> {
  return (val: V) => <T extends Indexable>(obj: T) => setKey(key, val, obj);
}

function setPath<T extends Indexable, V>(keys: Key[], val: V, obj: T): Maybe<T> {
  if (typeof obj === 'undefined' || obj === null) {
    return maybe();
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
  return maybe(copy);
}

function setPathCurry<V>(keys: Key[]): (val: V) => <T extends Indexable>(obj: T) => Maybe<T> {
  return (val: V) => <T extends Indexable>(obj: T) => setPath(keys, val, obj);
}

export default function set<V = any>(
  key: Key | Key[]
): (val: V) => <T extends Indexable>(obj: T) => Maybe<T> {
  if (Array.isArray(key)) {
    return setPathCurry(key);
  } else {
    return setKeyCurry(key);
  }
}
