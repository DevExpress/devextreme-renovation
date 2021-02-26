import { NonNullExpression as BaseNonNullExpression } from "../../base-generator/expressions/common";
import { toStringOptions } from "../../base-generator/types";
import SyntaxKind from "../../base-generator/syntaxKind";

export class NonNullExpression extends BaseNonNullExpression {
  toString(options?: toStringOptions) {
    if (options && options.componentContext !== SyntaxKind.ThisKeyword) {
      return this.expression.toString(options);
    }
    return super.toString(options);
  }
}
