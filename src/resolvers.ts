import TypeError from './TypeError';

function toStringFn<T extends string | undefined>(x: any, fallback?: T): T | string {
  if (typeof x === 'string') {
    return x;
  }
  if (typeof x === 'undefined' && typeof fallback === 'string') {
    return fallback;
  }
  if (typeof x === 'undefined') {
    return undefined as T;
  }
  try {
    return JSON.stringify(x);
  } catch {
    throw new TypeError(`Not a string: ${x}`);
  }
}

export function toString(x: any) {
  return (fallback?: string | undefined) => toStringFn(x, fallback);
}

function toNumberFn<T extends number | undefined>(x: any, fallback?: T): T | number {
  if (typeof x === 'number') {
    return x;
  }
  if (typeof x === 'undefined' && typeof fallback === 'number') {
    return fallback;
  }
  if (typeof x === 'undefined') {
    return undefined as T;
  }
  const n = parseFloat(x);
  if (!isNaN(n)) {
    return n;
  } else {
    throw new TypeError(`Not a number: ${x}`);
  }
}

export function toNumber(x: any) {
  return (fallback?: number | undefined) => toNumberFn(x, fallback);
}

function toObjectFn<T extends object | undefined>(x: any, fallback?: T): T | object {
  if (typeof x === 'object') {
    return x;
  }
  if (typeof x === 'undefined' && typeof fallback === 'object') {
    return fallback;
  }
  if (typeof x === 'undefined') {
    return undefined as T;
  }
  if (typeof x === 'string') {
    try {
      const o = JSON.parse(x);
      if (typeof o === 'object') {
        return o;
      }
    } catch {
      // do nothing
    }
  }
  throw new TypeError(`Not an object: ${x}`);
}

export function toObject(x: any) {
  return (fallback?: object | undefined) => toObjectFn(x, fallback);
}

function toArrayFn<T extends any[] | undefined>(x: any, fallback?: T): T | any[] {
  if (Array.isArray(x)) {
    return x;
  }
  if (typeof x === 'undefined' && Array.isArray(fallback)) {
    return fallback;
  }
  if (typeof x === 'undefined') {
    return undefined as T;
  }
  if (typeof x === 'string') {
    try {
      const o = JSON.parse(x);
      if (Array.isArray(o)) {
        return o;
      }
    } catch {
      // do nothing
    }
  }
  throw new TypeError(`Not an array: ${x}`);
}

export function toArray(x: any) {
  return (fallback?: any[] | undefined) => toArrayFn(x, fallback);
}

function toBoolFn<T extends boolean | undefined>(x: any, fallback?: T): T | boolean {
  if (typeof x === 'boolean') {
    return x;
  }
  if (typeof x === 'undefined' && typeof fallback === 'boolean') {
    return fallback;
  }
  if (x === 'true') {
    return true;
  }
  if (x === 'false') {
    return false;
  }
  return !!x;
}

export function toBool(x: any) {
  return (fallback?: boolean | undefined) => toBoolFn(x, fallback);
}

function toFunctionFn<T extends Function | undefined>(x: any, fallback?: T): T | Function {
  if (typeof x === 'function') {
    return x;
  }
  if (typeof x === 'undefined' && typeof fallback === 'function') {
    return fallback;
  }
  if (typeof x === 'undefined') {
    return undefined as T;
  }
  throw new TypeError(`Not a function: ${x}`);
}

export function toFunction(x: any) {
  return (fallback?: Function | undefined) => toFunctionFn(x, fallback);
}

function toSymbolFn<T extends Symbol | undefined>(x: any, fallback?: T): T | Symbol {
  if (typeof x === 'symbol') {
    return x;
  }
  if (typeof x === 'undefined' && typeof fallback === 'symbol') {
    return fallback;
  }
  if (typeof x === 'undefined') {
    return undefined as T;
  }
  if (typeof x === 'string') {
    return Symbol.for(x);
  }
  throw new TypeError(`Not a symbol: ${x}`);
}

export function toSymbol(x: any) {
  return (fallback?: Symbol | undefined) => toSymbolFn(x, fallback);
}
