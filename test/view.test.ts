import get from '../src/get';
import lens from '../src/lens';
import set from '../src/set';
import view from '../src/view';

describe('view', () => {
  test('view', () => {
    const v = view(lens(get<number>('x'), set('x')))({ x: 42, y: 33 });
    expect(v).toEqual(42);
  });
});
