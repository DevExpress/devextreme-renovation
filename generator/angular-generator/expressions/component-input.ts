import { ComponentInput as BaseComponentInput } from "../../base-generator/expressions/component-input";
import { Call, Identifier } from "../../base-generator/expressions/common";
import { Method } from "../../base-generator/expressions/class-members";
import { TypeExpression } from "../../base-generator/expressions/type";
import { Decorator } from "./decorator";
import { AngularGeneratorContext } from "../types";
import { Property } from "./class-members/property";
import { HeritageClause } from "../../base-generator/expressions/class";
import { Expression } from "../../base-generator/expressions/base";
import { compileCoreImports } from "./component";

export class ComponentInput extends BaseComponentInput {
  context: AngularGeneratorContext;
  constructor(
    decorators: Decorator[],
    modifiers: string[] = [],
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
    context: AngularGeneratorContext
  ) {
    super(
      decorators,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members
    );
    this.context = context;
  }

  createProperty(
    decorators: Decorator[],
    modifiers: string[] | undefined,
    name: Identifier,
    questionOrExclamationToken?: string,
    type?: TypeExpression | string,
    initializer?: Expression
  ) {
    return new Property(
      decorators,
      modifiers,
      name,
      questionOrExclamationToken,
      type,
      initializer
    );
  }

  createDecorator(expression: Call, context: AngularGeneratorContext) {
    return new Decorator(expression, context);
  }

  buildDefaultStateProperty() {
    return null;
  }

  getInitializerScope(name: string): string {
    return `${name}.prototype`;
  }

  toString() {
    return `
        ${compileCoreImports(
          this.members.filter((m) => !m.inherited),
          this.context
        )}
        ${this.modifiers.join(" ")} class ${
      this.name
    } ${this.heritageClauses.map((h) => h.toString()).join(" ")} {
            ${this.members
              .filter((p) => p instanceof Property && !p.inherited)
              .map((m) => m.toString())
              .filter((m) => m)
              .concat("")
              .join(";\n")}
        }`;
  }
}
