import { GetAccessor as BaseGetAccessor } from "./get-accessor";
import { Decorator } from "../../../base-generator/expressions/decorator";
import { Identifier } from "../../../base-generator/expressions/common";
import { Parameter } from "../functions/parameter";
import { TypeExpression } from "../../../base-generator/expressions/type";
import { Block } from "../../../base-generator/expressions/statements";
import { Property } from "./property";
import { IPropsGetAccessor } from "../../../angular-generator/types";

export class PropsGetAccessor
  extends BaseGetAccessor
  implements IPropsGetAccessor {
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
