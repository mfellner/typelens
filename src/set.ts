import { Indexable, Key, shallowCopy } from './Indexable';
import Maybe from './Maybe';

function setKeyValue<T extends Indexable, V>(key: Key, v: V, obj: T): T {
  const copy: T = shallowCopy(obj);
  copy[key] = v;
  return copy;
}

function setKey<T extends Indexable, V>(key: Key, val: Maybe<V> | V, obj: T): Maybe<T> {
  if (typeof obj === 'undefined' || obj === null) {
    return Maybe.of();
  }
  if (Maybe.is(val)) {
    return val.map(v => setKeyValue(key, v, obj));
  } else {
    return Maybe.of(val).map(v => setKeyValue(key, v, obj));
  }
}

function setKeyCurry<V>(
  key: Key
): (val: Maybe<V> | V) => <T extends Indexable>(obj: T) => Maybe<T> {
  return (val: Maybe<V> | V) => <T extends Indexable>(obj: T) => setKey(key, val, obj);
}

function setPathValue<T extends Indexable, V>(keys: Key[], v: V, obj: T): T {
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
  currentChild[lastKey] = v;
  return copy;
}

function setPath<T extends Indexable, V>(keys: Key[], val: Maybe<V> | V, obj: T): Maybe<T> {
  if (typeof obj === 'undefined' || obj === null) {
    return Maybe.of();
  }
  if (Maybe.is(val)) {
    return val.map(v => setPathValue(keys, v, obj));
  } else {
    return Maybe.of(val).map(v => setPathValue(keys, v, obj));
  }
}

function setPathCurry<V>(
  keys: Key[]
): (val: Maybe<V> | V) => <T extends Indexable>(obj: T) => Maybe<T> {
  return (val: Maybe<V> | V) => <T extends Indexable>(obj: T) => setPath(keys, val, obj);
}

export default function set<V = any>(
  key: Key | Key[]
): (val: Maybe<V> | V) => <T extends Indexable>(obj: T) => Maybe<T> {
  if (Array.isArray(key)) {
    return setPathCurry(key);
  } else {
    return setKeyCurry(key);
  }
}
