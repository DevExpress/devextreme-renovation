import { Decorator } from "../../../base-generator/expressions/decorator";
import { Method } from "../../../base-generator/expressions/class-members";
import { Identifier } from "../../../base-generator/expressions/common";
import { SimpleTypeExpression } from "../../../base-generator/expressions/type";
import { toStringOptions } from "../../types";
import { Parameter } from "../../../base-generator/expressions/functions";
import { Block } from "../../../base-generator/expressions/statements";

export class SetAccessor extends Method {
  constructor(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    name: Identifier,
    parameters: Parameter[],
    body: Block
  ) {
    super(
      decorators,
      [...(modifiers || []), "set"],
      "",
      name,
      "",
      [],
      parameters,
      new SimpleTypeExpression(""),
      body
    );
  }
  toString(options?: toStringOptions) {
    return `${super.toString(options)}`;
  }
}
