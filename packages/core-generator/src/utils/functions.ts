import { Expression } from "../expressions/base";
import { Paren } from "../expressions/common";
import { Conditional } from "../expressions/conditions";
import {
  JsxExpression,
  JsxElement,
  JsxOpeningElement,
} from "../expressions/jsx";
import { Binary } from "../expressions/operators";

export function containsPortalsInStatements(statement: Expression): boolean {
  if (statement instanceof JsxElement) {
    const children = statement.children.filter(
      (c) => typeof c !== "string"
    ) as Expression[];
    return (
      statement.isPortal() ||
      children.some((c) => containsPortalsInStatements(c))
    );
  }
  if (statement instanceof Paren) {
    return containsPortalsInStatements(statement.expression);
  }
  if (statement instanceof JsxExpression) {
    if (statement.expression instanceof Binary) {
      return containsPortalsInStatements(statement.expression.right);
    }
    return statement.expression
      ? containsPortalsInStatements(statement.expression)
      : false;
  }
  if (statement instanceof Conditional) {
    return (
      containsPortalsInStatements(statement.elseStatement) ||
      containsPortalsInStatements(statement.thenStatement)
    );
  }
  return false;
}

export const containsStyleInStatements = (statement: Expression): boolean => {
  if (statement instanceof JsxElement) {
    const children = statement.children.filter(
      (c) => typeof c !== "string"
    ) as Expression[];
    return (
      statement.hasStyle() || children.some((c) => containsStyleInStatements(c))
    );
  }
  if (statement instanceof JsxOpeningElement) {
    return statement.hasStyle();
  }
  if (statement instanceof Paren) {
    return containsStyleInStatements(statement.expression);
  }
  if (statement instanceof JsxExpression) {
    if (statement.expression instanceof Binary) {
      return containsStyleInStatements(statement.expression.right);
    }
    return statement.expression
      ? containsStyleInStatements(statement.expression)
      : false;
  }
  if (statement instanceof Conditional) {
    return (
      containsStyleInStatements(statement.elseStatement) ||
      containsStyleInStatements(statement.thenStatement)
    );
  }
  return false;
};
