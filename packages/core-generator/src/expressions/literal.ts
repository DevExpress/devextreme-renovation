import { SimpleExpression, Expression } from './base';
import {
  PropertyAssignment,
  ShorthandPropertyAssignment,
  SpreadAssignment,
} from './property-assignment';
import { Identifier } from './common';
import { toStringOptions } from '../types';
import { Dependency } from '..';

export class StringLiteral extends SimpleExpression {
  quoteSymbol: string;

  constructor(value: string, quoteSymbol = '"') {
    super(value);
    this.quoteSymbol = quoteSymbol;
  }

  toString() {
    return `${this.quoteSymbol}${this.expression.replace(/"/g, '\\"')}${
      this.quoteSymbol
    }`;
  }

  valueOf() {
    return this.expression;
  }
}

export class NumericLiteral extends SimpleExpression {}

export class ArrayLiteral extends Expression {
  elements: Expression[];

  multiLine: boolean;

  constructor(elements: Expression[], multiLine: boolean) {
    super();
    this.elements = elements;
    this.multiLine = multiLine;
  }

  toString(options?: toStringOptions) {
    return `[${this.elements.map((e) => e.toString(options))}]`;
  }

  getDependency(options: toStringOptions): Dependency[] {
    return this.elements.reduce(
      (d: Dependency[], p) => d.concat(p.getDependency(options)),
      [],
    );
  }
}

export class ObjectLiteral extends Expression {
  properties: Array<
  PropertyAssignment | ShorthandPropertyAssignment | SpreadAssignment
  >;

  multiLine: boolean;

  constructor(
    properties: Array<
    PropertyAssignment | ShorthandPropertyAssignment | SpreadAssignment
    >,
    multiLine: boolean,
  ) {
    super();
    this.properties = properties;
    this.multiLine = multiLine;
  }

  getProperty<T = Expression>(propertyName: string): T | null | undefined {
    const property = this.properties.find(
      (p) => p.key && p.key.toString() === propertyName,
    );
    if (property) {
      return property.value as T | null;
    }
    return undefined;
  }

  setProperty(propertyName: string, value: Expression) {
    this.properties.push(
      new PropertyAssignment(new Identifier(propertyName), value),
    );
  }

  removeProperty(propertyName: string) {
    this.properties = this.properties.filter(
      (p) => p.key?.toString() !== propertyName,
    );
  }

  toString(options?: toStringOptions) {
    return `{${this.properties
      .map((p) => p.toString(options))
      .join(`,${this.multiLine ? '\n' : ''}`)}}`;
  }

  toObject() {
    const toObject = (literal: ObjectLiteral) => literal.properties.reduce((r: any, p) => {
      if (p.key && p.value) {
        r[p.key.toString()] = p.value instanceof ObjectLiteral
          ? toObject(p.value)
          : p.value.toString();
      }
      return r;
    }, {});

    return toObject(this);
  }

  getDependency(options: toStringOptions): Dependency[] {
    return this.properties.reduce(
      (d: Dependency[], p) => d.concat(p.getDependency(options)),
      [],
    );
  }
}
