import {
  JsxElement as BaseJsxElement,
  JsxOpeningElement as BaseJsxOpeningElement,
} from "@devextreme-generator/core";
import { JsxExpression } from "./jsx-expression";
import {
  JsxChildExpression,
  mergeToStringOptions,
} from "./jsx-child-expression";
import {
  JsxOpeningElement,
  JsxSelfClosingElement,
  JsxClosingElement,
} from "./jsx-opening-element";
import { toStringOptions } from "../../types";
import { JsxSpreadAttributeMeta } from "./spread-attribute";
import { Property } from "../class-members/property";

export const isElement = (e: any): e is JsxElement | JsxSelfClosingElement =>
  e instanceof JsxElement ||
  e instanceof JsxSelfClosingElement ||
  e instanceof BaseJsxOpeningElement;

export class JsxElement extends BaseJsxElement {
  createChildJsxExpression(expression: JsxExpression) {
    return new JsxChildExpression(expression);
  }

  openingElement: JsxOpeningElement;
  closingElement: JsxClosingElement;
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

    const openingElementString = this.openingElement.toString(options);

    const hasSvgSlot = this.openingElement.component?.slots.some(
      (s) => s.isSvgSlot
    );
    const childrenOptions: toStringOptions | undefined =
      this.openingElement.component?.isSVGComponent ||
      (hasSvgSlot && !options?.isSVG)
        ? {
            members: [],
            ...options,
            isSVG: true,
            checkSlot:
              (!hasSvgSlot &&
                ((slot: Property, _options: toStringOptions) => {
                  if (!slot.isSvgSlot) {
                    throw `Can't pass ${slot._name} slot into ${
                      this.openingElement.component!._name
                    }: Use @Slot({isSVG: true})`;
                  }
                })) ||
              undefined,
          }
        : options;

    const children = this.children.concat([
      ...this.openingElement.getSlotsFromAttributes(childrenOptions),
      ...this.openingElement.getTemplatesFromAttributes(childrenOptions),
    ]);

    const childrenString: string = children
      .map((c) => c.toString(childrenOptions))
      .join("");

    mergeToStringOptions(options, childrenOptions);

    if (this.compileOnlyChildren()) {
      return childrenString;
    }

    const closingElementString = !this.openingElement.getTemplateProperty(
      options
    )
      ? this.closingElement.toString(options)
      : "";

    const separatedChildren = this.openingElement.separateChildrenForDynamicComponent(
      children,
      options
    );

    if (separatedChildren) {
      return `${openingElementString}${separatedChildren[0]}${closingElementString}${separatedChildren[1]}`;
    }

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
