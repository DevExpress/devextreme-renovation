import { Decorator } from './decorator';
import { Identifier } from './common';
import { Expression } from './base';

export class EnumMember {
  name: Expression;

  initializer?: Expression;

  constructor(name: Expression, initializer?: Expression) {
    this.name = name;
    this.initializer = initializer;
  }

  toString() {
    return this.initializer
      ? `${this.name}=${this.initializer}`
      : `${this.name}`;
  }
}

export class Enum {
  decorators: Decorator[];

  modifiers: string[];

  name: Identifier;

  members: EnumMember[];

  constructor(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    name: Identifier,
    members: EnumMember[],
  ) {
    this.decorators = decorators;
    this.modifiers = modifiers;
    this.name = name;
    this.members = members;
  }

  toString() {
    return `${this.modifiers.join(' ')} enum ${this.name} {
      ${this.members.join(',\n')}
    }`;
  }
}
