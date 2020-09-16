import { IExpression, toStringOptions } from "../types";

export class Expression implements IExpression {
  getDependency(options?: toStringOptions): string[] {
    return [];
  }

  toString(options?: toStringOptions) {
    return "";
  }

  getAllDependency(options?: toStringOptions) {
    return this.getDependency(options);
  }

  isJsx() {
    return false;
  }
}

export class SimpleExpression extends Expression {
  expression: string;
  constructor(expression: string) {
    super();
    this.expression = expression;
  }

  toString() {
    return this.expression;
  }
}

export class ExpressionWithExpression extends Expression {
  expression: Expression;

  constructor(expression: Expression) {
    super();
    this.expression = expression;
  }

  toString(options?: toStringOptions) {
    return this.expression.toString(options);
  }

  getDependency(options?: toStringOptions) {
    return this.expression.getDependency(options);
  }

  isJsx() {
    return this.expression.isJsx();
  }
}

export class ExpressionWithOptionalExpression extends Expression {
  expression?: Expression;

  constructor(expression?: Expression) {
    super();
    this.expression = expression;
  }

  toString(options?: toStringOptions) {
    return this.expression ? this.expression.toString(options) : "";
  }

  isJsx() {
    return this.expression?.isJsx() || false;
  }

  getDependency(options?: toStringOptions) {
    return (this.expression && this.expression.getDependency(options)) || [];
  }
}
