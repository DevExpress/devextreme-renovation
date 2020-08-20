import { Identifier } from "../expressions/common";
import { BindingPattern } from "../expressions/binding-pattern";
import { Expression } from "../expressions/base";
import { TypeExpression } from "../expressions/type";
import { StringLiteral, NumericLiteral } from "../expressions/literal";

export function capitalizeFirstLetter(string: string | Identifier) {
  string = string.toString();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const removePlural = (string: string | Identifier) => {
  string = string.toString();
  let last = string.lastIndexOf("s");
  if (last > 0 && last === string.length - 1) {
    return string.slice(0, last);
  }
  return string;
};

export const calculateType = (initializer?: Expression): string => {
  if (initializer instanceof StringLiteral) {
    return "string";
  }
  if (initializer instanceof NumericLiteral) {
    return "number";
  }
  const initializerString = initializer?.toString();
  if (initializerString === "true" || initializerString === "false") {
    return "boolean";
  }
  return "";
};

export const compileType = (type: string = "", questionToken: string = "") => {
  return type ? `${questionToken}:${type}` : "";
};

export const compileTypeParameters = (
  typeParameters: TypeExpression[] | string[] | undefined
) => (typeParameters?.length ? `<${typeParameters}>` : "");

export const compileArrowTypeParameters = (
  typeParameters: TypeExpression[] | string[] | undefined
) => (typeParameters?.length ? `<${typeParameters} extends unknown>` : "");

export function variableDeclaration(
  name: Identifier | BindingPattern,
  type: string = "",
  initializer?: Expression,
  questionToken: string = "",
  dotDotDotToken: string = ""
): string {
  const initializerDeclaration = initializer ? `=${initializer}` : "";
  return `${dotDotDotToken}${name}${compileType(
    type,
    questionToken
  )}${initializerDeclaration}`;
}

export function processComponentContext(componentContext: string = "") {
  return componentContext.length ? `${componentContext}.` : "";
}
