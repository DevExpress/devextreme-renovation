import { Expression, ExpressionWithExpression } from "./base";
import { Block } from "./statements";
import { toStringOptions } from "../types";

export class Try extends ExpressionWithExpression {
  constructor(
    tryBlock: Block,
    public catchClause?: CatchClause,
    public finallyBlock?: Block
  ) {
    super(tryBlock);
    this.catchClause = catchClause;
    this.finallyBlock = finallyBlock;
  }

  toString(options?: toStringOptions) {
    const catchClause = this.catchClause
      ? this.catchClause.toString(options)
      : "";
    const finallyBlock = this.finallyBlock
      ? `finally ${this.finallyBlock.toString(options)}`
      : "";
    return `try ${this.expression.toString(
      options
    )} ${catchClause} ${finallyBlock}`;
  }
}

export class CatchClause extends ExpressionWithExpression {
  constructor(
    public variableDeclaration: Expression | undefined,
    expression: Block
  ) {
    super(expression);
    this.variableDeclaration = variableDeclaration;
  }

  toString(options?: toStringOptions) {
    const variable = this.variableDeclaration
      ? `(${this.variableDeclaration.toString(options)})`
      : "";
    return `catch${variable} ${this.expression.toString(options)}`;
  }
}
