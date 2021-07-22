import { GetAccessor as ReactGetAccessor } from '@devextreme-generator/react';
import {
  isComplexType,
  Decorator,
  Identifier,
  Parameter,
  TypeExpression,
  Block,
  Decorators,
} from '@devextreme-generator/core';

import { compileGetterCache } from '@devextreme-generator/angular';

export class GetAccessor extends ReactGetAccessor {
  constructor(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    name: Identifier,
    parameters: Parameter[],
    type?: TypeExpression | string,
    body?: Block,
  ) {
    const isProvider = decorators?.some((d) => d.name === Decorators.Provider);
    if (body && ((type && isComplexType(type)) || isProvider)) {
      body.statements = compileGetterCache(name, type, body, isProvider, false);
    }
    super(decorators, modifiers, name, parameters, type, body);
  }

  isMemorized(): boolean {
    return isComplexType(this.type) || this.isProvider;
  }

  getter(componentContext?: string): string {
    return super.getter(componentContext).replace('()', '');
  }
}
