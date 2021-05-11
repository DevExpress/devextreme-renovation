import { toStringOptions } from '@devextreme-generator/core';
import { PropertyAccess as ReactPropertyAccess } from '@devextreme-generator/react';

import { Property } from './class-members/property';

export class PropertyAccess extends ReactPropertyAccess {
  compileStateSetting(
    state: string,
    property: Property,
    options: toStringOptions,
  ) {
    debugger;
    if (property.isInternalState || property.isState) {
      return `this.set_${property.name}((${property.name}: ${property.type})=>(${state}))`;
    }
    return super.compileStateSetting(state, property, options);
  }
}
