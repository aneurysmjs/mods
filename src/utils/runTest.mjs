import fs from 'fs';
import path from 'path';

import { runInlineTest } from 'jscodeshift/dist/testUtils';

/**
 * @param {string} filePath File's path
 */
const toSource = (filePath) => fs.readFileSync(filePath, 'utf8');

/** @typedef {import('jscodeshift').Options} Options */

/**
 * @typedef {object} recastOptions
 * @property {string} [recastOptions.quote=null]
 * @property {boolean} [recastOptions.trailingComma=false]
 */

/**
 * @link https://github.com/facebook/jscodeshift/blob/48f5d6d6e5e769639b958f1a955c83c68157a5fa/src/testUtils.js#L82
 * @param {string} dirName
 * @param {string} transformName
 * @param {recastOptions} options
 * @param {string} testFilePrefix
 * @param {Options} [testOptions={}]
 */
export default function runTest(dirName, transformName, options, testFilePrefix, testOptions = {}) {
  // console.log('dirName', dirName);
  if (!testFilePrefix) {
    testFilePrefix = transformName;
  }

  // const extension = extensionForParser(testOptions.parser);
  const extension = 'mjs';
  const fixtureDir = path.join(dirName, '..', '__testfixtures__');
  const inputPath = path.join(fixtureDir, `${testFilePrefix}.input.${extension}`);
  const outputPath = path.join(fixtureDir, `${testFilePrefix}.output.${extension}`);
  const source = toSource(inputPath);
  const expectedOutput = toSource(outputPath);

  // Assumes transform is one level up from __tests__ directory
  const transform = path.join(dirName, '..', `${transformName}.${extension}`);

  import(transform)
    .then((module) => {
      runInlineTest(
        module,
        options,
        {
          path: inputPath,
          source,
        },
        expectedOutput,
        testOptions,
      );
    })
    .catch((err) => console.error(err));
}
