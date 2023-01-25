import baseConfig from './jest.config.base.mjs';
import jestConfigsMap from './jestConfigsMap.mjs';

/**
 *
 * @param {string} pkgName
 */
const addConfigForPkg = (pkgName) => {
  return jestConfigsMap[pkgName] ?? {};
};

/**
 *
 * @param {string} pkgName
 * @returns InitialOptions
 */
export const makePackagesJestConfig = (pkgName) => ({
  ...baseConfig,
  displayName: pkgName,
  testEnvironment: 'node',
  testMatch: [
    `<rootDir>/packages/${pkgName}/**/?(*.)+(spec|test).[jt]s?(x)`,
    `<rootDir>/packages/${pkgName}/**/__tests__/**/*.{js,jsx,mjs,ts,tsx}`,
  ],

  ...addConfigForPkg(pkgName),
});
