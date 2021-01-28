import { PropertyAccess as BasePropertyAccess } from "../../base-generator/expressions/property-access";
import { toStringOptions } from "../types";
import { BindingElement } from "../../base-generator/expressions/binding-pattern";
import { ObjectLiteral } from "../../base-generator/expressions/literal";
import { PropertyAssignment } from "../../base-generator/expressions/property-assignment";
import {
  Identifier,
  NonNullExpression,
} from "../../base-generator/expressions/common";
import { getProps } from "../../base-generator/expressions/component";
import { Property } from "../../base-generator/expressions/class-members";
import { getMember } from "../../base-generator/utils/expressions";

export class PropertyAccess extends BasePropertyAccess {
  processProps(
    _result: string,
    options: toStringOptions,
    elements: BindingElement[] = []
  ) {
    const hasRest = elements.some((e) => e.dotDotDotToken);
    const props = getProps(options.members).filter(
      (p) =>
        hasRest ||
        elements.length === 0 ||
        elements.some(
          (e) => (e.propertyName || e.name).toString() === p._name.toString()
        )
    );
    if (props.some((p) => !p.canBeDestructured) || props.length === 0) {
      const expression = new ObjectLiteral(
        props.map(
          (p) =>
            new PropertyAssignment(
              p._name,
              new PropertyAccess(
                new PropertyAccess(
                  new Identifier(this.calculateComponentContext(options)),
                  new Identifier("props")
                ),
                p._name
              )
            )
        ),
        true
      );
      return expression.toString(options);
    }
    return options.newComponentContext!;
  }

  compileStateSetting(
    value: string,
    property: Property,
    options: toStringOptions
  ) {
    if (property.isState) {
      return `this._${this.name}Change(${this.toString(options)}=${value})`;
    }
    if (property.isRef || property.isForwardRefProp) {
      const setValue = value.endsWith(".nativeElement")
        ? `new ElementRef(${value})`
        : value;
      if (property.isForwardRefProp) {
        return `this.forwardRef_${property.name}(${setValue})`;
      }
      return `this.${property.name} = ${setValue}`;
    }

    return `this._${property.name}=${value}`;
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

      if (
        member instanceof Property &&
        (member?.isRef || member?.isForwardRef)
      ) {
        return `.nativeElement`;
      }
      if (member?.isForwardRefProp) {
        return `?.().nativeElement`;
      }
      if (member?.isRefProp || member?.isApiRef) {
        return "";
      }
    }

    return super.processName(options);
  }
}
