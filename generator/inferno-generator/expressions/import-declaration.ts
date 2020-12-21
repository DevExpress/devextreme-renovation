import { ImportDeclaration as BaseImportDeclaration } from "../../base-generator/expressions/import";

export class ImportDeclaration extends BaseImportDeclaration {
  compileComponentDeclarationImport() {
    if (this.has("Fragment")) {
      return `import {Fragment} from "inferno"`;
    }
    return super.compileComponentDeclarationImport();
  }
}
