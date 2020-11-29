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

  describe('adds property  to an existing object', () => {
    const data = {
      identifier: 'name',
      value: 'Джеро',
      property: { identifier: 'email', value: 'info@test.com' },
    };

    const source = `
    const obj = {
      name: 'Джеро',
    };  
    `;

    const output = `
    const obj = {
      name: 'Джеро',
      email: 'info@test.com',
    };
    `;

    const expected = applyTransform(objectsMod(data), transformOptions, { source });

    it('create an object', () => {
      expect(output.trim()).toEqual(expected);
    });
  });
});
