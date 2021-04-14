import {
  Class,
  Decorator,
  Call,
  Identifier,
  VariableStatement,
  SimpleTypeExpression,
  SimpleExpression,
  Block,
  Parameter,
} from '@devextreme-generator/core';
import { Property } from './class-members/property';
import { SetAccessor } from './class-members/set-accessor';
import { GetAccessor } from './class-members/get-accessor';

export class ContextDeclaration extends VariableStatement {
  toString() {
    const createContextExpression = this.declarationList.declarations[0];
    const initializer = (createContextExpression.initializer as Call)
      .arguments[0];
    const valueProperty = new Property(
      [],
      [],
      new Identifier('_value'),
      undefined,
      undefined,
      initializer,
    );

    const declaration = new Class(
      [new Decorator(new Call(new Identifier('Injectable')), {})],
      this.modifiers,
      createContextExpression.name as Identifier,
      [],
      [],
      [
        valueProperty,
        new Property(
          [],
          [],
          new Identifier('change'),
          undefined,
          new SimpleTypeExpression(`ContextEmitter<${valueProperty.type}>`),
          new SimpleExpression('new ContextEmitter()'),
        ),

        new GetAccessor(
          [],
          [],
          new Identifier('value'),
          [],
          valueProperty.type,
          new Block([new SimpleExpression('return this._value')], false),
        ),

        new SetAccessor(
          [],
          [],
          new Identifier('value'),
          [
            new Parameter(
              [],
              [],
              undefined,
              new Identifier('value'),
              undefined,
              valueProperty.type,
            ),
          ],
          new Block(
            [
              new SimpleExpression(
                `if(this._value!==value) {
                  this._value = value;
                  this.change.emit(value);
                }`,
              ),
            ],
            false,
          ),
        ),
      ],
      {},
    );
    return declaration.toString();
  }
}
