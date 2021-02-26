import {
  NonNullExpression as BaseNonNullExpression,
  toStringOptions,
} from "@devextreme-generator/core";

export class NonNullExpression extends BaseNonNullExpression {
  toString(options?: toStringOptions) {
    return this.expression.toString(options);
  }
}
