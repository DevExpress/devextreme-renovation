import { Expression } from "../expressions/base";
import { toStringOptions } from "../types";
import {
  Identifier,
  Paren,
  AsExpression,
} from "../expressions/common";
import { JsxExpression } from "../expressions/jsx";
import { PropertyAccess } from "../expressions/property-access";
import { Property, Method } from "../expressions/class-members";

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
