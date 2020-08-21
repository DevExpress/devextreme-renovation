import { PropertyAccessChain as BasePropertyAccessChain } from "../../base-generator/expressions/property-access";
import { toStringOptions } from "../../base-generator/types";
import SyntaxKind from "../../base-generator/syntaxKind";

export class PropertyAccessChain extends BasePropertyAccessChain {
  toString(options?: toStringOptions) {
    if (options && options.newComponentContext !== SyntaxKind.ThisKeyword) {
      return `(${this.expression}===undefined||${this.expression}===null?undefined:${this.expression}.${this.name})`;
    }
    return super.toString(options);
  }

  getDependency() {
    return super.getDependency().concat(this.name.getDependency());
  }
}
