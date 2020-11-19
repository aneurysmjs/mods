import { applyTransform } from 'jscodeshift/dist/testUtils';

import variablesMod from './variables.mjs';
const transformOptions = {};

describe('variables', () => {
  describe('variable declarations', () => {
    const data = { kind: 'const', declarations: { identifier: 'foo', literal: 'bar' } };

    const source = `
      
    `;

    const output = `
    const foo = 'bar';
    `;

    const expected = applyTransform(variablesMod(data), transformOptions, { source });

    it('create a variable', () => {
      expect(output.trim()).toEqual(expected);
    });
  });
});
