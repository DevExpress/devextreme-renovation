import {
  JsxElement as BaseJsxElement,
  JsxClosingElement,
} from "../../../base-generator/expressions/jsx";
import { JsxAttribute } from "./attribute";
import { JsxExpression } from "./jsx-expression";
import { JsxChildExpression } from "./jsx-child-expression";
import {
  JsxOpeningElement,
  JsxSelfClosingElement,
  processTagName,
} from "./jsx-opening-element";
import { toStringOptions } from "../../types";
import { JsxSpreadAttributeMeta } from "./spread-attribute";
import { JsxOpeningElement as BaseJsxOpeningElement } from "../../../base-generator/expressions/jsx";
import { Conditional } from "../../../base-generator/expressions/conditions";
import { AngularDirective } from "./angular-directive";
import { Identifier, Paren } from "../../../base-generator/expressions/common";
import { Prefix } from "../../../base-generator/expressions/operators";
import SyntaxKind from "../../../base-generator/syntaxKind";
import { Expression } from "../../../base-generator/expressions/base";

export const isElement = (e: any): e is JsxElement | JsxSelfClosingElement =>
  e instanceof JsxElement ||
  e instanceof JsxSelfClosingElement ||
  e instanceof BaseJsxOpeningElement;

export const creteJsxElementForVariable = function (
  sourceElement: JsxOpeningElement,
  children: Array<
    JsxElement | string | JsxChildExpression | JsxSelfClosingElement
  > = [],
  expression: Expression,
  attributes: JsxAttribute[] = [],
  options?: toStringOptions
): string {
  const element = new JsxElement(
    new JsxOpeningElement(
      expression,
      sourceElement.typeArguments,
      (sourceElement.attributes as JsxAttribute[]).concat(attributes),
      sourceElement.context
    ),
    children,
    new JsxClosingElement(processTagName(expression, sourceElement.context))
  );

  return element.toString(options);
};

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

  compileElementForVariable(options?: toStringOptions): string | undefined {
    const variable =
      options?.variables &&
      options.variables[this.openingElement.tagName.toString()];

    if (variable instanceof Conditional) {
      const thenComp = creteJsxElementForVariable(
        this.openingElement,
        this.children.slice(),
        variable.thenStatement,
        [new AngularDirective(new Identifier("*ngIf"), variable.expression)],
        options
      );

      const elseComp = creteJsxElementForVariable(
        this.openingElement,
        this.children.slice(),
        variable.elseStatement,
        [
          new AngularDirective(
            new Identifier("*ngIf"),
            new Prefix(
              SyntaxKind.ExclamationToken,
              new Paren(variable.expression)
            )
          ),
        ],
        options
      );

      return `${thenComp}\n${elseComp}`;
    }
    if (variable instanceof Identifier) {
      return creteJsxElementForVariable(
        this.openingElement,
        this.children.slice(),
        variable,
        [],
        options
      );
    }
  }

  toString(options?: toStringOptions) {
    const elementString = this.compileElementForVariable(options);
    if (elementString) {
      return elementString;
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
