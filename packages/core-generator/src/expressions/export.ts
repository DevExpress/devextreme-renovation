import { NamedImports, ImportSpecifier } from './import';
import { Decorator } from './decorator';
import { Expression } from './base';

export class NamedExports extends NamedImports {}

export class ExportSpecifier extends ImportSpecifier {}

export class ExportDeclaration {
  constructor(
    public decorators: Decorator[] | undefined,
    public modifiers: string[] = [],
    public exportClause: NamedExports | undefined,
    public moduleSpecifier?: Expression,
  ) {}

  toString(): string {
    if (this.exportClause?.node.length === 0 && !this.moduleSpecifier) {
      return '';
    }
    return `export ${this.exportClause ? this.exportClause : '*'}${
      this.moduleSpecifier ? ` from ${this.moduleSpecifier}` : ''
    }`;
  }
}
