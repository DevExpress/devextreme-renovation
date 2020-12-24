import { ImportDeclaration as BaseImportDeclaration } from "../../base-generator/expressions/import";

export class ImportDeclaration extends BaseImportDeclaration {
  compileComponentDeclarationImport() {
    const inferno: string[] = [];
    if (this.has("Fragment")) {
      inferno.push("Fragment");
    }
    if (this.has("Portal")) {
      inferno.push("createPortal");
    }

    if (inferno.length) {
      return `import {${inferno}} from "inferno"`;
    }
    return super.compileComponentDeclarationImport();
  }
}
