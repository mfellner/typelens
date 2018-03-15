import { Indexable, Key, shallowCopy } from './Indexable';

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

export default function set(
  arg0: Key | Key[]
): (val: any) => <T extends Indexable>(obj: T) => Indexable | undefined {
  if (Array.isArray(arg0)) {
    return setPath(arg0);
  } else {
    return setKey(arg0);
  }
}
