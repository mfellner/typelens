import set from '../src/set';

describe('set', () => {
  test('should not modify the input', () => {
    const original = { x: 33 };
    let result = set('x')(33)(original).get();
    expect(result).toEqual({ x: 33 });
    expect(result).not.toBe(original);
    result = set('x')(42)(original).get();
    expect(result).toEqual({ x: 42 });
    expect(result).not.toBe(original);
  });

  test('(path) should not modify the input', () => {
    const original = { x: { y: { z: 0 } } };
    let result = set(['x', 'y', 'z'])(0)(original).get();
    expect(result).toEqual({ x: { y: { z: 0 } } });
    expect(result).not.toBe(original);
    result = set(['x', 'y', 'z'])(42)(original).get();
    expect(result).toEqual({ x: { y: { z: 42 } } });
    expect(result).not.toBe(original);
  });

  test('should work with objects', () => {
    const result = set(['x', 'y', 'z'])(42)({ x: { y: { z: 0 } } }).get();
    expect(result).toEqual({ x: { y: { z: 42 } } });
  });

  test('should work with arrays', () => {
    const result = set(1)(42)([1, 2, 3]).get();
    expect(result).toEqual([1, 42, 3]);
  });

  test('should work with mixed objects', () => {
    const result = set(['x', 1, 'z'])(42)({ x: [null, { z: 0 }] }).get();
    expect(result).toEqual({ x: [null, { z: 42 }] });
  });

  test('should create a non-existing path', () => {
    const result = set(['x', 0, 'z'])(42)({ a: 'a' }).get();
    expect(result).toEqual({ a: 'a', x: [{ z: 42 }] });
  });

  test('path should handle null values', () => {
    expect(set('x')(42)(undefined as any).get()).toBeUndefined();
    expect(set(['x', 'y', 'z'])(42)(undefined as any).get()).toBeUndefined();
    expect(set(['x', 'y', 'z'])(42)(null as any).get()).toBeUndefined();
  });
});
