// @ts-ignore
import { applyTransform } from 'jscodeshift/dist/testUtils';

import makeVariable from './makeVariable';

const transformOptions = {};

describe('variables', () => {
  describe('makes a variable declaration of kind `var`', () => {
    const data = { identifier: 'foo' };

    const source = '';

    const output = `
    var foo;
    `;

    console.log('applyTransform', applyTransform);

    const expected = applyTransform(makeVariable, transformOptions, { source });

    it('creates a variable declaration', () => {
      expect(output.trim()).toEqual(expected);
    });
  });
});
