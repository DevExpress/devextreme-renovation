import { NonNullExpression as BaseNonNullExpression } from "../../base-generator/expressions/common";
import { toStringOptions } from "../../base-generator/types";

export class NonNullExpression extends BaseNonNullExpression {
  toString(options?: toStringOptions) {
    return this.expression.toString(options);
  }
}
