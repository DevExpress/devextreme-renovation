import { GeneratorAPI, GeneratorResult } from "./base-generator/generator-api";
import { generateFactoryCode } from "./factoryCodeGenerator";
import ts from "typescript";

export function compileCode(
  generator: GeneratorAPI,
  code: string,
  file: { dirname: string; path: string; importedModules?: string[] },
  includeExtraComponents: boolean = false
): GeneratorResult[] | string {
  const source = ts.createSourceFile(
    file.path,
    code,
    ts.ScriptTarget.ES2016,
    true
  );
  generator.setContext({
    path: file.path,
    dirname: file.dirname,
    importedModules: file.importedModules,
  });
  const codeFactory = generateFactoryCode(ts, source);

  const codeFactoryResult = generator.generate(eval(codeFactory));
  generator.setContext(null);

  if (includeExtraComponents) {
    return codeFactoryResult;
  }
  return codeFactoryResult[0].code;
}
