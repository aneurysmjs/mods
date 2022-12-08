import fs from 'node:fs';
import path from 'node:path';

import { PACKAGES_DIR } from './config/paths.mjs';
import baseConfig from './jest.config.base.mjs';

const packages = fs.readdirSync(PACKAGES_DIR).filter((name) => {
  return fs.lstatSync(path.join(PACKAGES_DIR, name)).isDirectory();
});

/** @type {import('@jest/types').Config.InitialOptions} */

/**
 *
 * @param {string} pkgName
 * @returns InitialOptions
 */
const makePackagesJestConfig = (pkgName) => ({
  ...baseConfig,
  displayName: pkgName,
  testEnvironment: 'node',
  testMatch: [
    `<rootDir>/packages/${pkgName}/**/?(*.)+(spec|test).[jt]s?(x)`,
    `<rootDir>/packages/${pkgName}/**/__tests__/**/*.{js,jsx,mjs,ts,tsx}`,
  ],
});

const esmJestConfig = {
  ...baseConfig,
  displayName: 'config',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/config/**/?(*.)+(spec|test).mjs'],
  transform: {},
};

const projects = packages.map(makePackagesJestConfig);

projects.push(esmJestConfig);

export default {
  verbose: true,
  projects,
};
