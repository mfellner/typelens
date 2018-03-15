import get from '../src/get';
import lens from '../src/lens';
import over from '../src/over';
import set from '../src/set';

describe('over', () => {
  test('over', () => {
    const g = (_: number) => _ * _;
    expect(over(lens(get('x'), set('x')))(g)({ x: 2, y: 4 })).toEqual({
      x: 4,
      y: 4
    });
  });
});
