import { Expression, ExpressionWithExpression } from "./base";
import { toStringOptions } from "../types";

export class Try extends ExpressionWithExpression {
  catchClause?: Expression;
  finallyBlock?: Expression;

  constructor(
    tryBlock: Expression,
    catchClause?: Expression,
    finallyBlock?: Expression
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
  variableDeclaration?: Expression;

  constructor(
    variableDeclaration: Expression | undefined,
    expression: Expression
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
