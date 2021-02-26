import { Class as BaseClass } from "../../base-generator/expressions/class";
import {
  Constructor,
  Property,
  BaseClassMember,
} from "../../base-generator/expressions/class-members";
import { SimpleExpression } from "../../base-generator/expressions/base";
import { Block } from "../../base-generator/expressions/statements";
import syntaxKind from "../../base-generator/syntaxKind";
import { Parameter } from "./functions/parameter";
import { Identifier } from "../../base-generator/expressions/common";

export class Class extends BaseClass {
  toString() {
    let constructor = this.members.find((m) => m instanceof Constructor) as
      | Constructor
      | undefined;
    const properties = this.members.filter(
      (m) => m instanceof Property
    ) as Property[];
    let members: (BaseClassMember | Constructor)[] = this.members;
    const heritageClauses = this.heritageClauses.filter(
      (h) => h.token === syntaxKind.ExtendsKeyword
    );
    const parameterInitializationStatements = properties.map(
      (p) => new SimpleExpression(`this.${p.name}=${p.initializer}`)
    );

    if (constructor) {
      constructor = Object.create(constructor) as Constructor;
      const constructorStatements = constructor.body?.statements || [];
      const superExpression = constructorStatements[0]
        .toString()
        .startsWith(syntaxKind.SuperKeyword)
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
        true
      );
    }

    if (!constructor) {
      if (properties.length) {
        const parameters = heritageClauses.length
          ? [
              new Parameter(
                [],
                [],
                syntaxKind.DotDotDotToken,
                new Identifier("args")
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
                ? [new SimpleExpression("super(...args)")]
                : []),
              ...parameterInitializationStatements,
            ],
            true
          )
        );
      }
    }

    if (constructor) {
      members = this.members.filter((m) => !(m instanceof Constructor));
      members.push(constructor);
    }

    return `${this.modifiers.join(" ")} 
            class ${this.name} ${
      this.heritageClauses.length ? `${heritageClauses.join(" ")}` : ""
    } {
                ${members.join("\n")}
            }`;
  }
}
