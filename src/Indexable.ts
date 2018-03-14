export interface Indexable {
  length?: number;
  [n: number]: any;
  [s: string]: any;
}

export function isIndexable(x: any): x is Indexable {
  return x && typeof x === 'object';
}

export function shallowCopy<T extends Indexable>(x: T): T {
  if (Array.isArray(x)) {
    return Object.assign([], x);
  } else {
    return Object.assign({}, x);
  }
}
