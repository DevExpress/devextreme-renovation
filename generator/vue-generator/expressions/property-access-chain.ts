import { PropertyAccessChain as BasePropertyAccessChain } from "../../angular-generator/expressions/property-access-chain";
import { Property } from "./class-members/property";
import { toStringOptions } from "../types";
import SyntaxKind from "../../base-generator/syntaxKind";
import { getMember } from "../../base-generator/utils/expressions";

export class PropertyAccessChain extends BasePropertyAccessChain {
  getRefAccessor(member: Property) {
    if (member.isRef || member.isForwardRef || member.isApiRef) {
      return "";
    }
    if (member.isRefProp || member.isForwardRefProp) {
      return `${this.questionDotToken}()`;
    }
    return null;
  }

  toString(options?: toStringOptions) {
    if (options && options.newComponentContext !== SyntaxKind.ThisKeyword) {
      const expression = this.expression.toString(options);
      const member = getMember(this.expression, options);
      if (
        member?.isRef ||
        member?.isRefProp ||
        member?.isForwardRef ||
        member?.isForwardRefProp
      ) {
        return `(${expression} && ${expression}()?${expression}():undefined)`;
      }
    }
    return super.toString(options);
  }
}
