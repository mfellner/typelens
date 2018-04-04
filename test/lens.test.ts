import get from '../src/get';
import { lens, lensKey } from '../src/lens';
import set from '../src/set';

describe('Lens', () => {
  test('view with get and set', () => {
    const v = lens(get('x'), set('x'))
      .view({ x: 42, y: 33 })
      .get();
    expect(v).toEqual(42);
  });

  test('view with key', () => {
    const v = lensKey('x')
      .view({ x: 42 })
      .get();
    expect(v).toEqual(42);
  });

  test('set', () => {
    const v = lens(get('x'), set('x'))
      .set(42)({ x: 1, y: 2 })
      .get();
    expect(v).toEqual({ x: 42, y: 2 });
  });

  test('over x to x', () => {
    const g = (_: number) => _ * _;
    const v = lens(get('x'), set('x'))
      .over(g)({ x: 4, y: 2 })
      .get();
    expect(v).toEqual({ x: 16, y: 2 });
  });

  test('over x to y', () => {
    const g = (_: number) => _ * _;
    const v = lens(get('x'), set('y'))
      .over(g)({ x: 4, y: 2 })
      .get();
    expect(v).toEqual({ x: 4, y: 16 });
  });

  test('compose and view', () => {
    const l1 = lens(get('x'), set('x'));
    const l2 = lens(get('y'), set('y'));
    const l3 = l1.andThen(l2);
    const v = l3.view({ x: { y: 42 } }).get();
    expect(l1.view({ x: { y: 42 } }).get()).toEqual({ y: 42 });
    expect(l2.view({ y: 42 }).get()).toEqual(42);
    expect(v).toEqual(42);
  });

  test('compose and set', () => {
    const l1 = lens(get('x'), set('x'));
    const l2 = lens(get('y'), set('y'));
    const l3 = l1.andThen(l2);
    const v = l3
      .set(42)({ x: { y: 2 } })
      .get();
    expect(v).toEqual({ y: 42 });
  });
});
