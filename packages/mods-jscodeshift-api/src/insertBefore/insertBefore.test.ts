import { describe, it, expect } from 'vitest';
// import { defineTestForFixtures } from '@mods/utils';
import fs from 'node:fs';
import path from 'node:path';
import { applyTransform } from 'jscodeshift/dist/testUtils';

import insertBefore from './insertBefore';

// describe('insertBefore', () => {
//   it('inserts variable declarator before "foo"', async () => {
//     await defineTestForFixtures({
//       dirName: __dirname,
//       transformName: 'insertBefore',
//       testOptions: { parser: 'ts' },
//     });
//   });
// });

describe('scope', () => {
  it('insertBefore', () => {
    const fixtureDir = path.resolve(__dirname, '__testfixtures__');
    const source = fs.readFileSync(`${fixtureDir}/insertBefore.input.ts`).toString();
    const output = fs.readFileSync(`${fixtureDir}/insertBefore.output.ts`).toString();

    const expected = applyTransform(insertBefore, {}, { source });

    expect(output.trim()).toEqual(expected);
  });
});
