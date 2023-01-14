import baseConfig from './jest.config.base.mjs';

/** @type {import('@jest/types').Config.InitialOptions} */
const modsUtilsJestConfig = {
  watchPathIgnorePatterns: [
    '<rootDir>/packages/mods-utils/src/testUtils/defineTestForFixtures/(__testfixtures__/)?(w-?)+(.input|output)?.js',
  ],
};

/**
 *
 * @param {string} pkgName
 */
const addConfigForPkg = (pkgName) => {
  return pkgName === 'mods-utils' ? modsUtilsJestConfig : {};
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
