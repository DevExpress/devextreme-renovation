import { AsExpression as BaseAsExpression } from '@devextreme-generator/core';
import { toStringOptions } from '../types';

export class AsExpression extends BaseAsExpression {
  toString(options?: toStringOptions) {
    return `${this.expression.toString(options)}`;
  }
}
