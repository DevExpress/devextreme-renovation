import { ImportDeclaration as BaseImportDeclaration } from "../../base-generator/expressions/import";

export class ImportDeclaration extends BaseImportDeclaration {
  compileComponentDeclarationImport() {
    const inferno: string[] = [];
    const result: string[] = [];
    if (this.has("Fragment")) {
      inferno.push("Fragment");
    }
    if (this.has("Portal")) {
      inferno.push("createPortal");
    }

    if (inferno.length) {
      result.push(`import {${inferno}} from "inferno"`);
    }

    if (this.has("createContext")) {
      result.push(
        `const createContext = function<T>(defaultValue: T){ return defaultValue}`
      );
    }

    if (result.length) {
      return result.join(";\n");
    }
    return super.compileComponentDeclarationImport();
  }
}
