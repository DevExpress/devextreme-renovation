import { Decorators, ImportDeclaration as BaseImportDeclaration } from '@devextreme-generator/core';

export class ImportDeclaration extends BaseImportDeclaration {
  compileComponentDeclarationImport() {
    const imports: string[] = [];
    if (this.has('createContext')) {
      if (!this.has('ComponentBindings')) {
        imports.push('Injectable');
      }
      imports.push('EventEmitter as ContextEmitter');
    }
    if (this.has(Decorators.Consumer)) {
      imports.push('SkipSelf', 'Optional');
    }

    if (this.has(Decorators.Provider)) {
      imports.push('Host');
    }

    if (imports.length) {
      return `import { ${imports} } from "@angular/core"`;
    }

    return super.compileComponentDeclarationImport();
  }
}
