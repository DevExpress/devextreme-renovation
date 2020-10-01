import {
  JsxElement as BaseJsxElement,
  JsxClosingElement,
} from "../../../base-generator/expressions/jsx";
import { JsxExpression } from "./jsx-expression";
import { JsxChildExpression } from "./jsx-child-expression";
import {
  JsxOpeningElement,
  JsxSelfClosingElement,
} from "./jsx-opening-element";
import { toStringOptions } from "../../types";
import { JsxSpreadAttributeMeta } from "./spread-attribute";
import { JsxOpeningElement as BaseJsxOpeningElement } from "../../../base-generator/expressions/jsx";

export const isElement = (e: any): e is JsxElement | JsxSelfClosingElement =>
  e instanceof JsxElement ||
  e instanceof JsxSelfClosingElement ||
  e instanceof BaseJsxOpeningElement;

export class JsxElement extends BaseJsxElement {
  createChildJsxExpression(expression: JsxExpression) {
    return new JsxChildExpression(expression);
  }

  openingElement: JsxOpeningElement;
  children: Array<
    JsxElement | string | JsxChildExpression | JsxSelfClosingElement
  >;
  constructor(
    openingElement: JsxOpeningElement,
    children: Array<
      JsxElement | string | JsxExpression | JsxSelfClosingElement
    >,
    closingElement: JsxClosingElement
  ) {
    super(openingElement, children, closingElement);
    this.openingElement = openingElement;
    this.children = children.map((c) =>
      c instanceof JsxExpression
        ? this.createChildJsxExpression(c)
        : typeof c === "string"
        ? c.trim()
        : c
    );
    this.closingElement = closingElement;
  }

  compileOnlyChildren() {
    return this.openingElement.tagName.toString() === "Fragment";
  }

  toString(options?: toStringOptions) {
    const elementString = this.openingElement.compileJsxElementsForVariable(
      options,
      this.children.slice()
    );
    if (elementString) {
      return elementString;
    }

    if (this.openingElement.isDynamicComponent(options)) {
      return this.openingElement.toString(options);
    }

    const openingElementString = this.openingElement.toString(options);
    const children = this.children.concat([
      ...this.openingElement.getSlotsFromAttributes(options),
      ...this.openingElement.getTemplatesFromAttributes(options),
    ]);

    const childrenString: string = children
      .map((c) => c.toString(options))
      .join("");

    if (this.compileOnlyChildren()) {
      return childrenString;
    }
    const closingElementString = !this.openingElement.getTemplateProperty(
      options
    )
      ? this.closingElement.toString(options)
      : "";

    return `${openingElementString}${childrenString}${closingElementString}`;
  }

  clone() {
    return new JsxElement(
      this.openingElement.clone(),
      this.children.slice(),
      this.closingElement
    );
  }

  getSpreadAttributes() {
    const result = this.openingElement.getSpreadAttributes();
    const allAttributes: JsxSpreadAttributeMeta[] = this.children.reduce(
      (result: JsxSpreadAttributeMeta[], c) => {
        if (isElement(c)) {
          return result.concat(c.getSpreadAttributes());
        }
        return result;
      },
      result
    );
    return allAttributes;
  }
}
