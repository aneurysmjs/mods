import prettier from 'prettier';
import * as path from 'node:path';

const prettierConfigPath = path.resolve(__dirname, '../../../');

export default async function format(str: string) {
  const config = await prettier.resolveConfig(prettierConfigPath);

  if (!config) {
    throw new Error('can\'t resolve Prettier config');
  }

  config.parser = 'babel-ts';

  return prettier.format(str, {
    ...config,
  });
}
