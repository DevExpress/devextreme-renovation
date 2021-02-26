import { ExpressionWithExpression } from "./base";
import { toStringOptions } from "../types";
import syntaxKind from "../syntaxKind";

export class Throw extends ExpressionWithExpression {
  toString(options?: toStringOptions) {
    return `${syntaxKind.ThrowKeyword} ${this.expression.toString(options)}`;
  }
}
