import { Paren } from "../expressions/common";
import {
  JsxExpression,
  JsxElement,
  JsxOpeningElement,
} from "../expressions/jsx";
import { Binary } from "../expressions/operators";

export function containsPortalsInStatements(
  statement: Paren | JsxExpression | JsxElement
): boolean {
  if (statement instanceof JsxElement) {
    const children = statement.children.filter(
      (c) => typeof c !== "string"
    ) as (Paren | JsxExpression | JsxElement)[];
    return (
      statement.isPortal() ||
      children.some((c) => containsPortalsInStatements(c))
    );
  }
  if (statement instanceof Paren) {
    return containsPortalsInStatements(
      statement.expression as Paren | JsxExpression | JsxElement
    );
  }
  if (statement instanceof JsxExpression) {
    if (statement.expression instanceof Binary) {
      return containsPortalsInStatements(
        statement.expression.right as Paren | JsxExpression | JsxElement
      );
    }
    return containsPortalsInStatements(
      statement.expression as Paren | JsxExpression | JsxElement
    );
  }
  return false;
}

export const containsStyleInStatements = (
  statement: Paren | JsxExpression | JsxElement
): boolean => {
  if (statement instanceof JsxElement) {
    const children = statement.children.filter(
      (c) => typeof c !== "string"
    ) as (Paren | JsxExpression | JsxElement)[];
    return (
      statement.hasStyle() || children.some((c) => containsStyleInStatements(c))
    );
  }
  if (statement instanceof JsxOpeningElement) {
    return statement.hasStyle();
  }
  if (statement instanceof Paren) {
    return containsStyleInStatements(
      statement.expression as Paren | JsxExpression | JsxElement
    );
  }
  if (statement instanceof JsxExpression) {
    if (statement.expression instanceof Binary) {
      return containsStyleInStatements(
        statement.expression.right as Paren | JsxExpression | JsxElement
      );
    }
    return containsStyleInStatements(
      statement.expression as Paren | JsxExpression | JsxElement
    );
  }
  return false;
};
