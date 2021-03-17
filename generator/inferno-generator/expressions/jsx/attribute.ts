import { JsxExpression } from "../../../base-generator/expressions/jsx";
import { toStringOptions } from "../../../base-generator/types";
import { JsxAttribute as BaseJsxAttribute } from "../../../preact-generator";

export class JsxAttribute extends BaseJsxAttribute {
  toString(options: toStringOptions) {
    const name = this.name.toString();
    if (name === "style") {
      const value =
        this.initializer instanceof JsxExpression
          ? this.initializer.expression?.toString(options) ?? ""
          : this.initializer.toString(options);
      return `${this.processName(name, options)}={normalizeStyles(${value})}`;
    }
    return super.toString(options);
  }
}
