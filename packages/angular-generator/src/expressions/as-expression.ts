import { AsExpression as BaseAsExpression, toStringOptions } from '@devextreme-generator/core';

export class AsExpression extends BaseAsExpression {
  toString(options?: toStringOptions) {
    if (options?.disableTemplates) {
      return this.expression.toString(options);
    }
    return super.toString(options);
  }
}
