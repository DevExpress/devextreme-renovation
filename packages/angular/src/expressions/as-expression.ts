import { AsExpression as BaseAsExpression } from "@devextreme-generator/core";
import { toStringOptions } from "@devextreme-generator/core";

export class AsExpression extends BaseAsExpression {
  toString(options?: toStringOptions) {
    if (options?.disableTemplates) {
      return this.expression.toString(options);
    }
    return super.toString(options);
  }
}
