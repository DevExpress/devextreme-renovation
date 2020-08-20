import { ImportDeclaration as BaseImportDeclaration } from "../../base-generator/expressions/import";

export class ImportDeclaration extends BaseImportDeclaration {
  compileComponentDeclarationImport() {
    if (this.has("createContext")) {
      return `import { createContext } from "react"`;
    }
    return super.compileComponentDeclarationImport();
  }
}
