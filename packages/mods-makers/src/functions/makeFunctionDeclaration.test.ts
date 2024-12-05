import { describe, expect, it } from 'vitest';
import jscodeshift from 'jscodeshift';
import { variableDeclaration, variableDeclarator, identifier } from 'jscodeshift';

import { format } from '@mods/utils';

import makeFunctionDeclaration from './makeFunctionDeclaration';

describe('make function declaration', () => {
  it('works', async () => {
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

    expect(await format(jscodeshift(fn).toSource())).toBe(await format(result));

    expect(fn.params).toStrictEqual([]);
  });
});
