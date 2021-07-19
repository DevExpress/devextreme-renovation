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
  Expression,
} from '@devextreme-generator/core';

import { Decorator } from '../decorator';

export const compileGetterCache = (
  name: Identifier,
  type: TypeExpression | string | undefined,
  body: Block,
  isProvider: boolean | undefined,
  needToHandleProvider = true,
): Expression[] => {
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
          {},
        ),
      ),
      undefined,
    ),
  );
  const returnExpression = isProvider && needToHandleProvider
    ? new Binary(
      new SimpleExpression(`this.${name}Provider.value`),
      SyntaxKind.EqualsToken,
      setCacheExpression,
    )
    : setCacheExpression;
  return [
    new SimpleExpression(`
                if(${cacheAccess}!==undefined){
                    return ${cacheAccess};
                }`),
    new ReturnStatement(returnExpression),
  ];
};
export class GetAccessor extends BaseGetAccessor {
  constructor(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    name: Identifier,
    parameters: Parameter[],
    type?: TypeExpression | string,
    body?: Block,
  ) {
    const isProvider = decorators?.some((d) => d.name === Decorators.Provider);
    if (body && ((type && isComplexType(type)) || isProvider)) {
      body.statements = compileGetterCache(name, type, body, isProvider);
    }
    super(decorators, modifiers, name, parameters, type, body);
  }

  isMemorized(): boolean {
    return isComplexType(this.type) || this.isProvider;
  }
}
