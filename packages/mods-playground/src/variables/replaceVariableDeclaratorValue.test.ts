import { describe, expect, it } from 'vitest';

import { applyTransform } from 'jscodeshift/dist/testUtils';

import replaceVariableDeclaratorValue from './replaceVariableDeclaratorValue';

const transformOptions = {};

describe('replaceVariableDeclaratorValue', () => {
  describe('replace value for new Map(...) expression', () => {
    const source = `
      const foo = 'var'
    `;

    const output = `
      const foo = new Map([["keyA", "valueA"], ["keyB", "valueB"]])
    `;

    const expected = applyTransform(replaceVariableDeclaratorValue, transformOptions, { source });

    it('creates a variable declaration', () => {
      expect(output.trim()).toEqual(expected);
    });
  });
});
