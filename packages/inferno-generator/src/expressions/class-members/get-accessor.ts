import { GetAccessor as ReactGetAccessor } from '@devextreme-generator/react';
import {
  isComplexType,
  toStringOptions,
} from '@devextreme-generator/core';

import { compileGetterCache } from '@devextreme-generator/angular';

export class GetAccessor extends ReactGetAccessor {
  isMemorized(): boolean {
    return isComplexType(this.type) || this.isProvider;
  }

  getter(componentContext?: string): string {
    return super.getter(componentContext).replace('()', '');
  }

  toString(options?: toStringOptions): string {
    if (options && this.body && ((this.type && isComplexType(this.type)) || this.isProvider)) {
      this.body.statements = compileGetterCache(
        this._name, this.type, this.body, this.isProvider, false,
      );
    }
    return super.toString(options);
  }
}
