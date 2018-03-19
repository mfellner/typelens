import get from '../src/get';
import lens from '../src/lens';
import set from '../src/set';

describe('Lens', () => {
  test('view', () => {
    const v = lens(get('x'), set('x'))
      .view({ x: 42, y: 33 })
      .get();
    expect(v).toEqual(42);
  });

  test('over', () => {
    const g = (_: number) => _ * _;
    const v = lens(get('x'), set('x'))
      .over(g)({ x: 4, y: 2 })
      .get();
    expect(v).toEqual({ x: 16, y: 2 });
  });
});
