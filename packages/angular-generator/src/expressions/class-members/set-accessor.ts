import {
  Decorator,
  Method,
  Identifier,
  SimpleTypeExpression,
  Parameter,
  Block,
} from '@devextreme-generator/core';
import { toStringOptions } from '../../types';

export class SetAccessor extends Method {
  constructor(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    name: Identifier,
    parameters: Parameter[],
    body: Block,
  ) {
    super(
      decorators,
      [...(modifiers || []), 'set'],
      '',
      name,
      '',
      [],
      parameters,
      new SimpleTypeExpression(''),
      body,
    );
  }

  toString(options?: toStringOptions) {
    return `${super.toString(options)}`;
  }

  get canBeDestructured() {
    if (
      this.isEvent
      || this.isNested
      || this.isForwardRefProp
      || this.isRef
      || this.isRefProp
      || this.isForwardRef
    ) {
      return false;
    }
    return super.canBeDestructured;
  }
}
