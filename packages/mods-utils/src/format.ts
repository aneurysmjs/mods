import * as prettier from 'prettier';
import * as fs from 'fs';
import * as path from 'path';

const prettierConfigPath = path.resolve(__dirname, '../../../');
let prettierConfig: Record<string, string | boolean>;

try {
  const prettierrc = fs.readFileSync(`${prettierConfigPath}/.prettierrc.json`, 'utf8');
  prettierConfig = JSON.parse(prettierrc);
} catch (err) {
  console.error(err);
}

export default (str: string) =>
  prettier.format(str, {
    ...prettierConfig,
  });
