import fs from 'node:fs';
import path from 'node:path';
// @ts-ignore
import { runInlineTest } from 'jscodeshift/dist/testUtils';

/***
 * taken from @link https://github.com/facebook/jscodeshift/blob/main/src/testUtils.js#L54
 */
function extensionForParser(parser: string | undefined) {
  switch (parser) {
    case 'ts':
    case 'tsx':
      return parser;
    default:
      return 'js';
  }
}

interface TestOptions {
  parser: string;
  [K: string]: any;
}

interface DefineTestForFixturesOptions {
  dirName: string;
  transformName: string;
  options?: Record<string, any>;
  testFilePrefix?: string;
  testOptions?: TestOptions;
}

const testfixturesDir = '__testfixtures__';

export async function defineTestForFixtures({
  dirName,
  transformName,
  options,
  testFilePrefix,
  testOptions,
}: DefineTestForFixturesOptions) {
  if (!fs.existsSync(path.join(dirName, testfixturesDir))) {
    throw new Error(`'${testfixturesDir}' folder not found`);
  }

  if (!testFilePrefix) {
    testFilePrefix = transformName;
  }

  const extension = extensionForParser(testOptions?.parser);
  const fixtureDir = path.join(dirName, testfixturesDir);
  const inputPath = path.join(fixtureDir, `${testFilePrefix}.input.${extension}`);
  const outputPath = path.join(fixtureDir, `${testFilePrefix}.output.${extension}`);
  const source = fs.readFileSync(inputPath, 'utf8');
  const expectedOutput = fs.readFileSync(outputPath, 'utf8');

  // We assume that the transform is sibling from the test
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const transform = await import(`${dirName}/${transformName}.${extension}`);
  // const transform = require(`${dirName}/${transformName}.${extension}`);

  runInlineTest(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    transform.default ? transform.default : transform,
    // @ts-ignore
    options,
    {
      path: inputPath,
      source,
    },
    expectedOutput,
    testOptions,
  );
}
