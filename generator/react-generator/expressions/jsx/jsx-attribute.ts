import {
  JsxAttribute as BaseJsxAttribute,
  JsxExpression,
} from "../../../base-generator/expressions/jsx";
import { PropertyAssignment } from "../../../base-generator/expressions/property-assignment";
import { toStringOptions } from "../../../base-generator/types";
import { getProps } from "../../../base-generator/expressions/component";

const eventsDictionary = {
  pointerover: "onPointerOver",
  pointerout: "onPointerOut",
  pointerdown: "onPointerDown",
  click: "onClick",
};

export class JsxAttribute extends BaseJsxAttribute {
  getTemplateContext(): PropertyAssignment[] {
    const initializer =
      this.initializer instanceof JsxExpression
        ? this.initializer
        : new JsxExpression(undefined, this.initializer);
    return [new PropertyAssignment(this.name, initializer.getExpression()!)];
  }

  processName(name: string, _options?: toStringOptions) {
    return (eventsDictionary as any)[name] || name;
  }

  toString(options?: toStringOptions) {
    let tsOptions = options;
    let name = this.name.toString(options);

    if (name === "style" && this.initializer instanceof JsxExpression) {
      const value =
        this.initializer.getExpression(options)?.toString(options) ?? "{}";
      return `${this.processName(name, options)}={normalizeStyles(${value})}`;
    }

    if (options?.jsxComponent) {
      const member = getProps(options.jsxComponent.members).find(
        (m) => m._name.toString() === this.name.toString()
      );
      if (member) {
        name = member.name;

        if (member.isTemplate) {
          tsOptions = { ...options, variables: undefined };
        }
      }
    }
    return `${this.processName(name, tsOptions)}=${this.initializer.toString(
      tsOptions
    )}`;
  }
}
