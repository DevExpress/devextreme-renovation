import { PropertyAccessChain as BasePropertyAccessChain } from "../../base-generator/expressions/property-access";
import { toStringOptions } from "../../base-generator/types";
import SyntaxKind from "../../base-generator/syntaxKind";

export class PropertyAccessChain extends BasePropertyAccessChain {
  toString(options?: toStringOptions) {
    if (options && options.newComponentContext !== SyntaxKind.ThisKeyword) {
      const expression = this.expression.toString(options);
      return `(${expression}===undefined||${expression}===null?undefined:${expression}.${this.name})`;
    }
    return super.toString(options);
  }

  getDependency(options: toStringOptions) {
    return super
      .getDependency(options)
      .concat(this.name.getDependency(options));
  }
}
