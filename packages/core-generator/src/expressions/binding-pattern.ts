import { Expression, SimpleExpression } from './base';
import { Identifier } from './common';
import { VariableExpression, toStringOptions } from '../types';
import { ElementAccess, PropertyAccess } from './property-access';

export class BindingElement extends Expression {
  dotDotDotToken?: string;

  propertyName?: Identifier;

  name: string | Identifier | BindingPattern;

  initializer?: Expression;

  constructor(
    dotDotDotToken = '',
    propertyName: Identifier | undefined,
    name: string | Identifier | BindingPattern,
    initializer?: Expression,
  ) {
    super();
    this.dotDotDotToken = dotDotDotToken;
    this.propertyName = propertyName;
    this.name = name;
    this.initializer = initializer;
  }

  toString() {
    const nameString = this.name.toString();
    const key = this.propertyName
      ? `${this.propertyName}${nameString ? ':' : ''}`
      : '';
    return `${key}${this.dotDotDotToken}${nameString}`;
  }

  getDependency(_options: toStringOptions) {
    if (!this.propertyName) {
      return [this.name.toString()];
    }
    return [this.propertyName.toString()];
  }
}

export class BindingPattern extends Expression {
  elements: Array<BindingElement>;

  removedElements: Array<BindingElement> = [];

  type: 'array' | 'object';

  constructor(elements: Array<BindingElement>, type: 'object' | 'array') {
    super();
    this.elements = elements;
    this.type = type;
  }

  toString() {
    if (this.elements.length === 0) {
      return '';
    }
    return this.type === 'array'
      ? `[${this.elements}]`
      : `{${this.elements.sort((a, b) => {
        if (a.dotDotDotToken) {
          return 1;
        }
        if (b.dotDotDotToken) {
          return -1;
        }
        const aValue = a.propertyName?.toString() || a.name.toString();
        const bValue = b.propertyName?.toString() || b.name.toString();

        if (aValue < bValue) {
          return -1;
        }
        return 1;
      })}}`;
  }

  remove(name: string) {
    const element = this.elements.find((e) => e.name.toString() === name);
    if (element) {
      this.removedElements.push(element);
      this.elements = this.elements.filter((e) => e !== element);
    }
  }

  add(element: BindingElement) {
    this.elements.push(element);
  }

  getDependency(options: toStringOptions) {
    return this.elements
      .concat(this.removedElements)
      .reduce((d: string[], e) => d.concat(e.getDependency(options)), []);
  }

  hasRest() {
    return this.elements.find((e) => e.dotDotDotToken);
  }

  getVariableExpressions(startExpression: Expression): VariableExpression {
    return this.elements.reduce((v: VariableExpression, e, index) => {
      let expression: Expression | null = null;

      if (this.type !== 'object') {
        expression = new ElementAccess(
          startExpression,
          undefined,
          new SimpleExpression(index.toString()),
        );
      } else if (e.name instanceof Identifier) {
        expression = new PropertyAccess(
          startExpression,
          e.propertyName || e.name,
        );
      } else if (typeof e.name === 'string') {
        const name = e.name;
        expression = new PropertyAccess(startExpression, new Identifier(name));
      } else if (e.name instanceof BindingPattern && e.propertyName) {
        return {
          ...e.name.getVariableExpressions(
            new PropertyAccess(startExpression, e.propertyName),
          ),
          ...v,
        };
      }
      /* istanbul ignore next */
      if (expression) {
        return {
          [e.name.toString()]: expression,
          ...v,
        };
      }

      /* istanbul ignore next */
      return v;
    }, {});
  }
}
