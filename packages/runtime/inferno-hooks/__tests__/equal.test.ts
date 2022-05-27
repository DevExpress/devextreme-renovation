import { equal } from '../shallow-equal';

test('arrays are shallow equal', () => {
  const arr1 = [1, 2, 3];
  const arr2 = [1, 2, 3];
  expect(equal(arr1, arr2)).toEqual(true);
});

test('objects are shallow equal', () => {
  const obj1 = { a: 1, b: 2 };
  const obj2 = { a: 1, b: 2 };
  expect(equal(obj1, obj2)).toEqual(true);
});

test('numbers are not equal', () => {
  expect(equal(3, 5)).toEqual(false);
});
