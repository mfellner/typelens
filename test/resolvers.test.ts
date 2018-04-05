import * as resolvers from '../src/resolvers';
import TypeError from '../src/TypeError';

// toString ********************************************************************

test('string toString', () => {
  expect(resolvers.toString(f => f('test'))()).toEqual('test');
});

test('number toString', () => {
  expect(resolvers.toString(f => f(42))()).toEqual('42');
});

test('fallback toString', () => {
  expect(resolvers.toString(f => f())('42')).toEqual('42');
});

test('object toString', () => {
  expect(resolvers.toString(f => f({ x: 42 }))()).toEqual('{"x":42}');
});

test('undefined toString', () => {
  expect(resolvers.toString(f => f())()).toBeUndefined();
});

test('toString should throw', () => {
  const x = {} as any;
  x.x = x;
  expect(() => resolvers.toString(f => f(x))()).toThrowError(TypeError);
});

// toNumber ********************************************************************

test('number toNumber', () => {
  expect(resolvers.toNumber(f => f(42))()).toEqual(42);
});

test('string toNumber', () => {
  expect(resolvers.toNumber(f => f('42'))()).toEqual(42);
});

test('fallback toNumber', () => {
  expect(resolvers.toNumber(f => f())(42)).toEqual(42);
});

test('undefined toNumber', () => {
  expect(resolvers.toNumber(f => f())()).toBeUndefined();
});

test('toNumber should throw', () => {
  expect(() => resolvers.toNumber(f => f('test'))()).toThrowError(TypeError);
});

// toObject ********************************************************************

test('object toObject', () => {
  expect(resolvers.toObject(f => f({ x: 42 }))()).toEqual({ x: 42 });
});

test('string toObject', () => {
  expect(resolvers.toObject(f => f('{"x":42}'))()).toEqual({ x: 42 });
});

test('fallback toObject', () => {
  expect(resolvers.toObject(f => f())({ x: 42 })).toEqual({ x: 42 });
});

test('undefined toObject', () => {
  expect(resolvers.toObject(f => f())()).toBeUndefined();
});

test('toObject should throw', () => {
  expect(() => resolvers.toObject(f => f('test'))()).toThrowError(TypeError);
  expect(() => resolvers.toObject(f => f('42'))()).toThrowError(TypeError);
  expect(() => resolvers.toObject(f => f(42))()).toThrowError(TypeError);
});

// toBool **********************************************************************

test('boolean toBool', () => {
  expect(resolvers.toBool(f => f(true))()).toEqual(true);
});

test('string toBool', () => {
  expect(resolvers.toBool(f => f('true'))()).toEqual(true);
  expect(resolvers.toBool(f => f('false'))()).toEqual(false);
});

test('number toBool', () => {
  expect(resolvers.toBool(f => f(0))()).toEqual(false);
  expect(resolvers.toBool(f => f(1))()).toEqual(true);
});

test('object toBool', () => {
  expect(resolvers.toBool(f => f({}))()).toEqual(true);
  expect(resolvers.toBool(f => f(null))()).toEqual(false);
});

test('fallback toBool', () => {
  expect(resolvers.toBool(f => f())(true)).toEqual(true);
});

test('undefined toBool', () => {
  expect(resolvers.toBool(f => f())()).toEqual(false);
});

// toFunction ******************************************************************

test('function toFunction', () => {
  const fn = () => 42;
  expect(resolvers.toFunction(f => f(fn))()!()).toEqual(42);
});

test('fallback toFunction', () => {
  const fn: Function = () => 42;
  expect(resolvers.toFunction(f => f())(fn)!()).toEqual(42);
});

test('undefined toFunction', () => {
  expect(resolvers.toFunction(f => f())()).toBeUndefined();
});

test('toFunction should throw', () => {
  expect(() => resolvers.toFunction(f => f('test'))()).toThrowError(TypeError);
});

// toSymbol ********************************************************************

test('symbol toSymbol', () => {
  const s = Symbol();
  expect(resolvers.toSymbol(f => f(s))()).toEqual(s);
});

test('fallback toSymbol', () => {
  const s = Symbol();
  expect(resolvers.toSymbol(f => f())(s)).toEqual(s);
});

test('string toSymbol', () => {
  const s = Symbol.for('toSymbol:test');
  expect(resolvers.toSymbol(f => f('toSymbol:test'))()).toEqual(s);
});

test('undefined toSymbol', () => {
  expect(resolvers.toSymbol(f => f())()).toBeUndefined();
});

test('toSymbol should throw', () => {
  expect(() => resolvers.toSymbol(f => f(42))()).toThrowError(TypeError);
});
