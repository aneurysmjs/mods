import prettier, { Options } from 'prettier';
import * as fs from 'node:fs';
import * as path from 'node:path';

const prettierConfigPath = path.resolve(__dirname, '../../../');
let prettierConfig: Options;

try {
  const prettierrc = fs.readFileSync(`${prettierConfigPath}/.prettierrc.json`, 'utf8');

  prettierConfig = JSON.parse(prettierrc);

  // we use 'babel-ts' because we know that all the codemods we're using are typescript files
  prettierConfig.parser = 'babel-ts';
} catch (err) {
  console.error(err);
}

export default (str: string) =>
  prettier.format(str, {
    ...prettierConfig,
  });
