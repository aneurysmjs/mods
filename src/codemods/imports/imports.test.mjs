import { applyTransform } from 'jscodeshift/dist/testUtils';

import importsMod from './imports.mjs';

const data = {
  namedImport: {
    idenfifiers: ['compose'],
    source: 'ramda',
  },
  defaultImport: {
    idenfifier: 'a',
    source: 'b',
  },
};

const transform = importsMod(data);

const transformOptions = {};

const source = `
import { compose } from 'ramda';
`;

const output = `
import { compose } from 'ramda';
import a from 'b';
`.trim();

const expected = applyTransform(transform, transformOptions, { source });

describe('add imports', () => {
  it('it should add an import statement at the top of the file', () => {
    expect(output).toEqual(expected);
  });
});
