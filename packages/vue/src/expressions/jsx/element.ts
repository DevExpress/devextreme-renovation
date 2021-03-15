import { JsxChildExpression } from "./jsx-expression";
import {
  JsxElement as BaseJsxElement,
  JsxExpression as AngularJsxExpression,
} from "@devextreme-generator/angular";

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