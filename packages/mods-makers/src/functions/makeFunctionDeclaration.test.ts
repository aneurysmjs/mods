import jscodeshift from 'jscodeshift';
import { variableDeclaration, variableDeclarator, identifier } from 'jscodeshift';

import { format } from '@mods/utils';

import makeFunctionDeclaration from './makeFunctionDeclaration';

describe('make function declaration', () => {
  it('works', () => {
    const fn = makeFunctionDeclaration(
      'foo',
      [],
      [variableDeclaration('var', [variableDeclarator(identifier('bar'), null)])],
    );

    const result = `
    function foo() {
      var bar;
    }
    `;

    expect(fn.id?.name).toBe('foo');

    expect(format(jscodeshift(fn).toSource())).toBe(format(result));

    expect(fn.params).toStrictEqual([]);
  });
});
