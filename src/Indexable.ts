export interface Indexable {
  length?: number;
  [n: number]: any;
  [s: string]: any;
}

export type Key = string | number;

export function shallowCopy<T extends Indexable>(x: T): T {
  if (Array.isArray(x)) {
    return Object.assign([], x);
  } else {
    return Object.assign({}, x);
  }
}
