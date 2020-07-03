import { Identifier, Paren } from "./common";
import {
  Expression,
  ExpressionWithExpression,
  SimpleExpression,
  ExpressionWithOptionalExpression,
} from "./base";
import { toStringOptions, GeneratorContext } from "../types";
import SyntaxKind from "../syntaxKind";
import { Conditional } from "./conditions";
import { Component } from "./component";
import { PropertyAssignment, SpreadAssignment } from "./property-assignment";

export function getJsxExpression(
  e: ExpressionWithExpression | Expression | undefined
): JsxExpression | undefined {
  if (e instanceof Conditional && e.isJsx()) {
    return new JsxExpression(undefined, e);
  } else if (
    e instanceof JsxExpression ||
    e instanceof JsxElement ||
    e instanceof JsxOpeningElement
  ) {
    return e as JsxExpression;
  } else if (
    e instanceof ExpressionWithExpression ||
    e instanceof ExpressionWithOptionalExpression
  ) {
    return getJsxExpression(e.expression);
  } else if (e instanceof Expression) {
    return new JsxExpression(undefined, e);
  }
}

export class JsxAttribute {
  name: Identifier;
  initializer: Expression;
  constructor(name: Identifier, initializer?: Expression) {
    this.name = name;
    this.initializer =
      initializer || new JsxExpression(undefined, new SimpleExpression("true"));
  }

  getTemplateContext(options?: toStringOptions): PropertyAssignment | null {
    return null;
  }

  toString(options?: toStringOptions) {
    const name = this.name.toString(options);
    return `${name}=${this.initializer.toString(options)}`;
  }
}

export class JsxOpeningElement extends Expression {
  tagName: Expression;
  typeArguments: any[];
  attributes: Array<JsxAttribute | JsxSpreadAttribute>;
  context: GeneratorContext;
  component?: Component;

  processTagName(tagName: Expression) {
    return tagName;
  }

  constructor(
    tagName: Expression,
    typeArguments: any,
    attributes: Array<JsxAttribute | JsxSpreadAttribute> = [],
    context: GeneratorContext
  ) {
    super();
    this.tagName = tagName;
    this.typeArguments = typeArguments;
    this.attributes = attributes;
    this.context = context;
    const component = context.components?.[tagName.toString()];
    if (component instanceof Component) {
      this.component = component;
    }
  }

  attributesString(options?: toStringOptions) {
    const inputOptions = options;
    if (this.component && options) {
      options = {
        ...options,
        jsxComponent: this.component,
      };
    }

    const value = this.attributes
      .map((a) => a.toString(options))
      .filter((s) => s)
      .join("\n");

    if (inputOptions) {
      (inputOptions as any).forwardRef = (options as any).forwardRef;
    }

    return value;
  }

  toString(options?: toStringOptions) {
    return `<${this.processTagName(this.tagName).toString(
      options
    )} ${this.attributesString(options)}>`;
  }

  addAttribute(attribute: JsxAttribute) {
    this.attributes.push(attribute);
  }

  isJsx() {
    return true;
  }

  getTemplateProperty(options?: toStringOptions) {
    const tagName = this.tagName.toString(options);
    return options?.members.find(
      (s) =>
        s.isTemplate && tagName === `${s.getter(options?.newComponentContext)}`
    );
  }
}

export class JsxElement extends Expression {
  openingElement: JsxOpeningElement;
  children: Array<JsxElement | string | JsxExpression | JsxSelfClosingElement>;
  closingElement: JsxClosingElement;
  constructor(
    openingElement: JsxOpeningElement,
    children: Array<
      JsxElement | string | JsxExpression | JsxSelfClosingElement
    >,
    closingElement: JsxClosingElement
  ) {
    super();
    this.openingElement = openingElement;
    this.children = children;
    this.closingElement = closingElement;
  }

  toString(options?: toStringOptions) {
    const children: string = this.children
      .map((c) => c.toString(options))
      .join("\n");
    return `${this.openingElement.toString(
      options
    )}${children}${this.closingElement.toString(options)}`;
  }

  addAttribute(attribute: JsxAttribute) {
    this.openingElement.addAttribute(attribute);
  }

  isJsx() {
    return true;
  }
}

export class JsxSelfClosingElement extends JsxOpeningElement {
  toString(options?: toStringOptions) {
    return `<${this.processTagName(this.tagName).toString(
      options
    )} ${this.attributesString(options)}/>`;
  }
}

export class JsxClosingElement extends JsxOpeningElement {
  constructor(tagName: Expression) {
    super(tagName, [], [], {});
  }

  toString(options?: toStringOptions) {
    return `</${this.processTagName(this.tagName).toString(options)}>`;
  }
}

export class JsxExpression extends ExpressionWithOptionalExpression {
  dotDotDotToken: string;
  constructor(dotDotDotToken: string = "", expression?: Expression) {
    super(expression);
    this.dotDotDotToken = dotDotDotToken;
  }

  toString(options?: toStringOptions) {
    return this.expression
      ? `{${this.dotDotDotToken}${this.expression.toString(options)}}`
      : "";
  }

  isJsx() {
    return true;
  }

  getExpression(options?: toStringOptions): Expression | undefined {
    let variableExpression;
    if (
      this.expression instanceof Identifier &&
      options?.variables?.[this.expression.toString()]
    ) {
      variableExpression = options.variables[this.expression.toString()];
    }

    if (variableExpression instanceof Paren) {
      return variableExpression.expression;
    }

    return variableExpression || this.expression;
  }
}

export class JsxSpreadAttribute extends JsxExpression {
  expression: Expression;
  constructor(expression: Expression) {
    super(SyntaxKind.DotDotDotToken, expression);
    this.expression = expression;
  }

  getTemplateContext(): SpreadAssignment | null {
    return new SpreadAssignment(this.expression);
  }
}
