import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { execa } from 'execa';

import {
  PACKAGE_JSON,
  TSCONFIG_JSON,
  TS_REGEX,
  JS_REGEX,
  MTS_EXT,
  MJS_EXT,
  MJS_REGEX,
} from './const.mjs';
import { PACKAGES_DIR, ROOT } from './paths.mjs';

/**
 *
 * @param {string} pathStr
 * @return boolean
 */
export const isDirectory = (pathStr) => fs.lstatSync(path.resolve(pathStr)).isDirectory();

/**
 * Checks whether a directory contains a `package.json`
 *
 * @param {string} pathStr
 * @return boolean
 */
export const isDirWithPackageJson = (pathStr) =>
  fs.existsSync(path.join(path.resolve(pathStr), PACKAGE_JSON));

/**
 * Checks whether a directory contains a `tsconfig.json`
 *
 * @param {string} pathStr
 * @return boolean
 */
export const isDirWithTsConfigJson = (pathStr) =>
  fs.existsSync(path.join(path.resolve(pathStr), TSCONFIG_JSON));

/**
 * Gets JSON from given path
 *
 * @param {string} pathStr
 * @return string
 *
 */
export const importJSON = (pathStr) => JSON.parse(fs.readFileSync(pathStr, 'utf-8'));

/**
 * Takes any path and appends `/package.json` in it
 *
 * @param {string} path
 * @return string
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
 * @return string
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
 * @return string[]
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
 * @property {string} name
 * @property {string} [main]
 * @property {string} [types]
 * @property {string} [bin]
 * @property {'module' | 'commonjs'} [type]
 */

/**
 * Checks wheter or not a package is an ESM module
 *
 * @param {Pkg} pkg
 * @return boolean
 */
export const isPkgESM = (pkg) => pkg?.type === 'module' && pkg.main?.includes(MTS_EXT);

/**
 * Gets the corresponding js extension regex is package is an ESM module
 *
 * @param {Pkg} pkg
 * @return RegExp
 */
export const getExtRegex = (pkg) => (isPkgESM(pkg) ? MJS_REGEX : JS_REGEX);

/**
 * Replaces package's types field is package is an ESM module
 *
 * @param {Pkg} pkg
 * @returns string | undefined
 *
 * @example
 *
 * "./build/index.d.ts" -> "./build/index.d.mts"
 */
export const replaceTypesExt = (pkg) =>
  isPkgESM(pkg) ? pkg?.types?.replace(TS_REGEX, MTS_EXT) : pkg?.types;

/**
 * Replaces package's main field is package is an ESM module
 *
 * @param {Pkg} pkg
 * @returns string | undefined
 *
 * @example
 *
 * "./build/index.js ->": "./build/index.mjs"
 *
 *
 */
export const replaceDefaultExt = (pkg) =>
  isPkgESM(pkg) ? pkg?.main?.replace(JS_REGEX, MJS_EXT) : pkg?.main;

/**
 *
 * @param {Pkg} pkg
 * @returns string
 */
export const getIndexExt = (pkg) => (isPkgESM(pkg) ? 'index.mjs' : 'index.js');

/**
 *
 * @param {Pkg} pkg
 * @returns string | undefined
 */
export const getIndexDeclarationExt = (pkg) => (isPkgESM(pkg) ? 'index.d.mts' : 'index.d.ts');

/**
 * @param {Pkg} pkg
 * @returns {[string, string][]}
 */
export const indexEntries = (pkg) => [
  ['main', getIndexExt(pkg)],
  ['types', getIndexDeclarationExt(pkg)],
];

/**
 * @param {Pkg} pkg
 * @returns Pkg
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
          types: replaceTypesExt(pkg),
          default: replaceDefaultExt(pkg),
        },
});

/**
 * @returns Pkg
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
 * @returns Pkg
 *
 * @example
 *
 * {
 *   "./bin/package-cli": "./build/bin/package-cli.js"
 * }
 */
export const makePkgBin = (pkg) =>
  Object.values(pkg.bin || {}).reduce(
    (mem, curr) => ({
      ...mem,
      [curr.replace(getExtRegex(pkg), '')]: curr,
    }),
    {},
  );

