/**
 * @typedef { import('@jest/types').Config.InitialOptions } InitialOptions
 */

/** @type Object.<string, InitialOptions>  */
export default {
  'mods-utils': {
    watchPathIgnorePatterns: [
      '<rootDir>/packages/mods-utils/src/testUtils/defineTestForFixtures/(__testfixtures__/)?(w-?)+(.input|output)?.js',
    ],
  },
};
