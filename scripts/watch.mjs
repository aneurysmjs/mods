/**
 * Watch files for changes and rebuild (copy from 'src/' to `build/`) if changed
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import chokidar from 'chokidar';
import fs from 'graceful-fs';

import { getPackages } from './buildUtils.mjs';
import { PACKAGES_DIR } from '../config/paths.mjs';

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));

const BUILD_PATH = path.resolve(DIRNAME, 'build.mjs');

const BUILD_CMD = `node ${BUILD_PATH}`;

let filesToBuild = new Map();

const exists = (filename) => {
  try {
    return fs.statSync(filename).isFile();
  } catch {}
  return false;
};

const rebuild = (filename) => filesToBuild.set(filename, true);

// Absolute path for each package's `src` folder
const packagesSrc = getPackages().map((p) => path.resolve(p.packageDir, 'src'));

const watcher = chokidar
  // watch for every file inside of each package
  .watch(packagesSrc, {
    ignoreInitial: true,
    ignored: /(^|[/\\])\../, // ignore dotfiles
  });

watcher.on('all', (event, filePath) => {
  // console.log('event', event);
  // console.log('filePath', filePath);
  if ((event === 'change' || event === 'rename' || event === 'add') && exists(filePath)) {
    console.log(chalk.green('->'), `${event}: ${path.relative(PACKAGES_DIR, filePath)}`);
    rebuild(filePath);
  } else {
    filePath.split(path.join(path.sep, 'src', path.sep));

    const buildFile = filePath
      .replace(path.join(path.sep, 'src', path.sep), path.join(path.sep, 'build', path.sep))
      .replace(/\.ts$/, '.js');

    try {
      fs.unlinkSync(buildFile);
      process.stdout.write(
        `${chalk.red('  \u2022 ')}${path.relative(PACKAGES_DIR, buildFile)} (deleted)\n`,
      );
    } catch {}
  }
});

setInterval(() => {
  const files = Array.from(filesToBuild.keys());

  if (files.length) {
    filesToBuild = new Map();
    try {
      execSync(`${BUILD_CMD} ${files.join(' ')}`, { stdio: [0, 1, 2] });
    } catch {}
  }
}, 100);

console.log(chalk.red('->'), chalk.cyan('Watching for changes...'));
