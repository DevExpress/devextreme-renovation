/* eslint-disable no-useless-escape */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  projects: [
    {
      displayName: 'runtime/react',
      rootDir: path.resolve('packages', 'runtime', 'react'),
      testMatch: ['<rootDir>/__tests__/**'],
      transform: { '.*\.[jt]sx?$': ['babel-jest'] },
    },
    {
      displayName: 'runtime/inferno-hooks',
      rootDir: path.resolve('packages', 'runtime', 'inferno-hooks'),
      testMatch: ['<rootDir>/__tests__/**'],
      testEnvironment: 'jest-environment-jsdom',
      transform: { '.*\.[jt]sx?$': ['babel-jest'] },
    },
    {
      displayName: 'inferno-from-react',
      testMatch: ['<rootDir>/packages/inferno-from-react-generator/src/__tests__/generator.test.ts'],
      preset: 'ts-jest',
    },
  ],

};
