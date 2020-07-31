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

export class GetAccessor extends BaseGetAccessor {
  constructor(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    name: Identifier,
    parameters: Parameter[],
    type?: TypeExpression | string,
    body?: Block
  ) {
    if (type && body && isComplexType(type)) {
      const cacheAccess = `this.__getterCache["${name.toString()}"]`;
      body.statements = [
        new SimpleExpression(`
                    if(${cacheAccess}!==undefined){
                        return ${cacheAccess};
                    }`),
        new ReturnStatement(
          new Binary(
            new SimpleExpression(cacheAccess),
            SyntaxKind.EqualsToken,
            new Call(
              new Paren(
                new ArrowFunction(
                  [],
                  undefined,
                  [],
                  type,
                  SyntaxKind.EqualsGreaterThanToken,
                  new Block(body.statements, false),
                  {}
                )
              ),
              undefined
            )
          )
        ),
      ];
    }
    super(decorators, modifiers, name, parameters, type, body);
  }

  isMemorized(): boolean {
    return isComplexType(this.type);
  }
}
