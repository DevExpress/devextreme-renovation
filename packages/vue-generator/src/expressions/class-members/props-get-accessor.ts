import { IPropsGetAccessor } from '@devextreme-generator/angular';
import {
  Identifier,
  Decorator,
  Block,
  TypeExpression,
} from '@devextreme-generator/core';
import { GetAccessor as BaseGetAccessor } from './get-accessor';
import { Property } from './property';
import { Parameter } from '../functions/parameter';

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
    public props: Property[],
  ) {
    super(decorators, modifiers, name, parameters, type, body);
  }
}
