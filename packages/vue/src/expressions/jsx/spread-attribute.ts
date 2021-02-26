import { toStringOptions } from '../../types';
import { JsxSpreadAttribute as BaseJsxSpreadAttribute } from '@devextreme-generator/angular';
import { GetAccessor, PropertyAccess } from '@devextreme-generator/core';

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
