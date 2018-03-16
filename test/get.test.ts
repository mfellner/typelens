import get from '../src/get';

describe('get', () => {
  test('should work with objects', () => {
    const x = get('x')({ x: 42 }).get(_ => _);
    expect(get('x')({ x: 42 })).toEqual(42);
    expect(get('y')({ x: 42 })).toBeUndefined();
  });

  test('should work with arrays', () => {
    expect(get(0)([1, 2, 3])).toEqual(1);
  });

  test('should work with class instances', () => {
    const obj = new class {
      public readonly x = 42;
      get y() {
        return '42';
      }
    }();
    expect(get('x')(obj)).toEqual(42);
    expect(get('y')(obj)).toEqual('42');
    expect(get('z')(obj)).toBeUndefined();
  });

  test('should handle null values', () => {
    expect(get('x')(undefined as any)).toBeUndefined();
    expect(get('x')(null as any)).toBeUndefined();
  });

  test('path work with objects', () => {
    expect(get(['x', 'y', 'z'])({ x: { y: { z: 42 } } })).toEqual(42);
    expect(get(['x', 'y', 'f'])({ x: { y: { z: 42 } } })).toBeUndefined();
    expect(get([])({ x: { y: { z: 42 } } })).toEqual({ x: { y: { z: 42 } } });
  });

  test('path work with mixed objects', () => {
    expect(get(['x', 1, 'z'])({ x: [null, { z: 42 }] })).toEqual(42);
  });

  test('path should handle null values', () => {
    expect(get(['x', 'y', 'z'])(undefined as any)).toBeUndefined();
    expect(get(['x', 'y', 'z'])(null as any)).toBeUndefined();
  });
});
