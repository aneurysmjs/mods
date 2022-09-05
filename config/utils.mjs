import fs from 'node:fs';
import path from 'node:path';

import { PACKAGE_JSON, TSCONFIG_JSON } from './const.mjs';
import { PACKAGES_DIR } from './paths.mjs';

/**
 *
 * @param {string} pathStr
 */
export const isDirectory = (pathStr) => fs.lstatSync(path.resolve(pathStr)).isDirectory();

/**
 * Checks whether a directory contains a `package.json`
 *
 * @param {string} pathStr
 */
export const isDirWithPackageJson = (pathStr) =>
  fs.existsSync(path.join(path.resolve(pathStr), PACKAGE_JSON));

/**
 * Checks whether a directory contains a `tsconfig.json`
 *
 * @param {string} pathStr
 */
export const isDirWithTsConfigJson = (pathStr) =>
  fs.existsSync(path.join(path.resolve(pathStr), TSCONFIG_JSON));

/**
 * Gets JSON from given path
 *
 * @param {string} pathStr
 *
 */
export const importJSON = (pathStr) => JSON.parse(fs.readFileSync(pathStr, 'utf-8'));

/**
 * Takes any path and appends `/package.json` in it
 *
 * @param {string} path
 *
 * @example
 *
 * const path = '/some/path';
 *
 * appendPackageJson(path);
 *
 * '/some/path/package.json'
 *
 */
export const appendPackageJson = (path) => `${path}/${PACKAGE_JSON}`;

/**
 * Takes any path and appends `/package.json` in it
 *
 * @param {string} path
 *
 * @example
 *
 * const path = '/some/path';
 *
 * appendPackageJson(path);
 *
 * '/some/path/tsconfig.json'
 *
 */
export const appendTsConfigJson = (path) => `${path}/${TSCONFIG_JSON}`;

/**
 *
 */
export const getPackages = () =>
  fs
    .readdirSync(PACKAGES_DIR)
    .map((file) => path.resolve(PACKAGES_DIR, file))
    .filter(isDirectory)
    .filter(isDirWithPackageJson);

/**
 *
 * @typedef {Object} Pkg
 * @property {string} [main] - Indicates whether the Courage component is present.
 * @property {string} [types] - Indicates whether the Courage component is present.
 * @property {string} [bin] - Indicates whether the Courage component is present.
 */

/**
 * @param {Pkg} pkg
 *
 * @example
 *
 * {
 *   ".": {
 *     "types": "./build/index.d.ts",
 *     "default": "./build/index.js"
 *   },
 * }
 */
export const makeDefaultExport = (pkg) => ({
  '.':
    pkg.types == null
      ? pkg.main
      : {
          types: pkg.types,
          default: pkg.main,
        },
});

/**
 *
 * @example
 *
 * {
 *   "./package.json": "./package.json",
 * }
 */
export const makePackageJson = () => ({
  './package.json': './package.json',
});

/**
 * @param {Pkg} pkg
 *
 * @example
 *
 * {
 *   "./bin/mods-cli": "./build/bin/mods-cli.js"
 * }
 */
export const makePkgBin = (pkg) =>
  Object.values(pkg.bin || {}).reduce(
    (mem, curr) => ({
      ...mem,
      [curr.replace(/\.js$/, '')]: curr,
    }),
    {},
  );

/**
 * @param {Pkg} pkg
 *
 * @example
 *
 * {
 *   ".": {
 *     "types": "./build/index.d.ts",
 *     "default": "./build/index.js"
 *   },
 *   "./package.json": "./package.json",
 *   "./bin/mods-cli": "./build/bin/mods-cli.js"
 * }
 */
export const makePkgExports = (pkg) => ({
  ...makeDefaultExport(pkg),
  ...makePackageJson(),
  ...makePkgBin(pkg),
});
