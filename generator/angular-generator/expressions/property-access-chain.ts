import { PropertyAccessChain as BasePropertyAccessChain } from "../../base-generator/expressions/property-access";
import { toStringOptions } from "../../base-generator/types";
import SyntaxKind from "../../base-generator/syntaxKind";
import { getMember } from "../../base-generator/utils/expressions";
import { PropertyAccess } from "./property-access";
import { isProperty } from "../../base-generator/expressions/class-members";
import { Property } from "./class-members/property";

export class PropertyAccessChain extends BasePropertyAccessChain {
  getRefAccessor(member: Property) {
    if (member.isRef || member.isForwardRef) {
      return `${this.questionDotToken}nativeElement`;
    }
    if (member.isForwardRefProp) {
      return `?.()${this.questionDotToken}nativeElement`;
    }
    if (member.isRefProp || member.isApiRef) {
      return "";
    }
    return null;
  }

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

      if (member && isProperty(member)) {
        const accessor = this.getRefAccessor(member);
        if (accessor !== null) {
          return accessor;
        }
      }
    }

    return super.processName(options);
  }

  toString(options?: toStringOptions) {
    if (options && options.newComponentContext !== SyntaxKind.ThisKeyword) {
      const expression = this.expression.toString(options);
      const member = getMember(this.expression, options);
      const name =
        member?.isRef ||
        member?.isRefProp ||
        member?.isForwardRef ||
        member?.isForwardRefProp
          ? ""
          : `.${this.name}`;
      return `(${expression}===undefined||${expression}===null?undefined:${expression}${name})`;
    }
    return super.toString(options);
  }

  getDependency(options: toStringOptions) {
    return super
      .getDependency(options)
      .concat(this.name.getDependency(options));
  }
}
