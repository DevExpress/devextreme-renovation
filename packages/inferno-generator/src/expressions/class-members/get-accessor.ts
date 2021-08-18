import { GetAccessor as ReactGetAccessor } from '@devextreme-generator/react';
import {
  toStringOptions, Identifier,
} from '@devextreme-generator/core';

import { compileGetterCache } from '@devextreme-generator/angular';

export class GetAccessor extends ReactGetAccessor {
  getter(componentContext?: string): string {
    return super.getter(componentContext).replace('()', '');
  }

  toString(options?: toStringOptions): string {
    if (options?.isComponent
       && this.body
       && this.isMemorized(options)) {
      const reactAccessor = new ReactGetAccessor(
        this.decorators,
        this.modifiers,
        new Identifier(this.name),
        this.parameters,
        this.type,
        this.body,
      );
      if (reactAccessor?.body) {
        reactAccessor.body.statements = compileGetterCache(
          this._name, this.type, this.body, this.isProvider, false,
        );
        return reactAccessor.toString(options);
      }
    }
    return super.toString(options);
  }
}
