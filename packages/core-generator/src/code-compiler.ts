import ts from 'typescript';

import { generateFactoryCode } from './factoryCodeGenerator';
import { GeneratorAPI, GeneratorResult } from './generator-api';

export interface CompileCodeOptions {
  includeExtraComponents: boolean,
  createFactoryOnly: boolean,
  // NOTE: NOTE: With this option we can skip generation of the modules
  // that paths contains one of substrings passed through this option.
  excludePathPatterns: string[],
}

const DEFAULT_COMPILE_CODE_OPTIONS: CompileCodeOptions = {
  includeExtraComponents: false,
  createFactoryOnly: false,
  excludePathPatterns: [],
};

export function compileCode(
  generator: GeneratorAPI,
  code: string,
  file: { dirname: string; path: string; importedModules?: string[] },
  options?: Partial<CompileCodeOptions>,
): GeneratorResult[] | string {
  const {
    includeExtraComponents,
    createFactoryOnly,
    excludePathPatterns,
  } = {
    ...DEFAULT_COMPILE_CODE_OPTIONS,
    ...options,
  };

  const source = ts.createSourceFile(
    file.path,
    code,
    ts.ScriptTarget.ES2016,
    true,
  );
  generator.setContext({
    path: file.path,
    dirname: file.dirname,
    importedModules: file.importedModules,
    excludePathPatterns,
  });
  const codeFactory = generateFactoryCode(ts, source, generator.getPlatform());

  if (createFactoryOnly && generator.cache[file.path]) {
    generator.setContext(null);
    return '';
  }

  const codeFactoryResult = generator.generate(
    eval(codeFactory),
    createFactoryOnly,
  );
  generator.postProcessResult?.(codeFactoryResult);
  generator.setContext(null);

  if (includeExtraComponents) {
    return codeFactoryResult;
  }
  return codeFactoryResult[0].code;
}
