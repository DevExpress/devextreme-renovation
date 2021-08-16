import {
  ArrowFunction,
  Binary,
  Block,
  Call,
  GetAccessor as BaseGetAccessor,
  Identifier,
  Paren,
  ReturnStatement,
  SimpleExpression,
  SyntaxKind,
  TypeExpression,
  Expression,
  toStringOptions,
} from '@devextreme-generator/core';

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
  get canBeDestructured() {
    if (
      this.isEvent
      || this.isNested
      || this.isForwardRefProp
      || this.isRef
      || this.isRefProp
      || this.isForwardRef
    ) {
      return false;
    }
    return super.canBeDestructured;
  }

  toString(options?: toStringOptions): string {
    if (options?.isComponent
       && this.body
       && this.isMemorized(options)) {
      const baseGetter = new BaseGetAccessor(
        this.decorators,
        this.modifiers,
        new Identifier(this.name),
        this.parameters,
        this.type,
        this.body,
      );
      if (baseGetter?.body) {
        baseGetter.body.statements = compileGetterCache(
          this._name, this.type, this.body, this.isProvider,
        );
        return baseGetter.toString(options);
      }
    }
    return super.toString(options);
  }
}