/**
 * @param {Pkg} pkg
 * @returns Pkg
 *
 * @example
 *
 * {
 *   ".": {
 *     "types": "./build/index.d.ts",
 *     "default": "./build/index.js"
 *   },
 *   "./package.json": "./package.json",
 *   "./bin/package-cli": "./build/bin/package-cli.js"
 * }
 */
export const makePkgExports = (pkg) => ({
  ...makeDefaultExport(pkg),
  ...makePackageJson(),
  ...makePkgBin(pkg),
});

/**
 *
 * @param {[string, string][]} assertionsEntries
 * @param {Pkg} pkg
 * @return void
 */
export const runAssertions = (assertionsEntries, pkg) => {
  assertionsEntries.forEach(([pkgProp, indexFile]) => {
    assert.strictEqual(
      pkg[pkgProp],
      `./build/${indexFile}`,
      `Package "${pkg.name}" should have "./build/${indexFile}" as ${pkgProp}`,
    );
  });
};

/**
 * @link https://github.com/pnpm/pnpm/issues/1519#issuecomment-1299922699
 */
export const listWorkspaces = async () => {
  /**
   * TODO: make an utility function to detect package manager
   */
  const isYarn = true;
  const isPnpm = false;

  let workspaces = [];

  if (isYarn) {
    /**
     * command: yarn workspaces list --json
     * 
     * single string contaning information about project's workspaces
     *
     * "{ "location": ".", "name":"@mods/monorepo" }
     *  { "location": "packages/mods-pkg1","name": "@mods/pkg1" }
     *  { "location": "packages/mods-pkg2","name": "@mods/pkg2" }
     *  { "location": "packages/mods-pkg3","name": "@mods/pkg3" }"
     */
    const { stdout: allWorkspacesString } = await execa('yarn', ['workspaces', 'list', '--json']);
    /**
     * Transform to a JSON array
     *
     * [
     *   { location: '.', name: '@mods/monorepo' },
     *   { location: 'packages/mods-pkg1', name: '@mods/pkg1' },
     *   { location: 'packages/mods-pkg2', name: '@mods/pkg2' },
     *   { location: 'packages/mods-pkg3', name: '@mods/pkg3' }
     * ]
     */
    workspaces = JSON.parse(`[${allWorkspacesString.split('\n').join(',')}]`);
  } else if (isPnpm) {
    /**
     * command: pnpm m ls --json --depth=-1
     *
     * [
     *   {
     *     "name": "@mods/monorepo",
     *     "version": "1.0.0",
     *     "path": "/abs/path/to/project/mods",
     *     "private": true
     *   }
     * ]
     * [
     *   {
     *     "name": "@mods/mods-pkg1",
     *     "version": "1.0.0",
     *     "path": "/abs/path/to/project/mods/packages/mods-pkg1",
     *     "private": false
     *   }
     * ]
     * [
     *   {
     *     "name": "@mods/mods-pkg2",
     *     "version": "1.0.0",
     *     "path": "/abs/path/to/project/mods/packages/mods-pkg2",
     *     "private": false
     *   }
     * ]
     * [
     *   {
     *     "name": "@mods/mods-pkg3",
     *     "version": "1.0.0",
     *     "path": "/abs/path/to/project/mods/packages/mods-pkg3",
     *     "private": false
     *   }
     * ]
     */
    const { stdout: allWorkspacesString } = await execa('pnpm', [
      'm',
      'ls',
      '--json',
      '--depth=-1',
    ]);

    const rootPathScaped = ROOT.replace(/\//g, '\\/');

    /**
     * @link https://stackoverflow.com/a/43391072/5378393
     */
    const rootPathRegex = new RegExp(String.raw`${rootPathScaped}`, 'g');
    /**
     * @description we remove the package's absolute path
     *
     * @example
     *
     * /abs/path/to/project/mods/packages/mods-pkg1
     *
     * to
     *
     * /mods/packages/mods-pkg1
     *
     */
    const prunedAbsPathWorkspaces = allWorkspacesString.replace(rootPathRegex, '');
    const jsonString = prunedAbsPathWorkspaces.replace(/\](?=\s)/g, '],');
    const parsedWorkspaces = JSON.parse(`
      [
        ${jsonString}
      ]
    `);

    workspaces = parsedWorkspaces.flat().map((workspace) => ({
      location: workspace.private ? '.' : workspace.path,
      name: workspace.name,
    }));
  }

  console.log('workspaces', workspaces);

  return workspaces;
};
