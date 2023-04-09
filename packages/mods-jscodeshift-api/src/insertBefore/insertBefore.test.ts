import { defineTestForFixtures } from '@mods/utils';

describe('scope', () => {
  it('insertes variable declarator before "foo"', () => {
    defineTestForFixtures({
      dirName: __dirname,
      transformName: 'insertBefore',
      testOptions: { parser: 'ts' },
    });
  });
});

// describe('scope', () => {
//   it('insertBefore', () => {
//     const fixtureDir = path.resolve(__dirname, '__testfixtures__');
//     const source = fs.readFileSync(`${fixtureDir}/insertBefore.input.ts`).toString();
//     const output = fs.readFileSync(`${fixtureDir}/insertBefore.output.ts`).toString();
//
//     const expected = applyTransform(insertBefore, {}, { source });
//
//     expect(output.trim()).toEqual(expected);
//   });
// });
