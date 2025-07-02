import prettier from 'prettier';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const prettierConfigPath = path.resolve(dirname, '../../../');

export default async function format(str: string) {
  const config = await prettier.resolveConfig(`${prettierConfigPath}/prettier.config.mjs`);

  if (!config) {
    throw new Error("can't resolve Prettier config");
  }

  config.parser = 'babel-ts';

  return prettier.format(str, {
    ...config,
  });
}
