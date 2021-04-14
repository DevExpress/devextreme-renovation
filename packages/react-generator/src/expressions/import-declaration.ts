import { ImportDeclaration as BaseImportDeclaration } from '@devextreme-generator/core';

export class ImportDeclaration extends BaseImportDeclaration {
  compileComponentDeclarationImport() {
    const react: string[] = [];
    const reactDom: string[] = [];
    const result: string[] = [];
    if (this.has('createContext')) {
      react.push('createContext');
    }

    if (this.has('Portal')) {
      reactDom.push('createPortal');
    }

    if (react.length) {
      result.push(`import { ${react} } from "react"`);
    }
    if (reactDom.length) {
      result.push(`import { ${reactDom} } from "react-dom"`);
    }

    if (result.length) {
      return result.join('\n;');
    }

    return super.compileComponentDeclarationImport();
  }
}
