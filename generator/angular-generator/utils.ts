import { Expression } from "../base-generator/expressions/base";
import { toStringOptions } from "./types";
import {
  Identifier,
  Paren,
  AsExpression,
} from "../base-generator/expressions/common";
import { JsxExpression } from "../base-generator/expressions/jsx";
import { PropertyAccess } from "../base-generator/expressions/property-access";
import { Property, Method } from "../base-generator/expressions/class-members";

export const counter = (function () {
  let i = 0;

  return {
    get() {
      return i++;
    },

    reset() {
      i = 0;
    },
  };
})();

export function getExpression(
  expression: Expression,
  options?: toStringOptions
): Expression {
  if (expression instanceof Identifier) {
    while (options?.variables?.[expression.toString()]) {
      expression = options.variables[expression.toString()];
    }
  }

  if (expression instanceof Paren || expression instanceof AsExpression) {
    return getExpression(expression.expression, options);
  } else if (expression instanceof JsxExpression && expression.expression) {
    return getExpression(expression.expression, options);
  }

  return expression;
}

export function getMember(
  expression: Expression,
  options?: toStringOptions
): Property | Method | undefined {
  expression = getExpression(expression, options);

  if (expression instanceof PropertyAccess) {
    return expression.getMember(options);
  }
}
