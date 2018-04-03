/**
 * Test the fantasy-land specification on the identity type.
 * https://github.com/fantasyland/fantasy-land
 */

import identity from '../src/identity';

test('identity equals', () => {
  expect(identity(42).equals(identity(42))).toBe(true);
  expect(identity(0).equals(identity(1))).toBe(false);
});

test('identity value', () => {
  expect(identity(42).value()).toEqual(42);
});

test('identity Functor identity', () => {
  const i = identity(42);
  const r = i.map(_ => _);
  expect(r.value()).toEqual(42);
  expect(r.equals(i)).toBe(true);
});

test('identity Functor composition', () => {
  const f = (_: number) => _ * _;
  const g = (_: number) => _ + 1;
  const i = identity(42);
  const r = i.map(x => f(g(x)));
  const s = i.map(g).map(f);
  expect(r.value()).toEqual(43 * 43);
  expect(r.equals(s)).toBe(true);
});

test('identity Apply composition', () => {
  const v = identity(42);
  const u = identity((_: number) => _ * _);
  const a = identity((_: number) => _ + 1);
  const r = v.ap(u.ap(a.map(f => (g: (_: number) => number) => (x: number) => f(g(x)))));
  const s = v.ap(u).ap(a);
  expect(r.value()).toEqual(42 * 42 + 1);
  expect(r.equals(s)).toBe(true);
});

test('identity Applicative identity', () => {
  const v = identity(42);
  const r = v.ap(identity((x: number) => x));
  expect(r.value()).toEqual(42);
  expect(r.equals(v)).toBe(true);
});

test('identity Applicative homomorphism', () => {
  const f = (_: number) => _ * _;
  const r = identity(42).ap(identity(f));
  const s = identity(f(42));
  expect(r.value()).toEqual(42 * 42);
  expect(r.equals(s)).toBe(true);
});

test('identity Applicative interchange', () => {
  const u = identity((_: number) => _ * _);
  const r = identity(42).ap(u);
  const s = u.ap(identity((f: (_: number) => number) => f(42)));
  expect(r.value()).toEqual(42 * 42);
  expect(r.equals(s)).toBe(true);
});

test('identity Chain associativity', () => {
  const f = (_: number) => identity(_ * _);
  const g = (_: number) => identity(_ + 1);
  const m = identity(42);
  const r = m.chain(f).chain(g);
  const s = m.chain(x => f(x).chain(g));
  expect(r.value()).toEqual(42 * 42 + 1);
  expect(r.equals(s)).toBe(true);
});

test('identity Monad left identity', () => {
  const f = (_: number) => identity(_ * _);
  const r = identity(42).chain(f);
  const s = f(42);
  expect(r.value()).toEqual(42 * 42);
  expect(r.equals(s)).toBe(true);
});

test('identity Monad right identity', () => {
  const m = identity(42);
  const pure = <T>(_: T) => identity(_);
  const r = m.chain(pure);
  expect(r.equals(m)).toBe(true);
});
