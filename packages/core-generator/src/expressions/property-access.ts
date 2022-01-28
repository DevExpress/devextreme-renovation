import { Expression, ExpressionWithExpression } from './base';
import { toStringOptions } from '../types';
import { Identifier } from './common';
import { SyntaxKind } from '../syntaxKind';
import { Property, Method } from './class-members';
import { getProps } from './component';
import { processComponentContext } from '../utils/string';
import { BindingElement } from './binding-pattern';
import { Dependency } from '..';

export class ElementAccess extends ExpressionWithExpression {
  index: Expression;

  questionDotToken: string;

  constructor(
    expression: Expression,
    questionDotToken = '',
    index: Expression,
  ) {
    super(expression);
    this.index = index;
    this.questionDotToken = questionDotToken;
  }

  toString(options?: toStringOptions) {
    return `${super.toString(options)}${
      this.questionDotToken
    }[${this.index.toString(options)}]`;
  }

  getDependency(options: toStringOptions): Dependency[] {
    return super
      .getDependency(options)
      .concat(this.index.getDependency(options));
  }
}

export class ComputedPropertyName extends ExpressionWithExpression {
  toString(options?: toStringOptions) {
    return `[${super.toString(options)}]`;
  }
}

export class PropertyAccess extends ExpressionWithExpression {
  name: Identifier;

  constructor(expression: Expression, name: Identifier) {
    super(expression);
    this.name = name;
  }

  processProps(
    result: string,
    _options: toStringOptions,
    _elements: BindingElement[] = [],
  ) {
    return result;
  }

  checkPropsAccess(result: string, options?: toStringOptions) {
    return (
      result === `${processComponentContext(options?.componentContext)}props`
    );
  }

  calculateComponentContext(options?: toStringOptions) {
    return options?.componentContext !== undefined
      ? options?.componentContext
      : SyntaxKind.ThisKeyword;
  }

  getMembers(options?: toStringOptions) {
    const expressionString = this.expression.toString({
      members: [],
      variables: {
        ...options?.variables,
      },
    });
    const componentContext = this.calculateComponentContext(options);
    const usePropsSpace = options?.usePropsSpace
      || expressionString === `${processComponentContext(componentContext)}props`;
    if (expressionString === componentContext || usePropsSpace) {
      const props = getProps(options?.members || []) as Array<
      Property | Method
      >;
      return usePropsSpace
        ? props
        : options?.members.filter((m) => props.indexOf(m) === -1);
    }
    return undefined;
  }

  getMember(options?: toStringOptions) {
    return this.getMembers(options)?.find(
      (m) => m._name.toString() === this.name.toString(),
    );
  }

  processName(_options?: toStringOptions) {
    return `.${this.name}`;
  }

  toString(options?: toStringOptions, elements: BindingElement[] = []) {
    const member = this.getMember(options);
    if (member) {
      if (member.name.toString() === '__restAttributes' && options) {
        options.hasRestAttributes = true;
      }
      return `${member.getter(options!.newComponentContext, options)}`;
    }

    const result = `${this.expression.toString(options)}${this.processName(
      options,
    )}`;
    const context = this.calculateComponentContext(options);

    if (
      options?.newComponentContext !== undefined
      && result.startsWith(`${context}.`)
    ) {
      const value = options?.newComponentContext === ''
        ? result.replace(`${context}.`, options.newComponentContext)
        : result.replace(context, options.newComponentContext);

      if (this.checkPropsAccess(result, options)) {
        return this.processProps(value, options, elements);
      }
      return options?.newComponentContext === '' ? this.name.toString() : value;
    }
    return result;
  }

  compileStateSetting(
    state: string,
    property: Property,
    _options: toStringOptions,
  ) {
    return `this.${property.name}=${state}`;
  }

  getDependency(options: toStringOptions):Dependency[] {
    const expressionString = this.expression.toString();
    const componentContext = options?.componentContext || SyntaxKind.ThisKeyword;
    if (expressionString === componentContext && this.name.toString() !== 'props') {
      const member = options.members.find((m) => m._name.toString() === this.name.toString());
      return member ? [member] : [];
    }
    if (expressionString === `${componentContext}.props`) {
      const props = getProps(options.members);
      const member = props.find((m) => m._name.toString() === this.name.toString());
      return member ? [member] : [];
    }
    const dependency = this.expression.getDependency(options);
    if (
      this.toString() === `${componentContext}.props`
      && dependency.length === 0
    ) {
      return ['props'];
    }
    return dependency;
  }

  getAssignmentDependency(options: toStringOptions): Dependency[] {
    return this.getDependency(options);
  }

  isPropsScope(options?: toStringOptions) {
    if (
      this.expression instanceof PropertyAccess
      && this.expression.expression.toString(options)
        === options?.componentContext
      && this.expression.name.toString() === 'props'
    ) {
      return true;
    }
    return false;
  }
}

export class PropertyAccessChain extends ExpressionWithExpression {
  questionDotToken: string;

  name: Expression;

  constructor(
    expression: Expression,
    questionDotToken: string = SyntaxKind.DotToken,
    name: Expression,
  ) {
    super(expression);
    this.questionDotToken = questionDotToken;
    this.name = name;
  }

  processName(options?: toStringOptions) {
    return `${this.questionDotToken}${this.name.toString(options)}`;
  }

  toString(options?: toStringOptions) {
    const replaceMark = this.questionDotToken === SyntaxKind.QuestionDotToken;
    const firstPart = this.expression.toString(options);

    return `${
      replaceMark ? firstPart.replace(/[?!]$/, '') : firstPart
    }${this.processName(options)}`;
  }

  getDependency(options: toStringOptions): Dependency[] {
    return super
      .getDependency(options)
      .concat(this.name.getDependency(options));
  }

  getMember(options?: toStringOptions) {
    return options?.members.find(
      (m) => m._name.toString() === this.name.toString(),
    );
  }
}

export class Spread extends ExpressionWithExpression {
  toString(options?: toStringOptions) {
    return `${SyntaxKind.DotDotDotToken}${super.toString(options)}`;
  }
}

export const compileRefOptions = (
  expressionString: string,
  options?: toStringOptions,
) => ({
  members: [],
  ...options,
  componentContext:
    expressionString.includes('this') || options?.variables?.[expressionString]
      ? options?.componentContext
      : expressionString,
  usePropsSpace:
    !expressionString.includes('this')
    && !options?.variables?.[expressionString],
});
