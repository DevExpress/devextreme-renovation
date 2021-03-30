import {
  ArrowFunction,
  Binary,
  Block,
  Call,
  Decorators,
  GetAccessor as BaseGetAccessor,
  Identifier,
  isComplexType,
  Parameter,
  Paren,
  ReturnStatement,
  SimpleExpression,
  SyntaxKind,
  TypeExpression,
} from "@devextreme-generator/core";

import { Decorator } from "../decorator";

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

  get canBeDestructured() {
    if (
      this.isEvent ||
      this.isNested ||
      this.isForwardRefProp ||
      this.isRef ||
      this.isRefProp ||
      this.isForwardRef
    ) {
      return false;
    }
    return super.canBeDestructured;
  }
}
