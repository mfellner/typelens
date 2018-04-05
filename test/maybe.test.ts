/**
 * Test the fantasy-land specification on the maybe type.
 * https://github.com/fantasyland/fantasy-land
 */

import maybe from '../src/maybe';

test('maybe from something', () => {
  expect(maybe(42).get()).toEqual(42);
});

test('maybe from nothing', () => {
  expect(maybe().get()).toBeUndefined();
});

// something *******************************************************************

test('something Functor identity', () => {
  const i = maybe(42);
  const r = i.map(_ => _);
  expect(r.get()).toEqual(42);
  expect(r.equals(i)).toBe(true);
});

test('something Functor identity', () => {
  const f = (_: number) => _ * _;
  const g = (_: number) => _ + 1;
  const i = maybe(42);
  const r = i.map(x => f(g(x)));
  const s = i.map(g).map(f);
  expect(r.get()).toEqual(43 * 43);
  expect(r.equals(s)).toBe(true);
});

test('something Apply composition', () => {
  const v = maybe(42);
  const u = maybe((_: number) => _ * _);
  const a = maybe((_: number) => _ + 1);
  const r = v.ap(u.ap(a.map(f => (g: (_: number) => number) => (x: number) => f(g(x)))));
  const s = v.ap(u).ap(a);
  expect(r.get()).toEqual(42 * 42 + 1);
  expect(r.equals(s)).toBe(true);
});

test('something Applicative identity', () => {
  const v = maybe(42);
  const r = v.ap(maybe((x: number) => x));
  expect(r.get()).toEqual(42);
  expect(r.equals(v)).toBe(true);
});

test('something Applicative homomorphism', () => {
  const f = (_: number) => _ * _;
  const r = maybe(42).ap(maybe(f));
  const s = maybe(f(42));
  expect(r.get()).toEqual(42 * 42);
  expect(r.equals(s)).toBe(true);
});

test('something Applicative interchange', () => {
  const u = maybe((_: number) => _ * _);
  const r = maybe(42).ap(u);
  const s = u.ap(maybe((f: (_: number) => number) => f(42)));
  expect(r.get()).toEqual(42 * 42);
  expect(r.equals(s)).toBe(true);
});

test('something Chain associativity', () => {
  const f = (_: number) => maybe(_ * _);
  const g = (_: number) => maybe(_ + 1);
  const m = maybe(42);
  const r = m.chain(f).chain(g);
  const s = m.chain(x => f(x).chain(g));
  expect(r.get()).toEqual(42 * 42 + 1);
  expect(r.equals(s)).toBe(true);
});

test('something Monad left identity', () => {
  const f = (_: number) => maybe(_ * _);
  const r = maybe(42).chain(f);
  const s = f(42);
  expect(r.get()).toEqual(42 * 42);
  expect(r.equals(s)).toBe(true);
});

test('something Monad right identity', () => {
  const m = maybe(42);
  const pure = <T>(_: T) => maybe(_);
  const r = m.chain(pure);
  expect(r.equals(m)).toBe(true);
});

// nothing *********************************************************************

test('nothing Functor identity', () => {
  const i = maybe();
  const r = i.map(_ => _);
  expect(r.get()).toBeUndefined();
  expect(r.equals(i)).toBe(true);
});

test('nothing Functor identity', () => {
  const f = (_: any) => _ * _;
  const g = (_: any) => _ + 1;
  const i = maybe();
  const r = i.map(x => f(g(x)));
  const s = i.map(g).map(f);
  expect(r.get()).toBeUndefined();
  expect(r.equals(s)).toBe(true);
});

test('nothing Apply composition', () => {
  const v = maybe();
  const u = maybe((_: any) => _ * _);
  const a = maybe((_: any) => _ + 1);
  const r = v.ap(u.ap(a.map(f => (g: (_: any) => any) => (x: any) => f(g(x)))));
  const s = v.ap(u).ap(a);
  expect(r.get()).toBeUndefined();
  expect(r.equals(s)).toBe(true);
});

test('nothing Applicative identity', () => {
  const v = maybe();
  const r = v.ap(maybe((x: any) => x));
  expect(r.get()).toBeUndefined();
  expect(r.equals(v)).toBe(true);
});

test('nothing Applicative homomorphism', () => {
  const f = (_?: any) => _;
  const r = maybe().ap(maybe(f));
  const s = maybe(f());
  expect(r.get()).toBeUndefined();
  expect(r.equals(s)).toBe(true);
});

test('nothing Applicative interchange', () => {
  const u = maybe((_?: any) => _);
  const r = maybe().ap(u);
  const s = u.ap(maybe((f: (_?: any) => any) => f()));
  expect(r.get()).toEqual(s.get());
  // `equals()` would fail because `u` is "something" not "nothing"
});

test('nothing Chain associativity', () => {
  const f = (_: any) => maybe(_ * _);
  const g = (_: any) => maybe(_ + 1);
  const m = maybe();
  const r = m.chain(f).chain(g);
  const s = m.chain(x => f(x).chain(g));
  expect(r.get()).toBeUndefined();
  expect(r.equals(s)).toBe(true);
});

test('nothing Monad left identity', () => {
  const f = (_?: any) => maybe(_);
  const r = maybe().chain(f);
  const s = f();
  expect(r.get()).toBeUndefined();
  expect(r.equals(s)).toBe(true);
});

test('nothing Monad right identity', () => {
  const m = maybe();
  const pure = <T>(_: T) => maybe(_);
  const r = m.chain(pure);
  expect(r.equals(m)).toBe(true);
});

// ResolvableMaybe *************************************************************

test('ResolvableMaybe getString', () => {
  expect(maybe(42).getString()).toEqual('42');
});

test('ResolvableMaybe getNumber', () => {
  expect(maybe('42').getNumber()).toEqual(42);
});

test('ResolvableMaybe getObject', () => {
  expect(maybe('{}').getObject()).toEqual({});
});

test('ResolvableMaybe getBool', () => {
  expect(maybe('false').getBool()).toEqual(false);
});

test('ResolvableMaybe getFunction', () => {
  const fn = () => 42;
  expect(maybe(fn).getFunction()!()).toEqual(42);
});

test('ResolvableMaybe getSymbol', () => {
  const s = Symbol();
  expect(maybe(s).getSymbol()).toEqual(s);
});
