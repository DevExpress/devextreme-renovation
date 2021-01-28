import { PropertyAccess as BasePropertyAccess } from "../../base-generator/expressions/property-access";
import { Property } from "./class-members/property";
import { BindingElement } from "../../base-generator/expressions/binding-pattern";
import { toStringOptions } from "../types";
import { getMember } from "../../base-generator/utils/expressions";
import { NonNullExpression } from "./non-null-expression";

export class PropertyAccess extends BasePropertyAccess {
  compileStateSetting(state: string, property: Property) {
    const isState = property.isState;
    const propertyName = isState ? `${property.name}_state` : property.name;
    const stateSetting = `this.${propertyName}=${state}`;
    if (isState) {
      return `${stateSetting},\nthis.${property._name}Change(this.${propertyName})`;
    }
    if (property.isRef) {
      return `this.$refs.${propertyName}=${state}`;
    }
    if (property.isForwardRefProp) {
      return `this.forwardRef_${propertyName}(${state}), this.${propertyName}(${state})`;
    }
    return stateSetting;
  }

  toString(options?: toStringOptions, elements: BindingElement[] = []) {
    const member = this.getMember(options);
    if (member && member.isRefProp && member instanceof Property) {
      return `${member.getter(options!.newComponentContext, options?.keepRef)}`;
    }
    return super.toString(options, elements);
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
      const expression =
        this.expression instanceof NonNullExpression
          ? this.expression.expression
          : this.expression;

      const member = getMember(expression, {
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

      if (member?.isRef || member?.isForwardRef || member?.isApiRef) {
        return "";
      }
      if (member?.isRefProp || member?.isForwardRefProp) {
        return `()`;
      }
    }

    return super.processName(options);
  }
}
