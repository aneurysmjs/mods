import { applyTransform } from 'jscodeshift/dist/testUtils';

import objectsMod from './objects.mjs';

const transformOptions = {};

describe('objects', () => {
  describe('creates a variable whose value is an object', () => {
    const data = { identifier: 'name', value: 'Джеро' };

    const source = `
      
    `;

    const output = `
    const obj = {
      name: 'Джеро',
    };
    `;

    const expected = applyTransform(objectsMod(data), transformOptions, { source });

    it('create an object', () => {
      expect(output.trim()).toEqual(expected);
    });
  });
});