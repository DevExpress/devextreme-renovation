import { Expression, ExpressionWithExpression } from './base';
import { Block } from './statements';
import { toStringOptions } from '../types';
import { Dependency } from '..';

export class Try extends ExpressionWithExpression {
  constructor(
    tryBlock: Block,
    public catchClause?: CatchClause,
    public finallyBlock?: Block,
  ) {
    super(tryBlock);
  }

  getDependency(options: toStringOptions): Dependency[] {
    return super
      .getDependency(options)
      .concat(this.catchClause ? this.catchClause.getDependency(options) : [])
      .concat(
        this.finallyBlock ? this.finallyBlock.getDependency(options) : [],
      );
  }

  toString(options?: toStringOptions) {
    const catchClause = this.catchClause
      ? this.catchClause.toString(options)
      : '';
    const finallyBlock = this.finallyBlock
      ? `finally ${this.finallyBlock.toString(options)}`
      : '';
    return `try ${this.expression.toString(
      options,
    )} ${catchClause} ${finallyBlock}`;
  }
}

export class CatchClause extends ExpressionWithExpression {
  constructor(
    public variableDeclaration: Expression | undefined,
    expression: Block,
  ) {
    super(expression);
  }

  toString(options?: toStringOptions) {
    const variable = this.variableDeclaration
      ? `(${this.variableDeclaration})`
      : '';
    return `catch${variable} ${this.expression.toString(options)}`;
  }
}
