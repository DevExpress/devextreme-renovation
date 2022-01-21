import { Call, Identifier, Paren } from './common';
import {
  Expression,
  ExpressionWithExpression,
  ExpressionWithOptionalExpression,
  SimpleExpression,
} from './base';
import { toStringOptions, GeneratorContext } from '../types';
import { SyntaxKind } from '../syntaxKind';
import { Conditional } from './conditions';
import { Component } from './component';
import { PropertyAssignment, SpreadAssignment } from './property-assignment';
import { getTemplateProperty } from '../utils/expressions';
import { Property } from './class-members';
import { isFunction } from './functions';
import { ElementAccess } from '..';

export function getJsxExpression(
  e: ExpressionWithExpression | Expression | undefined,
  options?: toStringOptions,
): JsxExpression | undefined {
  if (e instanceof Conditional && e.isJsx()) {
    return new JsxExpression(undefined, e);
  }
  if (
    options
    && e instanceof Identifier
    && options.variables?.[e.toString()]
  ) {
    const expression = options.variables[e.toString()];
    return getJsxExpression(expression, options);
  }
  if (
    e instanceof JsxExpression
    || e instanceof JsxElement
    || e instanceof JsxOpeningElement
  ) {
    return e as JsxExpression;
  }
  if (e instanceof Call) {
    return new JsxExpression(undefined, e);
  }
  if (
    e instanceof Paren
    || e instanceof ExpressionWithOptionalExpression
  ) {
    return getJsxExpression(e.expression, options);
  }
  return new JsxExpression(undefined, e);
}

export function getExpressionFromParens(
  expression: Expression | undefined,
): Expression | undefined {
  if (expression instanceof Paren) {
    return getExpressionFromParens(expression.expression);
  }
  return expression;
}

export class JsxAttribute {
  name: Identifier;

  initializer: Expression;

  constructor(name: Identifier, initializer?: Expression) {
    this.name = name;
    this.initializer = initializer || new JsxExpression(undefined, new SimpleExpression('true'));
  }

  getTemplateContext(_options?: toStringOptions): PropertyAssignment[] {
    return [];
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

  processTagName(
    tagName: Expression,
    _options?: toStringOptions,
    _isClosing = false,
  ) {
    return tagName;
  }

  constructor(
    tagName: Expression,
    typeArguments: any,
    attributes: Array<JsxAttribute | JsxSpreadAttribute> = [],
    context: GeneratorContext,
  ) {
    super();
    this.tagName = tagName;
    this.typeArguments = typeArguments;
    this.attributes = attributes;
    this.context = context;
    this.fillComponent();
  }

  fillComponent() {
    const component = this.context.components?.[this.tagName.toString()];
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
      .join('\n');

    if (inputOptions) {
      (inputOptions as any).forwardRef = (options as any).forwardRef;
    }

    return value;
  }

  getJsxOptions(options?: toStringOptions) {
    const tagNameString = this.tagName.toString();
    const jsxVariables = { ...options?.variables };
    if (!jsxVariables?.[tagNameString]) {
      return options;
    }
    if (
      options?.members.find(
        (m) => m._name.toString() === tagNameString && !m.isTemplate,
      )
    ) {
      delete jsxVariables?.[tagNameString];
    }
    return {
      ...options,
      variables: jsxVariables,
    } as toStringOptions;
  }

  toString(options?: toStringOptions) {
    return `<${this.processTagName(this.tagName, options).toString(
      this.getJsxOptions(options),
    )} ${this.attributesString(options)}>`;
  }

  addAttribute(attribute: JsxAttribute) {
    this.attributes.push(attribute);
  }

  isJsx() {
    return true;
  }

  getTemplateProperty(options?: toStringOptions) {
    return getTemplateProperty(this.tagName, options);
  }

  checkTemplatePropUsage(templateProperty: Property) {
    if (
      this.attributes.some(
        (c) => c instanceof JsxAttribute && c.name.toString() === 'ref',
      )
    ) {
      throw `Templates do not support refs. See '${templateProperty.name}' prop usage in view function`;
    }
  }

  isPortal() {
    return this.tagName.toString() === 'Portal';
  }

  hasStyle() {
    return this.attributes.some(
      (attribute) => attribute instanceof JsxAttribute
        && (attribute.name.toString() === 'style'
          || (attribute.initializer instanceof JsxExpression
            && attribute.initializer.expression
            && isFunction(attribute.initializer.expression)
            && attribute.initializer.expression.containsStyle())),
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
    closingElement: JsxClosingElement,
  ) {
    super();
    this.openingElement = openingElement;
    this.children = children;
    this.closingElement = closingElement;
  }

  toString(options?: toStringOptions) {
    const children: string = this.children
      .map((c) => {
        if (typeof c === 'string') {
          return c.trim();
        }
        return c.toString(options);
      })
      .join('\n');
    return `${this.openingElement.toString(
      options,
    )}${children}${this.closingElement.toString(options)}`;
  }

  addAttribute(attribute: JsxAttribute) {
    this.openingElement.addAttribute(attribute);
  }

  isJsx() {
    return true;
  }

  isPortal() {
    return this.openingElement.isPortal();
  }

  hasStyle() {
    return this.openingElement.hasStyle();
  }
}

export class JsxSelfClosingElement extends JsxOpeningElement {
  toString(options?: toStringOptions) {
    return `<${this.processTagName(this.tagName, options).toString(
      this.getJsxOptions(options),
    )} ${this.attributesString(options)}/>`;
  }
}

export class JsxClosingElement extends JsxOpeningElement {
  constructor(tagName: Expression) {
    super(tagName, [], [], {});
  }

  toString(options?: toStringOptions) {
    return `</${this.processTagName(this.tagName, options, true).toString(
      this.getJsxOptions(options),
    )}>`;
  }
}

export class JsxExpression extends ExpressionWithOptionalExpression {
  dotDotDotToken: string;

  constructor(dotDotDotToken = '', expression?: Expression) {
    super(expression);
    this.dotDotDotToken = dotDotDotToken;
  }

  toString(options?: toStringOptions) {
    return this.expression
      ? `{${this.dotDotDotToken}${this.expression.toString(options)}}`
      : '';
  }

  isJsx() {
    return true;
  }

  getExpression(options?: toStringOptions): Expression | undefined {
    let variableExpression;
    const expression = getExpressionFromParens(this.expression);
    if (
      expression instanceof Identifier
      && options?.variables?.[expression.toString()]
    ) {
      variableExpression = options.variables[expression.toString()];
      if (options?.isFunctionalComponent) {
        let innerExpression = variableExpression;
        if (innerExpression instanceof ElementAccess) {
          innerExpression = innerExpression.expression;
        }
        if (innerExpression instanceof Call) {
          const functionName = innerExpression.expression.toString();
          if (functionName === 'useState' || functionName === 'useCallback' || functionName === 'useMemo') {
            variableExpression = undefined;
          }
        }
      }
    }

    return getExpressionFromParens(variableExpression) || expression;
  }
}

export class JsxSpreadAttribute extends JsxExpression {
  expression: Expression;

  constructor(expression: Expression) {
    super(SyntaxKind.DotDotDotToken, expression);
    this.expression = expression;
  }

  getTemplateContext(): (PropertyAssignment | SpreadAssignment)[] {
    return [new SpreadAssignment(this.expression)];
  }
}
