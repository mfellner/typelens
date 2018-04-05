import { lensKey } from '../src/lens';

test('lensKey on Person', () => {
  const person = {
    name: 'Ada Lovelace',
    address: {
      city: 'London',
      street: 'Marylebone High Street',
      number: '42'
    }
  };

  const streetLens = lensKey(['address', 'street']);
  const numberLens = lensKey(['address', 'number']);
  const countryLens = lensKey(['address', 'country']);

  const street: string | undefined = streetLens.view(person).getString();
  const num: number | undefined = numberLens.view(person).getNumber();
  const country: string = countryLens.view(person).getString('England');

  expect(street).toEqual('Marylebone High Street');
  expect(num).toEqual(42);
  expect(country).toEqual('England');
});

test('lensKey on data', () => {
  const data = {
    items: ['a', 'b', 'c']
  };

  const itemsLens = lensKey('items');
  const item4Lens = lensKey(3);
  const composed4 = itemsLens.andThen(item4Lens);

  let item4: string | undefined = composed4.view(data).getString();

  expect(item4).toBeUndefined();

  const items: any = composed4
    .set('d')(data)
    .get();

  item4 = item4Lens.view(items).getString();

  expect(items).toEqual(['a', 'b', 'c', 'd']);
  expect(data.items).toEqual(['a', 'b', 'c']);
  expect(item4).toEqual('d');
});
