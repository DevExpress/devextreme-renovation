import { GetAccessor } from './get-accessor';
import { Property } from './property';
import { IPropsGetAccessor } from '../../types';
import { Decorator } from '../decorator';
import {
  Block,
  Identifier,
  Parameter,
  TypeExpression
  } from '@devextreme-generator/core';

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
