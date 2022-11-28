import {
  Decorator,
  GeneratorContext,
  ImportClause,
  ImportDeclaration,
  StringLiteral,
  VariableExpression,
} from '@devextreme-generator/core';

type AgregateableImportDeclaration = Pick<ImportDeclaration, 'toString'>;

export class ImportsAggregation {
  private declarations: AgregateableImportDeclaration[];

  public decorators!: Decorator[];

  public modifiers!: string[];

  public importClause!: ImportClause;

  public moduleSpecifier!: StringLiteral;

  public context!: GeneratorContext;

  constructor(...declarations: AgregateableImportDeclaration[]) {
    this.declarations = declarations;
  }

  toString(): string {
    return this.declarations.map((d) => d.toString()).join('\n');
  }

  replaceSpecifier() {
    throw new Error('Not implemented');
  }

  add() {
    throw new Error('Not implemented');
  }

  has(): boolean {
    throw new Error('Not implemented');
  }

  getVariableExpressions(): VariableExpression {
    throw new Error('Not implemented');
  }

  isCommonDeclarationModule(): boolean {
    throw new Error('Not implemented');
  }

  compileComponentDeclarationImport(): string {
    throw new Error('Not implemented');
  }
}
