import { Identifier } from "../expressions/common";
import { BindingPattern } from "../expressions/binding-pattern";
import { Expression } from "../expressions/base";

export function capitalizeFirstLetter(string: string | Identifier) {
    string = string.toString();
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export const compileType = (type: string = "", questionToken: string = "") =>
    type ? `${questionToken}:${type}` : "";

export function variableDeclaration(name: Identifier | BindingPattern, type: string = "", initializer?: Expression, questionToken: string = ""): string {
    const initializerDeclaration = initializer ? `=${initializer}` : "";
    return `${name}${compileType(type, questionToken)}${initializerDeclaration}`;
}

export function processComponentContext(componentContext: string = "") { 
    return componentContext.length ? `${componentContext}.` : "";
}
