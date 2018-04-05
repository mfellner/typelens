import * as resolvers from '../src/resolvers';
import TypeError from '../src/TypeError';

// toString ********************************************************************

test('string toString', () => {
  expect(resolvers.toString('test')()).toEqual('test');
});

test('number toString', () => {
  expect(resolvers.toString(42)()).toEqual('42');
});

test('fallback toString', () => {
  expect(resolvers.toString(undefined)('42')).toEqual('42');
});

test('object toString', () => {
  expect(resolvers.toString({ x: 42 })()).toEqual('{"x":42}');
});

test('undefined toString', () => {
  expect(resolvers.toString(undefined)()).toBeUndefined();
});

test('toString should throw', () => {
  const x = {} as any;
  x.x = x;
  expect(() => resolvers.toString(x)()).toThrowError(TypeError);
});

// toNumber ********************************************************************

test('number toNumber', () => {
  expect(resolvers.toNumber(42)()).toEqual(42);
});

test('string toNumber', () => {
  expect(resolvers.toNumber('42')()).toEqual(42);
});

test('fallback toNumber', () => {
  expect(resolvers.toNumber(undefined)(42)).toEqual(42);
});

test('undefined toNumber', () => {
  expect(resolvers.toNumber(undefined)()).toBeUndefined();
});

test('toNumber should throw', () => {
  expect(() => resolvers.toNumber('test')()).toThrowError(TypeError);
});

// toObject ********************************************************************

test('object toObject', () => {
  expect(resolvers.toObject({ x: 42 })()).toEqual({ x: 42 });
});

test('string toObject', () => {
  expect(resolvers.toObject('{"x":42}')()).toEqual({ x: 42 });
});

test('fallback toObject', () => {
  expect(resolvers.toObject(undefined)({ x: 42 })).toEqual({ x: 42 });
});

test('undefined toObject', () => {
  expect(resolvers.toObject(undefined)()).toBeUndefined();
});

test('toObject should throw', () => {
  expect(() => resolvers.toObject('test')()).toThrowError(TypeError);
  expect(() => resolvers.toObject('42')()).toThrowError(TypeError);
  expect(() => resolvers.toObject(42)()).toThrowError(TypeError);
});

// toArray *********************************************************************

test('array toArray', () => {
  expect(resolvers.toArray([1, 2, 3])()).toEqual([1, 2, 3]);
});

test('string toArray', () => {
  expect(resolvers.toArray('[1,2,3]')()).toEqual([1, 2, 3]);
});

test('fallback toArray', () => {
  expect(resolvers.toArray(undefined)([1, 2, 3])).toEqual([1, 2, 3]);
});

test('undefined toArray', () => {
  expect(resolvers.toArray(undefined)()).toBeUndefined();
});

test('toArray should throw', () => {
  expect(() => resolvers.toArray('test')()).toThrowError(TypeError);
  expect(() => resolvers.toArray('42')()).toThrowError(TypeError);
  expect(() => resolvers.toArray(42)()).toThrowError(TypeError);
});

// toBool **********************************************************************

test('boolean toBool', () => {
  expect(resolvers.toBool(true)()).toEqual(true);
});

test('string toBool', () => {
  expect(resolvers.toBool('true')()).toEqual(true);
  expect(resolvers.toBool('false')()).toEqual(false);
});

test('number toBool', () => {
  expect(resolvers.toBool(0)()).toEqual(false);
  expect(resolvers.toBool(1)()).toEqual(true);
});

test('object toBool', () => {
  expect(resolvers.toBool({})()).toEqual(true);
  expect(resolvers.toBool(null)()).toEqual(false);
});

test('fallback toBool', () => {
  expect(resolvers.toBool(undefined)(true)).toEqual(true);
});

test('undefined toBool', () => {
  expect(resolvers.toBool(undefined)()).toEqual(false);
});

// toFunction ******************************************************************

test('function toFunction', () => {
  const fn = () => 42;
  expect(resolvers.toFunction(fn)()!()).toEqual(42);
});

test('fallback toFunction', () => {
  const fn: Function = () => 42;
  expect(resolvers.toFunction(undefined)(fn)!()).toEqual(42);
});

test('undefined toFunction', () => {
  expect(resolvers.toFunction(undefined)()).toBeUndefined();
});

test('toFunction should throw', () => {
  expect(() => resolvers.toFunction('test')()).toThrowError(TypeError);
});

// toSymbol ********************************************************************

test('symbol toSymbol', () => {
  const s = Symbol();
  expect(resolvers.toSymbol(s)()).toEqual(s);
});

test('fallback toSymbol', () => {
  const s = Symbol();
  expect(resolvers.toSymbol(undefined)(s)).toEqual(s);
});

test('string toSymbol', () => {
  const s = Symbol.for('toSymbol:test');
  expect(resolvers.toSymbol('toSymbol:test')()).toEqual(s);
});

test('undefined toSymbol', () => {
  expect(resolvers.toSymbol(undefined)()).toBeUndefined();
});

test('toSymbol should throw', () => {
  expect(() => resolvers.toSymbol(42)()).toThrowError(TypeError);
});
