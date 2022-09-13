import core from 'jscodeshift/src/core';
// console.log('core', core);
import { stringLiteral } from 'jscodeshift';

import makeObjectExpression from './makeObjectExpression';

const recastOptions = { quote: 'single', trailingComma: true };

describe('make object expression', () => {
  it('makes object with key-value pair', () => {
    const obj = makeObjectExpression({ key: 'foo', value: stringLiteral('bar') });

    const result = `
     {
    foo: 'bar',
}
    `;

    expect(obj.properties.length).toBe(1);
    // @ts-ignore
    expect(core(obj).toSource(recastOptions).trim()).toBe(result.trim());
  });
});
