import * as fs from 'node:fs';
import * as path from 'node:path';
import { globbySync } from 'globby';
import yargs from 'yargs/yargs';
import createDebug from 'debug';

/**
 * `realpathSync` return the canonicalized absolute pathname.
 *
 * what is cannonical path?
 * @link https://stackoverflow.com/a/12100378/5378393
 */
const appDirectory = fs.realpathSync(process.cwd());
const build = './build';
const pathToBuild = path.resolve(appDirectory, build);

// @ts-ignore
const debug = createDebug('@mods-cli');
// @ts-ignore
const log = console.log.bind(console);

const result = yargs(process.argv.slice(2))
  .usage('Usage: $0 [file pattern]')

  .option('transformation', {
    alias: 't',
    type: 'string',
    describe: 'Name or path of the transformation module',
  })
  .option('params', {
    alias: 'p',
    describe: 'Custom params to the transformation',
  })
  .demandOption('transformation')
  .help().argv;

// @ts-ignore
const { _: files, transformation: transformationName } = result;

console.log('files', files);

async function main() {
  const resolvedPaths = globbySync(files as string[]);

  const pathToIndex = `${pathToBuild}/index.js`;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const tfm = await import(pathToIndex);

  console.log('tfm', tfm);

  console.log('resolvedPaths ', resolvedPaths);

  console.log('transformationName', transformationName);

  // log(`Processing ${resolvedPaths.length} files…`);

  // for (const p of resolvedPaths) {
  //   debug(`Processing ${p}…`);
  //   const fileInfo = {
  //     path: p,
  //     source: fs.readFileSync(p).toString(),
  //   };
  //   try {
  //     const result = runTransformation(fileInfo, transformationModule, params as object);
  //     fs.writeFileSync(p, result);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
