import fs from 'node:fs';
import path from 'node:path';

import { PACKAGES_DIR } from './config/paths.mjs';
import baseConfig from './config/jest/jest.config.base.mjs';
import { makePackagesJestConfig } from './config/jest/utils.mjs';

const packages = fs.readdirSync(PACKAGES_DIR).filter((name) => {
  return fs.lstatSync(path.join(PACKAGES_DIR, name)).isDirectory();
});

const esmJestConfig = {
  ...baseConfig,
  displayName: 'config',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/config/**/?(*.)+(spec|test).mjs'],
  transform: {},
};

const projects = packages.map(makePackagesJestConfig);

// projects.push(esmJestConfig);

export default {
  verbose: true,
  projects,
};
