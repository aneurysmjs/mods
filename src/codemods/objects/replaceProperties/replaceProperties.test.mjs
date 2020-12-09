import { applyTransform } from 'jscodeshift/dist/testUtils';

import replacePropertiesMod from './replaceProperties.mjs';

const transformOptions = {};

describe('objects', () => {
  describe('replace given property', () => {
    const data = {
      desc: { identifier: 'name', value: 'Джеро' },
      meta: { replaceByArrowFunction: true },
    };

    const source = `
    const obj1 = {
      name: 'Джеро',
    };

    const obj2 = {
      name: 'bar',
    };
    `;

    const output = `
    const obj1 = {
      name: () => 'Джеро',
    };

    const obj2 = {
      name: 'bar',
    };
    `;

    const expected = applyTransform(replacePropertiesMod(data), transformOptions, { source });

    it('create an object', () => {
      expect(output.trim()).toEqual(expected);
    });
  });
});
