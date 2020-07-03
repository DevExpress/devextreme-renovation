import { Expression, ExpressionWithOptionalExpression } from "./base";
import { toStringOptions } from "../types";

export class Block extends Expression {
  statements: Expression[];
  multiLine: boolean;
  constructor(statements: Expression[], multiLine: boolean) {
    super();
    this.statements = statements;
    this.multiLine = multiLine;
  }

  toString(options?: toStringOptions) {
    return `{
            ${this.statements
              .map((s, i, arr) => {
                const main = s.toString(options);
                const tail =
                  arr[i + 1] &&
                  !main.trim().endsWith("}") &&
                  arr[i + 1].toString(options).trim().startsWith("(")
                    ? ";"
                    : "";
                return `${main}${tail}`;
              })
              .join("\n")}
        }`;
  }

  getDependency() {
    return this.statements.reduce((d: string[], s) => {
      return d.concat(s.getDependency());
    }, []);
  }

  isJsx() {
    return this.statements.some((s) => s.isJsx());
  }
}

export class ReturnStatement extends ExpressionWithOptionalExpression {
  toString(options?: toStringOptions) {
    return `return ${super.toString(options)};`;
  }
}
