import { GetAccessor as ReactGetAccessor } from '@devextreme-generator/react';
import {
  toStringOptions,
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
      this.body.statements = compileGetterCache(
        this._name, this.type, this.body, this.isProvider, false,
      );
    }
    return super.toString(options);
  }
}
