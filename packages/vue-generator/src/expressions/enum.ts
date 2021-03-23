import {
  Decorator,
  Enum as BaseEnum,
  EnumMember as BaseEnumMember,
  Identifier,
  NumericLiteral
  } from '@devextreme-generator/core';

export class EnumMember extends BaseEnumMember {
  toString() {
    return `${this.name}:${this.initializer}`;
  }
}

export class Enum extends BaseEnum {
  members: EnumMember[];

  constructor(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    name: Identifier,
    members: EnumMember[]
  ) {
    super(decorators, modifiers, name, members);
    this.members = this.processMembers(members);
  }

  processMembers(members: BaseEnumMember[]) {
    return members.reduce((acc, m) => {
      let initializer = m.initializer;
      if (initializer === undefined) {
        if (acc.length > 0) {
          const nextValue = (
            parseInt(acc[acc.length - 1].initializer!.toString()) + 1
          ).toString();
          initializer = new NumericLiteral(nextValue);
        } else {
          initializer = new NumericLiteral("0");
        }
      }
      acc.push(new EnumMember(m.name, initializer));
      return acc;
    }, [] as EnumMember[]);
  }

  toString() {
    return `${this.modifiers.join(" ")} const ${this.name} = {
      ${this.members.join(",\n")}
    }`;
  }
}
