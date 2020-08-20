import {
  isComplexType,
  TypeExpression,
} from "../../../base-generator/expressions/type";
import { GetAccessor as BaseGetAccessor } from "../../../base-generator/expressions/class-members";
import { Decorator } from "../decorator";
import { SimpleExpression } from "../../../base-generator/expressions/base";
import {
  ReturnStatement,
  Block,
} from "../../../base-generator/expressions/statements";
import {
  Identifier,
  Call,
  Paren,
} from "../../../base-generator/expressions/common";
import {
  Parameter,
  ArrowFunction,
} from "../../../base-generator/expressions/functions";
import { Binary } from "../../../base-generator/expressions/operators";

import SyntaxKind from "../../../base-generator/syntaxKind";
import { Decorators } from "../../../component_declaration/decorators";

export class GetAccessor extends BaseGetAccessor {
  constructor(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    name: Identifier,
    parameters: Parameter[],
    type?: TypeExpression | string,
    body?: Block
  ) {
    const isProvider = decorators?.some((d) => d.name === Decorators.Provider);
    if (body && ((type && isComplexType(type)) || isProvider)) {
      const cacheAccess = `this.__getterCache["${name.toString()}"]`;
      const setCacheExpression = new Binary(
        new SimpleExpression(cacheAccess),
        SyntaxKind.EqualsToken,
        new Call(
          new Paren(
            new ArrowFunction(
              [],
              [],
              [],
              type,
              SyntaxKind.EqualsGreaterThanToken,
              new Block(body.statements, false),
              {}
            )
          ),
          undefined
        )
      );
      const returnExpression = !isProvider
        ? setCacheExpression
        : new Binary(
            new SimpleExpression(`this.${name}Provider.value`),
            SyntaxKind.EqualsToken,
            setCacheExpression
          );
      body.statements = [
        new SimpleExpression(`
                    if(${cacheAccess}!==undefined){
                        return ${cacheAccess};
                    }`),
        new ReturnStatement(returnExpression),
      ];
    }
    super(decorators, modifiers, name, parameters, type, body);
  }

  isMemorized(): boolean {
    return isComplexType(this.type) || this.isProvider;
  }
}
