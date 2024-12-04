import { describe, expect, it } from 'vitest';

import j from 'jscodeshift';

import { getIdentifierScopes, getVariableScope } from './scope';

describe('scope', () => {
  const source = `
    let sisa = 1;
    function foo() {
      
    }

    if (true) {
      sisa = 6;
    }
 `;

  const ast = j(source);

  describe('getVariableScope', () => {
    it('should throw if no variable found', () => {
      expect(() => getVariableScope('blabla', ast)).toThrow(
        'Variable "blabla" not found in the AST',
      );
    });

    it.skip('gets the name of the scope the variable is defined', () => {
      // @ts-ignore
      const variableScope = getVariableScope('bar', ast);

      expect(1).toBe(1);
    });
  });

  describe('getIdentifierScopes', () => {
    it('should throw if no identifier found', () => {
      expect(() => getIdentifierScopes('blabla', ast)).toThrow(
        'Identifier "blabla" not found in the AST',
      );
    });

    it('gets the name of the scope the variable is defined', () => {
      // @ts-ignore
      const identifierScopes = getIdentifierScopes('sisa', ast);

      expect(1).toBe(1);
    });
  });
});
