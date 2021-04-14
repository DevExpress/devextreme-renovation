import { toStringOptions } from '@devextreme-generator/core';
import { PropertyAccess as ReactPropertyAccess } from '@devextreme-generator/react';

import { Property } from './class-members/property';

export class PropertyAccess extends ReactPropertyAccess {
  compileStateSetting(
    state: string,
    property: Property,
    options: toStringOptions,
  ) {
    if (property.isInternalState || property.isState) {
      return `this.set_${property.name}(()=>(${state}))`;
    }
    return super.compileStateSetting(state, property, options);
  }
}
