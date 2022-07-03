const path = require('path');
const { lstatSync, readdirSync } = require('fs');

const baseConfig = require('./jest.base.config');

// get listing of packages in mono repo
const basePath = path.resolve(__dirname, 'packages');

const packages = readdirSync(basePath).filter((name) => {
  return lstatSync(path.join(basePath, name)).isDirectory();
});

/** @type {import('@jest/types').Config.InitialOptions} */
const baseTSJestConfig = {
  testEnvironment: 'node',
  // moduleNameMapper: {
  //   '^~/(.+)': '<rootDir>/packages/codemods/src/$1',
  //   // automatically generated list of our packages from packages directory.
  //   // will tell jest where to find source code for @mods/packages, it points to the src instead of dist.
  //   ...packages.reduce(
  //     (acc, name) => ({
  //       ...acc,
  //       [`@mods/${name}(.*)$`]: `<rootDir>/packages/${name}/src/$1`,
  //     }),
  //     {},
  //   ),
  // },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};

/**
 *
 * @param {String[]} pkgs
 * @returns InitialOptions
 */
const makeJestConfigs = (pkgs) => {
  return pkgs.map((pkg) => ({
    ...baseConfig,
    // TODO
    // moduleNameMapper: {
    //   '^~/(.+)': '<rootDir>/packages/codemods/src/$1',
    //   // automatically generated list of our packages from packages directory.
    //   // will tell jest where to find source code for @mods/packages, it points to the src instead of dist.
    //   ...packages.reduce(
    //     (acc, name) => ({
    //       ...acc,
    //       [`@mods/${name}(.*)$`]: `<rootDir>/packages/${name}/src/$1`,
    //     }),
    //     {},
    //   ),
    // },
    displayName: pkg,
    testMatch: [`<rootDir>/packages/${pkg}/**/?(*.)+(spec|test).[jt]s?(x)`],
  }));
};

// "test": "jest --config ../../jest.config.js --rootDir ."

module.exports = {
  verbose: true,
  projects: makeJestConfigs(packages),
};
