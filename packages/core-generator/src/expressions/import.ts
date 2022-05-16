import { GeneratorContext, VariableExpression } from '../types';
import { Identifier } from './common';
import { Decorator } from './decorator';
import { StringLiteral } from './literal';

export class NamedImports {
  node: ImportSpecifier[];

  constructor(node: ImportSpecifier[] = []) {
    this.node = node;
  }

  add(name: string, propertyName?: string) {
    this.remove(name);
    this.node.push(
      new ImportSpecifier(
        propertyName ? new Identifier(propertyName) : undefined,
        new Identifier(name),
      ),
    );
  }

  has(name: string) {
    return this.node.some((n) => n.name.toString() === name);
  }

  remove(name: string) {
    this.node = this.node.filter((n) => n.name.toString() !== name);
  }

  toString() {
    return this.node.length ? `{${this.node.join(',')}}` : '';
  }
}

export class ImportSpecifier {
  propertyName: Identifier | undefined;

  name: Identifier;

  constructor(propertyName: Identifier | undefined, name: Identifier) {
    this.propertyName = propertyName;
    this.name = name;
  }

  toString() {
    return this.propertyName
      ? `${this.propertyName} as ${this.name}`
      : this.name.toString();
  }
}

export type NamedImportBindings = NamespaceImport | NamedImports;

export const isNamedImports = (node: any): node is NamedImports => node instanceof NamedImports;
export class ImportClause {
  name?: Identifier;

  namedBindings?: NamedImportBindings;

  isTypeOnly?: boolean;

  constructor(
    name?: Identifier,
    namedBindings?: NamedImportBindings,
    isTypeOnly?: boolean,
  ) {
    this.name = name;
    this.namedBindings = namedBindings;
    this.isTypeOnly = isTypeOnly;
  }

  get default() {
    return this.name;
  }

  get imports() {
    return isNamedImports(this.namedBindings)
      ? this.namedBindings.node.map((m) => m.name.toString()) || []
      : undefined;
  }

  resolveImport(name: string): string | undefined {
    if (isNamedImports(this.namedBindings)) {
      const node = this.namedBindings.node.find(
        (n) => n.name.toString() === name,
      );
      if (node) {
        return node.propertyName?.toString() || name;
      }
    }
    return undefined;
  }

  remove(name: string) {
    if (isNamedImports(this.namedBindings)) {
      this.namedBindings.remove(name);
    }
  }

  has(name: string) {
    if (name === this.default?.toString()) {
      return true;
    }
    return this.namedBindings?.has(name) || false;
  }

  add(name: string, propertyName?: string) {
    if (!isNamedImports(this.namedBindings)) {
      this.namedBindings = new NamedImports();
    }

    this.namedBindings.add(name, propertyName);
  }

  toString() {
    const result: string[] = [];
    if (this.name) {
      result.push(this.name.toString());
    }

    if (this.namedBindings) {
      const namedBindings = this.namedBindings.toString();
      if (namedBindings) {
        result.push(namedBindings);
      }
    }

    return result.length
      ? `${this.isTypeOnly ? 'type ' : ''}${result.join(',')} from `
      : '';
  }
}

export class ImportDeclaration {
  constructor(
    public decorators: Decorator[] = [],
    public modifiers: string[] = [],
    public importClause: ImportClause,
    public moduleSpecifier: StringLiteral,
    public context: GeneratorContext,
  ) {}

  replaceSpecifier(search: string | RegExp, replaceValue: string): void {
    this.moduleSpecifier.expression = this.moduleSpecifier.expression.replace(
      search,
      replaceValue,
    );
  }

  add(name: string): void {
    this.importClause.add(name);
  }

  has(name: string): boolean {
    return this.importClause.has(name);
  }

  getVariableExpressions(): VariableExpression {
    if (this.isCommonDeclarationModule()) {
      return {};
    }
    return (this.importClause.imports || []).reduce(
      (result: VariableExpression, name: string) => ({
        ...result,
        [name]: new Identifier(name),
      }),
      {
        ...(this.importClause.default && {
          [this.importClause.default.toString()]: this.importClause.default,
        }),
      },
    );
  }

  isCommonDeclarationModule(): boolean {
    return (
      this.moduleSpecifier.expression.toString() === '@devextreme-generator/declarations'
    );
  }

  compileComponentDeclarationImport(): string {
    return '';
  }

  toString(): string {
    if (this.isCommonDeclarationModule()) {
      return this.compileComponentDeclarationImport();
    }
    return `import ${this.importClause}${this.moduleSpecifier}`;
  }
}

export class NamespaceImport {
  name: Identifier;

  constructor(name: Identifier) {
    this.name = name;
  }

  has(name: string) {
    return this.name.toString() === name;
  }

  toString() {
    return `* as ${this.name}`;
  }
}
