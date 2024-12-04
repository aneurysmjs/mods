import { applyTransform } from 'jscodeshift/dist/testUtils';

import promiseToAsyncMod from './promiseToAsync.mjs';

const transformOptions = {};

describe('promise to async function', () => {
  const data = {
    desc: { identifier: 'name', value: 'Джеро' },
    meta: { convertToAsync: true },
  };

  const source = `
  function fn() {
    return new Promise(function (resolve) {
      return resolve('foo');
    });
  }

  function bar() {
    return 'baz';
  }
  `;

  const output = `
  async function fn() {
    return 'foo';
  }

  function bar() {
    return 'baz';
  }
  `;

  const expected = applyTransform(promiseToAsyncMod(data), transformOptions, { source });
  console.log('expected \n', expected + '\n');

  it('create an object', () => {
    expect(output.trim()).toEqual(expected);
  });
});
