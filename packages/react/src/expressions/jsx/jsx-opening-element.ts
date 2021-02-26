import { JsxOpeningElement as BaseJsxOpeningElement } from "../../../base-generator/expressions/jsx";
import { Expression } from "../../../base-generator/expressions/base";
import { Identifier } from "../../../base-generator/expressions/common";
import { toStringOptions } from "../../../base-generator/types";
import { Property } from "../class-members/property";
import {
  PropertyAssignment,
  SpreadAssignment,
} from "../../../base-generator/expressions/property-assignment";
import { ObjectLiteral } from "../../../base-generator/expressions/literal";

export class JsxOpeningElement extends BaseJsxOpeningElement {
  processTagName(tagName: Expression) {
    return tagName.toString() === "Fragment"
      ? new Identifier("React.Fragment")
      : tagName;
  }

  toString(options?: toStringOptions) {
    const templateProperty = this.getTemplateProperty(options) as Property;
    if (!templateProperty) {
      return super.toString(options);
    }
    this.checkTemplatePropUsage(templateProperty);

    const contextElements = this.attributes.reduce(
      (elements: (PropertyAssignment | SpreadAssignment)[], a) => {
        return elements.concat(a.getTemplateContext());
      },
      []
    );
    const templateParams = contextElements.length
      ? new ObjectLiteral(contextElements, false)
          .toString(options)
          .replace(/"/gi, "'")
      : "{}";

    return `${this.tagName.toString({
      ...options,
      variables: undefined,
    } as toStringOptions)}(${templateParams})`;
  }
}
