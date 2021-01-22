import { Expression } from "./base";
import { Decorator } from "./decorator";
import { Identifier } from "./common";
import { HeritageClause } from "./class";
import { PropertySignature, MethodSignature, TypeExpression } from "./type";
import { compileTypeParameters } from "../utils/string";

export class Interface extends Expression {
  constructor(
    public decorators: Decorator[] = [],
    public modifiers: string[] = [],
    public name: Identifier,
    public typeParameters: TypeExpression[] | string[] | undefined,
    public heritageClauses: HeritageClause[] = [],
    public members: Array<PropertySignature | MethodSignature>
  ) {
    super();
  }
  toString() {
    return `
            ${this.decorators.join("\n")}
            ${this.modifiers.join(" ")} interface ${
      this.name
    }${compileTypeParameters(this.typeParameters)} ${this.heritageClauses.join(
      " "
    )} {
                ${this.members.join(";\n")}
            }`;
  }
}
