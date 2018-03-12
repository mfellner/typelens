import * as lens from '../src';

test('get should work with objects', () => {
  expect(lens.get('x')({ x: 42 })).toEqual(42);
  expect(lens.get('y')({ x: 42 })).toBeUndefined();
});

test('get should work with arrays', () => {
  expect(lens.get(0)([1, 2, 3])).toEqual(1);
});

test('get should work with class instances', () => {
  const obj = new class {
    public readonly x = 42;
    get y() {
      return '42';
    }
  }();
  expect(lens.get('x')(obj)).toEqual(42);
  expect(lens.get('y')(obj)).toEqual('42');
  expect(lens.get('z')(obj)).toBeUndefined();
});

test('get should handle null values', () => {
  expect(lens.get('x')(undefined as any)).toBeUndefined();
  expect(lens.get('x')(null as any)).toBeUndefined();
});

test('get path work with objects', () => {
  expect(lens.get(['x', 'y', 'z'])({ x: { y: { z: 42 } } })).toEqual(42);
  expect(lens.get(['x', 'y', 'f'])({ x: { y: { z: 42 } } })).toBeUndefined();
  expect(lens.get([])({ x: { y: { z: 42 } } })).toEqual({ x: { y: { z: 42 } } });
});

test('get path work with mixed objects', () => {
  expect(lens.get(['x', 1, 'z'])({ x: [null, { z: 42 }] })).toEqual(42);
});

test('get path should handle null values', () => {
  expect(lens.get(['x', 'y', 'z'])(undefined as any)).toBeUndefined();
  expect(lens.get(['x', 'y', 'z'])(null as any)).toBeUndefined();
});

test('set should not modify the input', () => {
  const original = { x: 33 };
  let result = lens.set('x')(33)(original);
  expect(result).toEqual({ x: 33 });
  expect(result).not.toBe(original);
  result = lens.set('x')(42)(original);
  expect(result).toEqual({ x: 42 });
  expect(result).not.toBe(original);
});

test('set (path) should not modify the input', () => {
  const original = { x: { y: { z: 0 } } };
  let result = lens.set(['x', 'y', 'z'])(0)(original);
  expect(result).toEqual({ x: { y: { z: 0 } } });
  expect(result).not.toBe(original);
  result = lens.set(['x', 'y', 'z'])(42)(original);
  expect(result).toEqual({ x: { y: { z: 42 } } });
  expect(result).not.toBe(original);
});

test('set should work with objects', () => {
  expect(lens.set(['x', 'y', 'z'])(42)({ x: { y: { z: 0 } } })).toEqual({ x: { y: { z: 42 } } });
});

test('set should work with arrays', () => {
  expect(lens.set(1)(42)([1, 2, 3])).toEqual([1, 42, 3]);
});

test('set should work with mixed objects', () => {
  expect(lens.set(['x', 1, 'z'])(42)({ x: [null, { z: 0 }] })).toEqual({ x: [null, { z: 42 }] });
});

test('set should create a non-existing path', () => {
  expect(lens.set(['x', 0, 'z'])(42)({ a: 'a' })).toEqual({ a: 'a', x: [{ z: 42 }] });
});

test('set path should handle null values', () => {
  expect(lens.set('x')(42)(undefined as any)).toBeUndefined();
  expect(lens.set(['x', 'y', 'z'])(42)(undefined as any)).toBeUndefined();
  expect(lens.set(['x', 'y', 'z'])(42)(null as any)).toBeUndefined();
});

test('map should work with objects', () => {
  expect(lens.map((x: number) => x + 1)({ x: 1, y: 2, z: 3 })).toEqual({ x: 2, y: 3, z: 4 });
});

test('map should work with arrays', () => {
  expect(lens.map((x: number) => x + 1)([1, 2, 3])).toEqual([2, 3, 4]);
});

test.only('view', () => {
  const foo = lens.view(lens.lens(lens.get('x'), lens.set('x')))({ x: 42, y: 33 });
  expect(lens.view(lens.lens(lens.get('x'), lens.set('x')))({ x: 42, y: 33 })).toEqual(42);
});
