import { JsxSpreadAttribute as BaseJsxSpreadAttribute } from "../../../angular-generator/expressions/jsx/spread-attribute";
import { toStringOptions } from "../../types";
import { PropertyAccess } from "../../../base-generator/expressions/property-access";
import { GetAccessor } from "../../../base-generator/expressions/class-members";

export class JsxSpreadAttribute extends BaseJsxSpreadAttribute {
  getTemplateProp(options?: toStringOptions) {
    return this.toString(options);
  }

  toString(options?: toStringOptions) {
    const expression = this.getExpression(options);
    if (expression instanceof PropertyAccess) {
      const member = expression.getMember(options);
      if (
        member instanceof GetAccessor &&
        member._name.toString() === "restAttributes"
      ) {
        return "";
      }
    }
    return `v-bind="${expression.toString(options).replace(/"/gi, "'")}"`;
  }
}
