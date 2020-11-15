import { applyTransform } from 'jscodeshift/dist/testUtils';

import addImports from './addImports.mjs';

const transformOptions = {};

const source = '';

const output = `import a from 'b';`;

const expected = applyTransform(addImports, transformOptions, { source });

describe('add imports', () => {
  it('it should add an import statement at the top of the file', () => {
    expect(output).toEqual(expected.trim());
  });
});
