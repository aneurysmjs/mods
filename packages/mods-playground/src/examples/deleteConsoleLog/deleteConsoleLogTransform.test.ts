import { describe, expect, it } from 'vitest';

import { applyTransform } from 'jscodeshift/dist/testUtils';

import deleteConsoleLogTransform from './deleteConsoleLogTransform';

const transformOptions = {};

describe('deleteConsoleLogTransform', () => {
  const source = `
      function sum(a, b) {
        const result = a + b;
        console.log('Hello');
        return result;
    }
    `;

  const output = `
      function sum(a, b) {
        const result = a + b;
        return result;
      }
    `;

  const expected = applyTransform(deleteConsoleLogTransform, transformOptions, { source });

  it('remove console.log statements', () => {
    expect(output.trim()).toEqual(expected);
  });
});
