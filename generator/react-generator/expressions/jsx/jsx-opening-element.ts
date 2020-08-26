import {
  JsxOpeningElement as BaseJsxOpeningElement,
  JsxExpression,
} from "../../../base-generator/expressions/jsx";
import {
  Expression,
  SimpleExpression,
} from "../../../base-generator/expressions/base";
import { Identifier } from "../../../base-generator/expressions/common";
import { toStringOptions } from "../../../base-generator/types";
import { JsxAttribute } from "./jsx-attribute";
import { PropertyAccess } from "../property-access";
import { Property } from "../class-members/property";
import {
  PropertyAssignment,
  SpreadAssignment,
} from "../../../base-generator/expressions/property-assignment";
import { ObjectLiteral } from "../../../base-generator/expressions/literal";
import { FunctionTypeNode } from "../../../base-generator/expressions/type";
import { SVGTags } from "../../../base-generator/constants";

export class JsxOpeningElement extends BaseJsxOpeningElement {
  processTagName(tagName: Expression) {
    return tagName.toString() === "Fragment"
      ? new Identifier("React.Fragment")
      : tagName;
  }

  attributesString(options?: toStringOptions) {
    if (this.isPortal()) {
      const containerIndex = this.attributes.findIndex(
        (attr) =>
          attr instanceof JsxAttribute && attr.name.toString() === "container"
      );
      if (containerIndex > -1) {
        const attr = this.attributes[containerIndex] as JsxAttribute;
        const expression = (attr.initializer as JsxExpression).getExpression()!;

        const propName =
          expression instanceof PropertyAccess
            ? expression.name.toString()
            : expression.toString();
        const relatedProp = options?.members.find(
          (m) => m.name.toString() === propName
        ) as Property | undefined;

        const token = relatedProp?.questionOrExclamationToken ?? "";
        const getter = relatedProp ? ".current!" : "";

        this.attributes[containerIndex] = new JsxAttribute(
          attr.name,
          new JsxExpression(
            undefined,
            new SimpleExpression(`${expression}${token}${getter}`)
          )
        );
      }
    }

    return super.attributesString(options);
  }

  toString(options?: toStringOptions) {
    const templateProperty = this.getTemplateProperty(options) as Property;
    if (!templateProperty) {
      return super.toString(options);
    }

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
      : templateProperty.type instanceof FunctionTypeNode &&
        templateProperty.type.parameters.length
      ? "{}"
      : "";

    return `${this.tagName.toString({
      ...options,
      variables: undefined,
    } as toStringOptions)}(${templateParams})`;
  }

  isSVG() {
    return SVGTags.includes(this.tagName.toString());
  }
}
