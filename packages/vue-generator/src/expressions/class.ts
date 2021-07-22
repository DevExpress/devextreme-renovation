import {
  SimpleExpression,
  Class as BaseClass,
  Identifier,
  Block,
  SyntaxKind,
  Constructor,
  Property,
  BaseClassMember,
} from '@devextreme-generator/core';
import { Parameter } from './functions/parameter';

export class Class extends BaseClass {
  toString() {
    let constructor = this.members.find((m) => m instanceof Constructor) as
      | Constructor
      | undefined;
    const properties = this.members.filter(
      (m) => m instanceof Property,
    ) as Property[];
    let members: (BaseClassMember | Constructor)[] = this.members;
    const heritageClauses = this.heritageClauses.filter(
      (h) => h.token === SyntaxKind.ExtendsKeyword,
    );
    const parameterInitializationStatements = properties.map(
      (p) => new SimpleExpression(`this.${p.name}=${p.initializer}`),
    );

    if (constructor) {
      constructor = Object.create(constructor) as Constructor;
      const constructorStatements = constructor.body?.statements || [];
      const superExpression = constructorStatements[0]
        .toString()
        .startsWith(SyntaxKind.SuperKeyword)
        ? [constructorStatements[0]]
        : [];
      constructor.body = new Block(
        [
          ...superExpression,
          ...parameterInitializationStatements,
          ...(superExpression.length
            ? constructorStatements.slice(1)
            : constructorStatements),
        ],
        true,
      );
    }

    if (!constructor) {
      if (properties.length) {
        const parameters = heritageClauses.length
          ? [
            new Parameter(
              [],
              [],
              SyntaxKind.DotDotDotToken,
              new Identifier('args'),
            ),
          ]
          : [];

        constructor = new Constructor(
          [],
          [],
          parameters,
          new Block(
            [
              ...(parameters.length
                ? [new SimpleExpression('super(...args)')]
                : []),
              ...parameterInitializationStatements,
            ],
            true,
          ),
        );
      }
    }

    if (constructor) {
      members = this.members.filter((m) => !(m instanceof Constructor));
      members.push(constructor);
    }

    return `${this.modifiers.filter((modifier) => modifier !== SyntaxKind.AbstractKeyword).join(' ')} class ${this.name} ${
      this.heritageClauses.length ? `${heritageClauses.join(' ')}` : ''
    } {
                ${members.join('\n')}
            }`;
  }
}
