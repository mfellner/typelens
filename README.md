# TypeLens

[![Travis](https://img.shields.io/travis/mfellner/typelens.svg)](travis-ci.org/mfellner/typelens)
[![Codecov](https://img.shields.io/codecov/c/github/mfellner/typelens.svg)](https://codecov.io/gh/mfellner/typelens)
[![codebeat](https://codebeat.co/badges/d1d29720-2029-43da-a24f-03fe56db7813)](https://codebeat.co/projects/github-com-mfellner-typelens-master)
[![license](https://img.shields.io/github/license/mfellner/typelens.svg)](https://choosealicense.com/licenses/mit)

**TypeLens** is a typesafe lensing library for JavaScript and TypeScript.

### Introduction

TypeLens is inspired by and borrows ideas from [Ramda](http://ramdajs.com/docs/#lens) and [Fantasy Land](https://github.com/fantasyland/fantasy-land). It is made to **safely access** properties in **unknown objects**.

### Usage

```typescript
import { lensKey } from 'typelens';

// Fetch some unsafe data.
const data = await fetch(url).then(r => t.json());

// Define a lens for a nested property.
const nameLens = lensKey(['user', 'profile', 'name']);

// Read the value at the focused property using `view`.
// Accessing a value with a lens returns a `Maybe` type.
const nameMaybe = lensKey.view(data);

// Safely resolve the value to a string. If the value is
// undefined, 'anonymous' used used as fallback.
const name: string = nameMaybe.getString('anonymous');
```

### Articles on functional lenses

* [Basic Lensing](https://www.schoolofhaskell.com/school/to-infinity-and-beyond/pick-of-the-week/basic-lensing)
* [Taking a Closer Look at Lenses](https://hackernoon.com/taking-a-closer-look-at-lenses-c0304851d54c)
* [Functional Lenses, How Do They Work](https://medium.com/@dtipson/functional-lenses-d1aba9e52254)
