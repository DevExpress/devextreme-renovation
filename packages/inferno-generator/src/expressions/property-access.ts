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
      const contextlessState = state.replace(new RegExp(`\\bthis.state.${property.name}\\b`, 'g'), `state.${property.name}`);
      return `this.setState((state: any)=>({...state, ${property.name}: ${contextlessState}}))`;
    }
    if (property.isState) {
      const contextlessState = state.replace(new RegExp(`\\bthis.state.${property.name}\\b`, 'g'), `state.${property.name}`);
      return `this.setState((state: any) => {
        return {...state, ${property.name}: ${contextlessState}};
      });
      this.props.${property.name}Change!(${state});`;
    }
    return super.compileStateSetting(state, property, options);
  }
}
