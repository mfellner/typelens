import get from '../src/get';
import lens from '../src/lens';
import set from '../src/set';
import view from '../src/view';

describe('view', () => {
  test('view', () => {
    // const g = get<number>('x')({}).get();
    // const l = lens(get<number>('x'), set<number>('x'));
    const v = view(lens(get<number>('x'), set<number>('x')))({ x: 42, y: 33 }).get();
    expect(v).toEqual(42);
  });
});
