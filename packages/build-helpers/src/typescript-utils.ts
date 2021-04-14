import path from 'path';
import ts from 'typescript';

export function getTsConfig(filename: string) {
  const { config, error } = ts.readConfigFile(filename, ts.sys.readFile);
  if (error) {
    return {};
  }
  let baseConfig: any = {};
  if (config.extends) {
    baseConfig = getTsConfig(
      path.resolve(path.dirname(filename), config.extends),
    );
  }
  return {
    ...baseConfig,
    ...config,
    compilerOptions: {
      ...baseConfig.compilerOptions,
      ...config.compilerOptions,
      sourceMap: false,
    },
  };
}
