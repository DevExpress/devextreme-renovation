import { Decorator } from './decorator';
import { StringLiteral } from './literal';
import { Block } from './statements';

export class ModuleDeclaration {
  constructor(
    private decorators: Decorator[] | undefined,
    private modifiers: string[] | undefined,
    private name: StringLiteral,
    private body: Block | undefined,
  ) { }

  toString(): string {
    const decorators = this.decorators?.join(' ') ?? '';
    const modifiers = this.modifiers?.join(' ') ?? '';
    const body = this.body ?? '';

    return `${decorators} ${modifiers} module ${this.name} ${body}`;
  }
}
