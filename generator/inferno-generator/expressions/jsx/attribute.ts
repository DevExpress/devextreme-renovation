import { JsxExpression } from "../../../base-generator/expressions/jsx";
import { toStringOptions } from "../../../base-generator/types";
import { JsxAttribute as BaseJsxAttribute } from "../../../preact-generator";

export class JsxAttribute extends BaseJsxAttribute {
  toString(options?: toStringOptions) {
    const name = this.name.toString();
    if (name === "style" && this.initializer instanceof JsxExpression) {
      const value =
        this.initializer.getExpression(options)?.toString(options) ?? "{}";
      return `${this.processName(name, options)}={normalizeStyles(${value})}`;
    }
    return super.toString(options);
  }
}
