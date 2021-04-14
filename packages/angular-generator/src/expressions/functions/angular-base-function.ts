import { Function } from '@devextreme-generator/core';
import { isElement } from '../jsx/elements';
import { JsxChildExpression } from '../jsx/jsx-child-expression';
import { JsxExpression } from '../jsx/jsx-expression';

export class AngularBaseFunction extends Function {
  processTemplateExpression(expression?: JsxExpression) {
    if (expression && !isElement(expression)) {
      return new JsxChildExpression(expression);
    }
    return super.processTemplateExpression(expression);
  }
}
