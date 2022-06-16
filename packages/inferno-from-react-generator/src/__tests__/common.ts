import path from 'path';
import Generator, { GeneratorAPI, GeneratorResult } from '@devextreme-generator/core';

export const esLintConfig = {
  //        logLevel: 'trace',
  plugins: [
    '@typescript-eslint',
    'unused-imports',
  ],
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
    ecmaVersion: 2015,
  },
  rules: {
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_',
      },
    ],

  },
};
export async function createTestGenerator(
  fileName: string,
  generator: Generator,
): Promise<GeneratorResult[]> {
  generator.options.lintConfig = esLintConfig;
  const factory = await import(path.resolve(
    `${__dirname}/componentFactory/${fileName}.js`,
  ));
  const code = generator.generate(factory.default);
  (generator as GeneratorAPI).postProcessResult?.(code);
  return code;
}
