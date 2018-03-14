/**
 * Test the fantasy-land specification on the Identity type.
 * https://github.com/fantasyland/fantasy-land
 */

import Identity from '../src/Identity';

test('Identity equals', () => {
  expect(new Identity(42).equals(new Identity(42))).toBe(true);
  expect(new Identity(0).equals(new Identity(1))).toBe(false);
});

test('Identity value', () => {
  expect(new Identity(42).value()).toEqual(42);
});

test('Identity Functor identity', () => {
  const i = new Identity(42);
  const r = i.map(_ => _);
  expect(r.value()).toEqual(42);
  expect(r.equals(i)).toBe(true);
});

test('Identity Functor composition', () => {
  const f = (_: number) => _ * _;
  const g = (_: number) => _ + 1;
  const i = new Identity(42);
  const r = i.map(x => f(g(x)));
  const s = i.map(g).map(f);
  expect(r.value()).toEqual(43 * 43);
  expect(r.equals(s)).toBe(true);
});

test('Identity Apply composition', () => {
  const v = new Identity(42);
  const u = new Identity((_: number) => _ * _);
  const a = new Identity((_: number) => _ + 1);
  const r = v.ap(u.ap(a.map(f => (g: (_: number) => number) => (x: number) => f(g(x)))));
  const s = v.ap(u).ap(a);
  expect(r.value()).toEqual(42 * 42 + 1);
  expect(r.equals(s)).toBe(true);
});

test('Identity Applicative identity', () => {
  const v = new Identity(42);
  const r = v.ap(new Identity((x: number) => x));
  expect(r.value()).toEqual(42);
  expect(r.equals(v)).toBe(true);
});

test('Identity Applicative homomorphism', () => {
  const f = (_: number) => _ * _;
  const r = new Identity(42).ap(new Identity(f));
  const s = new Identity(f(42));
  expect(r.value()).toEqual(42 * 42);
  expect(r.equals(s)).toBe(true);
});

test('Identity Applicative interchange', () => {
  const u = new Identity((_: number) => _ * _);
  const r = new Identity(42).ap(u);
  const s = u.ap(new Identity((f: (_: number) => number) => f(42)));
  expect(r.value()).toEqual(42 * 42);
  expect(r.equals(s)).toBe(true);
});

test('Identity Chain associativity', () => {
  const f = (_: number) => new Identity(_ * _);
  const g = (_: number) => new Identity(_ + 1);
  const m = new Identity(42);
  const r = m.chain(f).chain(g);
  const s = m.chain(x => f(x).chain(g));
  expect(r.value()).toEqual(42 * 42 + 1);
  expect(r.equals(s)).toBe(true);
});

test('Identity Monad left identity', () => {
  const f = (_: number) => new Identity(_ * _);
  const r = new Identity(42).chain(f);
  const s = f(42);
  expect(r.value()).toEqual(42 * 42);
  expect(r.equals(s)).toBe(true);
});

test('Identity Monad right identity', () => {
  const m = new Identity(42);
  const pure = <T>(_: T) => new Identity(_);
  const r = m.chain(pure);
  expect(r.equals(m)).toBe(true);
});
