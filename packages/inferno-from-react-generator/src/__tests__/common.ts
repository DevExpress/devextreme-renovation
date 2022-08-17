import path from 'path';
import Generator, { GeneratorAPI, GeneratorResult } from '@devextreme-generator/core';

export const esLintConfig = {
  //        logLevel: 'trace',
  plugins: [
    '@typescript-eslint',
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
