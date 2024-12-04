import { describe, expect, it } from 'vitest';

import { applyTransform } from 'jscodeshift/dist/testUtils';

import makeVariable from './makeVariable';

const transformOptions = {};

describe('variables', () => {
  describe('makes a variable declaration of kind `var`', () => {
    const source = '';

    const output = `
    var foo;
    `;

    const expected = applyTransform(makeVariable, transformOptions, { source });

    it('creates a variable declaration', () => {
      expect(output.trim()).toEqual(expected);
    });
  });
});
