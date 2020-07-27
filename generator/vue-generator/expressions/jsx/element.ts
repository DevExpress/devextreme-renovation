import {
  JsxElement as BaseJsxElement,
  creteJsxElementForVariable,
} from "../../../angular-generator/expressions/jsx/elements";
import { JsxChildExpression } from "./jsx-expression";
import { JsxExpression as AngularJsxExpression } from "../../../angular-generator/expressions/jsx/jsx-expression";
import { toStringOptions } from "../../types";
import { Conditional } from "../../../base-generator/expressions/conditions";
import { VueDirective } from "./vue-directive";
import { Identifier } from "../../../base-generator/expressions/common";
import { SimpleExpression } from "../../../base-generator/expressions/base";

export class JsxElement extends BaseJsxElement {
  createChildJsxExpression(expression: AngularJsxExpression) {
    return new JsxChildExpression(expression);
  }

  compileElementForVariable(options?: toStringOptions): string | undefined {
    const variable =
      options?.variables &&
      options.variables[this.openingElement.tagName.toString()];

    if (variable instanceof Conditional) {
      const thenComp = creteJsxElementForVariable(
        this.openingElement,
        this.children.slice(),
        new Identifier("component"),
        [
          new VueDirective(
            new Identifier(":is"),
            new Conditional(
              variable.expression,
              new SimpleExpression(`"${variable.thenStatement.toString()}"`),
              new SimpleExpression(`"${variable.elseStatement.toString()}"`)
            )
          ),
        ],
        options
      );

      return thenComp;
    }
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
