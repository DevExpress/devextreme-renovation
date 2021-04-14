import { If } from './conditions';
import { toStringOptions } from '../types';
import { Expression, ExpressionWithExpression } from './base';

export class While extends If {
  toString(options?: toStringOptions) {
    return `while(${this.expression.toString(
      options,
    )})${this.thenStatement.toString(options)}`;
  }
}

export class Do extends While {
  constructor(statement: Expression, expression: Expression) {
    super(expression, statement);
  }

  toString(options?: toStringOptions) {
    return `do ${this.thenStatement.toString(options)} 
            while(${this.expression.toString(options)})`;
  }
}

export class For extends ExpressionWithExpression {
  initializer?: Expression;

  condition?: Expression;

  incrementor?: Expression;

  constructor(
    initializer: Expression | undefined,
    condition: Expression | undefined,
    incrementor: Expression | undefined,
    statement: Expression,
  ) {
    super(statement);
    this.initializer = initializer;
    this.condition = condition;
    this.incrementor = incrementor;
  }

  toString(options?: toStringOptions) {
    const initializer = this.initializer
      ? this.initializer.toString(options)
      : '';
    const condition = this.condition ? this.condition.toString(options) : '';
    const incrementor = this.incrementor
      ? this.incrementor.toString(options)
      : '';

    return `for(${initializer};${condition};${incrementor})${this.expression.toString(
      options,
    )}`;
  }

  getDependency(options: toStringOptions) {
    return super
      .getDependency(options)
      .concat(
        (this.initializer && this.initializer.getDependency(options)) || [],
      )
      .concat((this.condition && this.condition.getDependency(options)) || [])
      .concat(
        (this.incrementor && this.incrementor.getDependency(options)) || [],
      );
  }
}

export class ForIn extends ExpressionWithExpression {
  initializer: Expression;

  statement: Expression;

  constructor(
    initializer: Expression,
    expression: Expression,
    statement: Expression,
  ) {
    super(expression);
    this.initializer = initializer;
    this.statement = statement;
  }

  toString(options?: toStringOptions) {
    const initializer = this.initializer.toString(options);
    const statement = this.statement.toString(options);
    const expression = super.toString(options);

    return `for(${initializer} in ${expression})${statement}`;
  }

  getDependency(options: toStringOptions) {
    return super
      .getDependency(options)
      .concat(this.initializer.getDependency(options))
      .concat(this.statement.getDependency(options));
  }
}
