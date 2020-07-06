import { AsExpression as BaseAsExpression } from "../../base-generator/expressions/common";
import { toStringOptions } from "../types";

export class AsExpression extends BaseAsExpression {
  toString(options?: toStringOptions) {
    return `${this.expression.toString(options)}`;
  }
}
