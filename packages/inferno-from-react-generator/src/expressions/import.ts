import * as Core from '@devextreme-generator/core';
import {
  Decorator, GeneratorContext, NamedImports, StringLiteral,
} from '@devextreme-generator/core';

const infernoHookModuleName = '@devextreme/runtime/inferno-hooks';
export class ImportDeclaration extends Core.ImportDeclaration {
  constructor(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    importClause: Core.ImportClause,
    moduleSpecifier: StringLiteral,
    context: GeneratorContext,
  ) {
    if (moduleSpecifier.expression.toString() === '@devextreme/runtime/react') {
      super(decorators, modifiers, importClause, new StringLiteral(infernoHookModuleName), context);
    } else if (moduleSpecifier.expression.toString() === 'react') {
      if (importClause.namedBindings instanceof (NamedImports)) {
        importClause.namedBindings.add('HookContainer');
        importClause.namedBindings.add('InfernoWrapperComponent');
      }
      super(decorators, modifiers, importClause, new StringLiteral(infernoHookModuleName), context);
    } else {
      super(decorators, modifiers, importClause, moduleSpecifier, context);
    }
  }

  toString(): string {
    if (this.importClause.toString().indexOf('React') !== -1) {
      return '';
    }
    return super.toString();
  }
}
