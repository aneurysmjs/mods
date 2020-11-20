import { applyTransform } from 'jscodeshift/dist/testUtils';

import functionsMod from './functions.mjs';
const transformOptions = {};

describe('functions', () => {
  describe('function declaration ', () => {
    const data = { identifier: 'foo' };

    const source = `
      
    `;

    const output = `
    function foo() {}
    `;

    const expected = applyTransform(functionsMod(data), transformOptions, { source });

    it('creates a function declaration with no return statement', () => {
      expect(output.trim()).toEqual(expected);
    });
  });
});
