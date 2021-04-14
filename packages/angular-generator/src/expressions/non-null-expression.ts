import {
  NonNullExpression as BaseNonNullExpression,
  toStringOptions,
  SyntaxKind,
} from '@devextreme-generator/core';

export class NonNullExpression extends BaseNonNullExpression {
  toString(options?: toStringOptions) {
    if (options && options.componentContext !== SyntaxKind.ThisKeyword) {
      return this.expression.toString(options);
    }
    return super.toString(options);
  }
}
