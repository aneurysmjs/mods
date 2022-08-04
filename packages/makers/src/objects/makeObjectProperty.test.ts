import * as core from 'jscodeshift/src/core';
import { stringLiteral } from 'jscodeshift';

import makeObjectProperty from './makeObjectProperty';

describe('make object property', () => {
  it('makes property with key-value pair', () => {
    const prop = makeObjectProperty('foo', stringLiteral('bar'));

    const result = "foo: 'bar'";

    // @ts-ignore
    expect(prop.key.name).toBe('foo');
    // @ts-ignore
    expect(core(prop).toSource({ quote: 'single', trailingComma: true })).toBe(result);
  });
});
