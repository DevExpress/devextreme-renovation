import { JsxExpression, toStringOptions } from "@devextreme-generator/core";
import { JsxAttribute as BaseJsxAttribute } from "@devextreme-generator/preact";

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
