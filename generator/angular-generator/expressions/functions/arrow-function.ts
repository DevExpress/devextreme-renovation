import { ArrowFunction as BaseArrowFunction } from "../../../base-generator/expressions/functions";
import { JsxChildExpression } from "../jsx/jsx-child-expression";
import { JsxExpression } from "../jsx/jsx-expression";
import { isElement } from "../jsx/elements";
import { toStringOptions } from "../../types";

export class ArrowFunction extends BaseArrowFunction {
  processTemplateExpression(expression?: JsxExpression) {
    if (expression && !isElement(expression)) {
      return new JsxChildExpression(expression);
    }
    return super.processTemplateExpression(expression);
  }
  toString(options?: toStringOptions) {
    if (this.isJsx()) {
      return "";
    }
    return super.toString(options);
  }
}
