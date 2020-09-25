import {
  ExpressionWithExpression,
  Expression,
  ExpressionWithOptionalExpression,
} from "./base";
import { toStringOptions } from "../types";
import { Block } from "./statements";
import { getConditionalOptions } from "../utils/options";

export class If extends ExpressionWithExpression {
  thenStatement: Expression;
  elseStatement?: Expression;
  constructor(
    expression: Expression,
    thenStatement: Expression,
    elseStatement?: Expression
  ) {
    super(expression);
    this.thenStatement = thenStatement;
    this.elseStatement = elseStatement;
  }

  toString(options?: toStringOptions) {
    const elseStatement = this.elseStatement
      ? `else ${this.elseStatement.toString(options)}`
      : "";
    return `if(${this.expression.toString(
      getConditionalOptions(options)
    )})${this.thenStatement.toString(options)}
        ${elseStatement}`;
  }

  getDependency(options: toStringOptions) {
    return super
      .getDependency(options)
      .concat(this.thenStatement.getDependency(options))
      .concat(
        this.elseStatement ? this.elseStatement.getDependency(options) : []
      );
  }

  isJsx() {
    return this.elseStatement?.isJsx() || this.thenStatement.isJsx();
  }
}

export class Conditional extends If {
  elseStatement: Expression;
  constructor(
    expression: Expression,
    thenStatement: Expression,
    elseStatement: Expression
  ) {
    super(expression, thenStatement);
    this.elseStatement = elseStatement;
  }
  toString(options?: toStringOptions) {
    return `${this.expression.toString(options)}?${this.thenStatement.toString(
      options
    )}:${this.elseStatement!.toString(options)}`;
  }
}

export class CaseClause extends ExpressionWithOptionalExpression {
  statements: Expression[];
  constructor(expression: Expression | undefined, statements: Expression[]) {
    super(expression);
    this.statements = statements;
  }

  toString(options?: toStringOptions) {
    return `case ${super.toString(options)}:
            ${this.statements.map((s) => s.toString(options)).join("\n")}
        `;
  }

  getDependency(options: toStringOptions) {
    return this.statements
      .reduce((d: string[], s) => {
        return d.concat(s.getDependency(options));
      }, [])
      .concat(super.getDependency(options));
  }
}

export class DefaultClause extends CaseClause {
  constructor(statements: Expression[]) {
    super(undefined, statements);
  }

  toString(options?: toStringOptions) {
    return `default:
            ${this.statements.map((s) => s.toString(options)).join("\n")}
        `;
  }
}

export class CaseBlock extends Block {
  constructor(clauses: Array<DefaultClause | CaseClause>) {
    super(clauses, true);
  }
}

export class Switch extends If {
  toString(options?: toStringOptions) {
    return `switch(${this.expression.toString(
      options
    )})${this.thenStatement.toString(options)}`;
  }
}
