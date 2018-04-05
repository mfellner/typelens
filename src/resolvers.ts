import TypeError from './TypeError';

export type Supplier = <T>(f: (a?: any) => T) => T;

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

export function toString(get: Supplier) {
  return <T extends string | undefined>(fallback?: T) => get(x => toStringFn(x, fallback));
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

export function toNumber(get: Supplier) {
  return <T extends number | undefined>(fallback?: T) => get(x => toNumberFn(x, fallback));
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

export function toObject(get: Supplier) {
  return <T extends object | undefined>(fallback?: T) => get(x => toObjectFn(x, fallback));
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

export function toBool(get: Supplier) {
  return <T extends boolean | undefined>(fallback?: T) => get(x => toBoolFn(x, fallback));
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

export function toFunction(get: Supplier) {
  return <T extends Function | undefined>(fallback?: T) => get(x => toFunctionFn(x, fallback));
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

export function toSymbol(get: Supplier) {
  return <T extends Symbol | undefined>(fallback?: T) => get(x => toSymbolFn(x, fallback));
}
