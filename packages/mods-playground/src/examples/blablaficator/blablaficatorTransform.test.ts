import { describe, expect, it } from 'vitest';

import { applyTransform } from 'jscodeshift/dist/testUtils';

import blablaficatorTransform from './blablaficatorTransform';

const transformOptions = {};

describe('blablaficatorTransform', () => {
  const source = `
      console.log('wazaaa');
    `;

  const output = `
       bla.bla('wazaaa');
    `;

  const expected = applyTransform(blablaficatorTransform, transformOptions, { source });

  it('replace identifier with bla.bla', () => {
    expect(output.trim()).toEqual(expected);
  });
});
