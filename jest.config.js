// module.exports = {
//   // moduleDirectories: ['node_modules'],
//   collectCoverageFrom: ['src/**/*.{js,jsx,mjs,ts,tsx}'],
//   moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'mjs', 'ts', 'tsx'],
//   roots: ['src', 'tooling'],
//   testEnvironment: 'node',
//   testMatch: [
//     '<rootDir>/tooling/**/__tests__/**/*.{js,jsx,mjs,ts,tsx}',
//     '<rootDir>/src/**/__tests__/**/*.{js,jsx,mjs,ts,tsx}',
//     '<rootDir>/src/**/?(*.)(spec|test).{js,jsx,mjs,ts,tsx}',
//   ],
//   testURL: 'http://localhost',
//   transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$'],
//   verbose: true,
// };

export default {
  // moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'mjs'],
  testEnvironment: 'jest-environment-node',
  testMatch: ['**/__tests__/**/*.?(m)js?(x)', '**/?(*.)(spec|test).?(m)js?(x)'],
  transform: {},
  testURL: 'http://localhost',
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$'],
  verbose: true,
};
