import { ImportDeclaration as BaseImportDeclaration } from '@devextreme-generator/core';

export class ImportDeclaration extends BaseImportDeclaration {
  compileComponentDeclarationImport() {
    const inferno: string[] = [];
    const common: string[] = [];
    const result: string[] = [];
    if (this.has('Fragment')) {
      inferno.push('Fragment');
    }

    if (inferno.length) {
      result.push(`import {${inferno}} from "inferno"`);
    }

    if (this.has('Portal')) {
      common.push('Portal as createPortal');
    }

    if (this.has('RefObject') || this.has('Ref') || this.has('ForwardRef')) {
      common.push('MutableRefObject');
    }

    if (this.has('createContext')) {
      common.push('createContext');
    }

    if (common.length) {
      result.push(
        `import {${common}} from "@devextreme/runtime/inferno-hooks"`,
      );
    }

    if (result.length) {
      return result.join(';\n');
    }
    return super.compileComponentDeclarationImport();
  }
}
