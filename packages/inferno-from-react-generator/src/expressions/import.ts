import * as Core from '@devextreme-generator/core';
import {
  Decorator, GeneratorContext, ImportClause, isNamespaceImport, StringLiteral,
} from '@devextreme-generator/core';

export const INFERNO_HOOKS_MODULE = '@devextreme/runtime/inferno-hooks';

function removeDefaultImport(clause: ImportClause): ImportClause {
  return new ImportClause(undefined, clause.namedBindings, clause.isTypeOnly);
}

export class ImportDeclaration extends Core.ImportDeclaration {
  hidden: boolean;

  constructor(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    importClause: Core.ImportClause,
    moduleSpecifier: StringLiteral,
    context: GeneratorContext,
  ) {
    const moduleName = moduleSpecifier.expression.toString();
    const isReactModule = moduleName === '@devextreme/runtime/react' || moduleName === 'react';

    const actualModule = isReactModule
      ? new StringLiteral(INFERNO_HOOKS_MODULE)
      : moduleSpecifier;

    const actualImportClause = isReactModule && !!importClause.default
      ? removeDefaultImport(importClause)
      : importClause;

    super(decorators, modifiers, actualImportClause, actualModule, context);

    this.hidden = isReactModule && (
      !importClause.namedBindings || isNamespaceImport(importClause.namedBindings)
    );
  }

  toString(): string {
    return this.hidden ? '' : super.toString();
  }
}

export class PatchedImportDeclaration extends ImportDeclaration {
  private patch: string;

  constructor(patch: string, ...parameters: ConstructorParameters<typeof ImportDeclaration>) {
    super(...parameters);
    this.patch = patch;
  }

  toString(): string {
    return `${this.patch}\n${super.toString()}`;
  }
}
