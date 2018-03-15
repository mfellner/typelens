import get from '../src/get';
import lens from '../src/lens';
import set from '../src/set';
import view from '../src/view';

describe('view', () => {
  test('view', () => {
    expect(view(lens(get('x'), set('x')))({ x: 42, y: 33 })).toEqual(42);
  });
});
