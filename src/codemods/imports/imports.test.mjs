import { applyTransform } from 'jscodeshift/dist/testUtils';

import importsMod from './imports.mjs';

const transformOptions = {};

const namedImport = {
  identifier: ['compose'],
  source: 'ramda',
};

const defaultImport = {
  identifier: 'a',
  source: 'b',
};

const namespaceImport = {
  identifier: 'a',
  source: 'b',
};

describe('imports', () => {
  describe.only('adds import with existing ones', () => {
    const data = {
      namedImport,
      defaultImport,
    };

    const source = `
      import { compose } from 'ramda';
    `;

    const output = `
      import { compose } from 'ramda';
      import a from 'b';
    `;

    const expected = applyTransform(importsMod(data), transformOptions, { source });

    it('it should add an import after the first one', () => {
      expect(output.trim()).toEqual(expected);
    });
  });

  describe('add namespace import', () => {
    const data = {
      namespaceImport,
    };

    const source = '';

    const output = `
      import * as a from 'b';
    `;

    const expected = applyTransform(importsMod(data), transformOptions, { source });

    it('it should add an import statement at the top of the file', () => {
      expect(output.trim()).toEqual(expected);
    });
  });

  describe("adds import with there's no one", () => {
    const data = {
      namedImport,
    };

    const source = '';

    const output = `
      import { compose } from 'ramda';
    `;

    const expected = applyTransform(importsMod(data), transformOptions, { source });

    it('it should add an import statement at the top of the file', () => {
      expect(output.trim()).toEqual(expected);
    });
  });
});
