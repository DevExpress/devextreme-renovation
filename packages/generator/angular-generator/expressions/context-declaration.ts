import { Class } from "../../base-generator/expressions/class";
import { Decorator } from "../../base-generator/expressions/decorator";
import { Call, Identifier } from "../../base-generator/expressions/common";
import { Property } from "./class-members/property";
import { VariableStatement } from "../../base-generator/expressions/variables";
import { SimpleTypeExpression } from "../../base-generator/expressions/type";
import { SimpleExpression } from "../../base-generator/expressions/base";
import { GetAccessor } from "./class-members/get-accessor";
import { Block } from "../../base-generator/expressions/statements";
import { SetAccessor } from "./class-members/set-accessor";
import { Parameter } from "../../base-generator/expressions/functions";

export class ContextDeclaration extends VariableStatement {
  toString() {
    const createContextExpression = this.declarationList.declarations[0];
    const initializer = (createContextExpression.initializer as Call)
      .arguments[0];
    const valueProperty = new Property(
      [],
      [],
      new Identifier("_value"),
      undefined,
      undefined,
      initializer
    );

    const declaration = new Class(
      [new Decorator(new Call(new Identifier("Injectable")), {})],
      this.modifiers,
      createContextExpression.name as Identifier,
      [],
      [],
      [
        valueProperty,
        new Property(
          [],
          [],
          new Identifier("change"),
          undefined,
          new SimpleTypeExpression(`ContextEmitter<${valueProperty.type}>`),
          new SimpleExpression("new ContextEmitter()")
        ),

        new GetAccessor(
          [],
          [],
          new Identifier("value"),
          [],
          valueProperty.type,
          new Block([new SimpleExpression("return this._value")], false)
        ),

        new SetAccessor(
          [],
          [],
          new Identifier("value"),
          [
            new Parameter(
              [],
              [],
              undefined,
              new Identifier("value"),
              undefined,
              valueProperty.type
            ),
          ],
          new Block(
            [
              new SimpleExpression(
                `if(this._value!==value) {
                  this._value = value;
                  this.change.emit(value);
                }`
              ),
            ],
            false
          )
        ),
      ],
      {}
    );
    return declaration.toString();
  }
}
