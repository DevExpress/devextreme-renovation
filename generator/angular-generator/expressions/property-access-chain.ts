import { PropertyAccessChain as BasePropertyAccessChain } from "../../base-generator/expressions/property-access";
import { toStringOptions } from "../../base-generator/types";
import SyntaxKind from "../../base-generator/syntaxKind";
import { PropertyAccess } from "./property-access";
import { NonNullExpression } from "./non-null-expression";

export class PropertyAccessChain extends BasePropertyAccessChain {
  processName(options?: toStringOptions) {
    let expression = this.expression;
    if (
      expression instanceof PropertyAccessChain ||
      expression instanceof NonNullExpression
    ) {
      expression = expression.expression;
    }

    if (
      expression instanceof PropertyAccess &&
      this.name.toString(options) === "current"
    ) {
      const member = expression.getMember(options);
      if (member?.isRef || member?.isForwardRef || member?.isForwardRefProp) {
        return `${this.questionDotToken}nativeElement`;
      }
      if (member?.isRefProp) {
        return "";
      }
    }

    return super.processName(options);
  }

  toString(options?: toStringOptions) {
    if (options && options.newComponentContext !== SyntaxKind.ThisKeyword) {
      const expression = this.expression.toString(options);
      return `(${expression}===undefined||${expression}===null?undefined:${expression}.${this.name})`;
    }
    return super.toString(options);
  }

  getDependency(options: toStringOptions) {
    return super
      .getDependency(options)
      .concat(this.name.getDependency(options));
  }
}
