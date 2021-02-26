import { AsExpression as BaseAsExpression } from "../../base-generator/expressions/common";
import { toStringOptions } from "../../base-generator/types";

export class AsExpression extends BaseAsExpression {
  toString(options?: toStringOptions) {
    if (options?.disableTemplates) {
      return this.expression.toString(options);
    }
    return super.toString(options);
  }
}
