import { PropertyAccessChain as BasePropertyAccessChain } from "../../angular-generator/expressions/property-access-chain";
import { toStringOptions } from "../types";
import { NonNullExpression } from "./non-null-expression";
import { PropertyAccess } from "./property-access";

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
      if (
        member?.isRef ||
        member?.isForwardRef ||
        member?.isForwardRefProp ||
        member?.isRefProp
      ) {
        return "";
      }
    }

    return super.processName(options);
  }
}
