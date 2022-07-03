/**
 * @link https://github.com/bunch-of-friends/lerna-typescript-jest-boilerplate/blob/master/jest.config.json
 */
/** @typedef {import('ts-jest/dist/types')} */
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  // testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$'],
};
