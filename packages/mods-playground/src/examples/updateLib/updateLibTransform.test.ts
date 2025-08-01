import { describe, expect, it } from 'vitest';

import { applyTransform } from 'jscodeshift/dist/testUtils';

import updateLibTransform from './updateLibTransform';

const transformOptions = {};

describe('updateLibTransform', () => {
  const source = `
    this.createPageObject(pageObject);
  `;

  const output = `
    this.createPageObject(pageObject);
  `;

  const expected = applyTransform(updateLibTransform, transformOptions, { source: source });

  it('should preserve existing functionality', () => {
    expect(output.trim()).toEqual(expected);
  });

  const source2 = `
  this.createPageObject(pageObject, 'dunno');
  `;

  const output2 = `
  this.createPageObject(pageObject, {
    parent: "dunno"
  });
  `;

  const expected2 = applyTransform(updateLibTransform, transformOptions, { source: source2 });

  it('update second parameter to object with parent key', () => {
    expect(output2.trim()).toEqual(expected2);
  });

  const source3 = `
    this.createPageObject(pageObject, this.browser);
  `;

  const output3 = `
    this.createPageObject(pageObject);
  `;

  const expected3 = applyTransform(updateLibTransform, transformOptions, { source: source3 });

  it('should exclude "this.browser"', () => {
    expect(output3.trim()).toEqual(expected3);
  });
});
