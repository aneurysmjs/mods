// @ts-ignore
import { applyTransform } from 'jscodeshift/dist/testUtils';

import toArrowMod from './toArrow';

const transformOptions = {};

describe('toArrow mod', () => {
  it('replace function expression to arrow function', () => {
    const source = `
    const foo = function () {
      api();
      return 'bar';
    };
    `;

    const output = `
    const foo = () => {
      api();
      return 'bar';
    };
    `;

    const expected = applyTransform(toArrowMod, transformOptions, { source });
    expect(output.trim()).toEqual(expected);
  });

  it('replace function expression to one liner arrow function', () => {
    const source = `
    const foo = function () {
      return 'bar';
    };
    `;

    const output = `
    const foo = () => 'bar';
    `;

    const expected = applyTransform(toArrowMod, transformOptions, { source });
    expect(output.trim()).toEqual(expected);
  });
});
