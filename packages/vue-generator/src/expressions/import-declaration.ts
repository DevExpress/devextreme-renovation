import { ImportDeclaration as BaseImportDeclaration } from '@devextreme-generator/core';
import path from 'path';

export class ImportDeclaration extends BaseImportDeclaration {
  compileComponentDeclarationImport() {
    if (this.has('createContext') || this.has('Portal')) {
      return "import Vue from 'vue';";
    }

    return super.compileComponentDeclarationImport();
  }

  toString() {
    if (
      path.extname(this.moduleSpecifier.expression.toString()) === '.d'
      || this.importClause.isTypeOnly
    ) {
      return '';
    }
    return super.toString();
  }
}
