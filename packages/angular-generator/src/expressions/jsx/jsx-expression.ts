import {
  JsxExpression as BaseJsxExpression,
  Expression,
  Call,
  BaseFunction,
  PropertyAccessChain,
  PropertyAccess,
} from '@devextreme-generator/core';
import { toStringOptions } from '../../types';

export class JsxExpression extends BaseJsxExpression {
  getIterator(expression: Expression): BaseFunction | undefined {
    if (
      expression instanceof Call
      && (expression.expression instanceof PropertyAccess
        || expression.expression instanceof PropertyAccessChain)
      && expression.expression.name.toString() === 'map'
    ) {
      const iterator = expression.arguments[0];
      if (iterator instanceof BaseFunction) {
        return iterator;
      }
    }
    return undefined;
  }

  toString(options?: toStringOptions) {
    const expression = this.getExpression(options);
    return expression ? expression.toString(options) : '';
  }
}
