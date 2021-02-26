import { toStringOptions } from '../types';
import {
  checkDependency,
  Expression,
  CallChain as BaseCallChain,
  Identifier,
} from "@devextreme-generator/core";

export class CallChain extends BaseCallChain {
  toString(options?: toStringOptions): string {
    let expression: Expression = this.expression;

    if (
      expression instanceof Identifier &&
      options?.variables?.[expression.toString()]
    ) {
      expression = options.variables[expression.toString()];
    }
    if (options) {
      const eventMember = checkDependency(
        expression,
        options.members.filter((m) => m.isEvent),
        options
      );
      if (eventMember) {
        return `${expression.toString(options)}(${this.argumentsArray
          .map((a) => a.toString(options))
          .join(",")})`;
      }
    }
    return super.toString(options);
  }
}
