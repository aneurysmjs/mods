export default {
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'mjs'],
  testEnvironment: 'jest-environment-node',
  testMatch: ['**/__tests__/**/*.?(m)js?(x)', '**/?(*.)(spec|test).?(m)js?(x)'],
  transform: {},
  testURL: 'http://localhost',
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$'],
  verbose: true,
};
