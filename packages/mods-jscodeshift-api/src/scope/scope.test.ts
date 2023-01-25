// import { fileURLToPath } from 'node:url';
// import { applyTransform } from 'jscodeshift/dist/testUtils';
import { defineTestForFixtures } from '@mods/utils';

// @ts-ignore
// console.log('import.meta', import.meta);
// @ts-ignore
// const dirname = fileURLToPath(import.meta.url);

// / const transformOptions = {};

defineTestForFixtures(__dirname, 'scope', null, 'scope', { parser: 'ts' });

console.log('defineTestForFixtures', defineTestForFixtures);

// describe('scope', () => {
//   it('creates a variable declaration', () => {
//     expect(1).toEqual(2);
//   });
// });
