import { JsxElement as BaseJsxElement } from "../../../angular-generator/expressions/jsx/elements";
import { JsxChildExpression } from "./jsx-expression";
import { JsxExpression as AngularJsxExpression } from "../../../angular-generator/expressions/jsx/jsx-expression";

export class JsxElement extends BaseJsxElement {
  createChildJsxExpression(expression: AngularJsxExpression) {
    return new JsxChildExpression(expression);
  }

  compileOnlyChildren() {
    return false;
  }

  clone() {
    return new JsxElement(
      this.openingElement.clone(),
      this.children.slice(),
      this.closingElement
    );
  }
}
