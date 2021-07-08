import { toStringOptions } from '@devextreme-generator/core';
import { PropertyAccess as ReactPropertyAccess } from '@devextreme-generator/react';

import { Property } from './class-members/property';

export class PropertyAccess extends ReactPropertyAccess {
  compileStateSetting(
    state: string,
    property: Property,
    options: toStringOptions,
  ): string {
    if (property.isInternalState) {
      const contextlessState = state.replace(new RegExp(`\\bthis.state.${property.name}\\b`, 'g'), `__state_argument.${property.name}`);
      return `this.setState((__state_argument: any)=>({ ${property.name}: ${contextlessState}}))`;
    }
    if (property.isState) {
      const contextlessState = state.replace(new RegExp(`\\bthis.state.${property.name}\\b`, 'g'), `__state_argument.${property.name}`);
      return `{
        let __newValue;
        this.setState((__state_argument: any) => {
          __newValue = ${contextlessState};
          return {${property.name}: __newValue};
        });
        this.props.${property.name}Change!(__newValue);
      }`;
    }
    return super.compileStateSetting(state, property, options);
  }
}
