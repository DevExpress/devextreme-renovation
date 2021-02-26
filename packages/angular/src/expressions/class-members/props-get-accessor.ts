import { GetAccessor } from "./get-accessor";
import { Decorator } from "../decorator";
import { Identifier } from "../../../base-generator/expressions/common";
import { Parameter } from "../../../base-generator/expressions/functions";
import { TypeExpression } from "../../../base-generator/expressions/type";
import { Block } from "../../../base-generator/expressions/statements";
import { Property } from "./property";
import { IPropsGetAccessor } from "../../types";

export class PropsGetAccessor extends GetAccessor implements IPropsGetAccessor {
  constructor(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    name: Identifier,
    parameters: Parameter[],
    type: TypeExpression | string | undefined,
    body: Block | undefined,
    public props: Property[]
  ) {
    super(decorators, modifiers, name, parameters, type, body);
  }
}
