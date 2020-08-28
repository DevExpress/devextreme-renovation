import { JsxAttribute } from "./attribute";
import { toStringOptions } from "../../types";

export class AngularDirective extends JsxAttribute {
  getTemplateContext() {
    return [];
  }
  toString(options?: toStringOptions) {
    const initializer = this.compileInitializer({
      members: [],
      isDirective: true,
      ...options,
    });
    const value = initializer ? `="${initializer}"` : "";
    return `${this.name}${value}`;
  }
}
