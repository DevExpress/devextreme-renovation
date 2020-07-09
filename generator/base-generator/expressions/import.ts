import { StringLiteral } from "./literal";
import { Identifier } from "./common";
import { Decorator } from "./decorator";

export class NamedImports {
  node: ImportSpecifier[];
  constructor(node: ImportSpecifier[]) {
    this.node = node;
  }

  add(name: string) {
    this.remove(name);
    this.node.push(new ImportSpecifier(undefined, new Identifier(name)));
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

  add(name: string) {
    if (isNamedImports(this.namedBindings)) {
      this.namedBindings.add(name);
    } else {
      this.namedBindings = new NamedImports([
        new ImportSpecifier(undefined, new Identifier(name)),
      ]);
    }
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

  toString() {
    return `* as ${this.name}`;
  }
}
