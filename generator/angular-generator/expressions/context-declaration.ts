import { Class } from "../../base-generator/expressions/class";
import { Decorator } from "../../base-generator/expressions/decorator";
import { Call, Identifier } from "../../base-generator/expressions/common";
import { Property } from "./class-members/property";
import { VariableStatement } from "../../base-generator/expressions/variables";

export class ContextDeclaration extends VariableStatement {
  toString() {
    const createContextExpression = this.declarationList.declarations[0];
    const initializer = (createContextExpression.initializer as Call)
      .arguments[0];
    const declaration = new Class(
      [new Decorator(new Call(new Identifier("Injectable")), {})],
      this.modifiers,
      createContextExpression.name as Identifier,
      [],
      [],
      [
        new Property(
          [],
          ["public"],
          new Identifier("value"),
          undefined,
          undefined,
          initializer
        ),
      ]
    );
    return declaration.toString();
  }
}
