import {
  Expression,
  ExpressionWithOptionalExpression,
  ExpressionWithExpression,
} from "./base";
import { toStringOptions } from "../types";
import { Identifier } from "./common";
import { ComputedPropertyName } from "./property-access";

export class PropertyAssignment extends Expression {
  constructor(
    public key: Identifier | ComputedPropertyName,
    public value: Expression
  ) {
    super();
  }

  toString(options?: toStringOptions) {
    const key =
      this.key instanceof ComputedPropertyName
        ? this.key.toString(options)
        : this.key.toString();
    return `${key}:${this.value.toString(options)}`;
  }

  getDependency(options?: toStringOptions) {
    const keyDependency =
      this.key instanceof ComputedPropertyName
        ? this.key.getDependency(options)
        : [];
    return keyDependency.concat(this.value.getDependency(options));
  }
}

export class ShorthandPropertyAssignment extends ExpressionWithOptionalExpression {
  name: Identifier;

  constructor(name: Identifier, expression?: Expression) {
    super(expression);
    this.name = name;
  }

  get key() {
    return this.name;
  }

  get value() {
    return this.expression ? this.expression : this.name;
  }

  toString(options?: toStringOptions) {
    let expression = this.expression ? `:${super.toString(options)}` : "";
    if (!expression && options?.variables?.[this.name.toString()]) {
      expression = `:${options.variables[this.name.toString()].toString(
        options
      )}`;
    }

    return `${this.name}${expression}`;
  }
}

export class SpreadAssignment extends ExpressionWithExpression {
  key: null = null;
  value: null = null;

  toString(options?: toStringOptions) {
    return `...${this.expression.toString(options)}`;
  }
}
