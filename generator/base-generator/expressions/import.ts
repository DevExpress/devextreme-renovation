import { StringLiteral } from "./literal";
import { Identifier } from "./common";
import { Decorator } from "./decorator";

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
        new Identifier(name)
      )
    );
  }

  has(name: string) {
    return this.node.some((n) => n.name.toString() === name);
  }

  remove(name: string) {
    this.node = this.node.filter((n) => n.toString() !== name);
  }

  toString() {
    return this.node.length ? `{${this.node.join(",")}}` : "";
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

export const isNamedImports = (node: any): node is NamedImports =>
  node instanceof NamedImports;
export class ImportClause {
  name?: Identifier;
  namedBindings?: NamedImportBindings;
  constructor(name?: Identifier, namedBindings?: NamedImportBindings) {
    this.name = name;
    this.namedBindings = namedBindings;
  }

  get default() {
    return this.name;
  }

  get imports() {
    return isNamedImports(this.namedBindings)
      ? this.namedBindings.node.map((m) => m.toString()) || []
      : undefined;
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
      namedBindings && result.push(namedBindings);
    }

    return result.length ? `${result.join(",")} from ` : "";
  }
}

export class ImportDeclaration {
  decorators: Decorator[];
  modifiers: string[];
  importClause: ImportClause;
  moduleSpecifier: StringLiteral;

  replaceSpecifier(search: string | RegExp, replaceValue: string) {
    this.moduleSpecifier.expression = this.moduleSpecifier.expression.replace(
      search,
      replaceValue
    );
  }

  add(name: string) {
    this.importClause.add(name);
  }

  has(name: string) {
    return this.importClause.has(name);
  }

  constructor(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    importClause: ImportClause,
    moduleSpecifier: StringLiteral
  ) {
    this.decorators = decorators;
    this.modifiers = modifiers;
    this.importClause = importClause;
    this.moduleSpecifier = moduleSpecifier;
  }

  toString() {
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
