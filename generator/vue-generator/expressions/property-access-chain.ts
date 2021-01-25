import { PropertyAccessChain as BasePropertyAccessChain } from "../../angular-generator/expressions/property-access-chain";
import { toStringOptions } from "../types";
import { PropertyAccess } from "./property-access";
import { getMember } from "../../base-generator/utils/expressions";

export class PropertyAccessChain extends BasePropertyAccessChain {
  processName(options?: toStringOptions) {
    if (this.name.toString(options) === "current") {
      const expressionString = (this
        .expression as PropertyAccess).expression.toString({
        members: [],
        variables: {
          ...options?.variables,
        },
      });
      const member = getMember(this.expression, {
        members: [],
        ...options,
        componentContext:
          expressionString.includes("this") ||
          options?.variables?.[expressionString]
            ? options?.componentContext
            : expressionString,
        usePropsSpace:
          !expressionString.includes("this") &&
          !options?.variables?.[expressionString],
      });

      if (
        member?.isRef ||
        member?.isForwardRef ||
        member?.isForwardRefProp ||
        member?.isRefProp ||
        member?.isApiRef
      ) {
        return "";
      }
    }

    return super.processName(options);
  }
}
