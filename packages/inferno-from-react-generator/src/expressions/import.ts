import * as Core from '@devextreme-generator/core';
import {
  Decorator, GeneratorContext, StringLiteral,
} from '@devextreme-generator/core';
import { INFERNO_HOOKS_MODULE } from './inferno-hooks-imports';

export class ImportDeclaration extends Core.ImportDeclaration {
  constructor(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    importClause: Core.ImportClause,
    moduleSpecifier: StringLiteral,
    context: GeneratorContext,
  ) {
    const moduleName = moduleSpecifier.expression.toString();
    const actualModule = moduleName === '@devextreme/runtime/react' || moduleName === 'react'
      ? new StringLiteral(INFERNO_HOOKS_MODULE)
      : moduleSpecifier;

    super(decorators, modifiers, importClause, actualModule, context);
  }

  toString(): string {
    if (this.importClause.toString().indexOf('React') !== -1) {
      return '';
    }
    return super.toString();
  }
}
