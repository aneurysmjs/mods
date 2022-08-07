/**
 * @link https://github.com/bunch-of-friends/lerna-typescript-jest-boilerplate/blob/master/jest.config.json
 */
/** @type {import('@jest/types').Config.InitialOptions} */
export default {
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'mjs', 'ts', 'tsx'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$'],
};
