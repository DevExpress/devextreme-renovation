import { PropertyAccess as ReactPropertyAccess } from "../../react-generator/expressions/property-access";
import { Property } from "./class-members/property";
import { toStringOptions } from "../../base-generator/types";

export class PropertyAccess extends ReactPropertyAccess {
  compileStateSetting(
    state: string,
    property: Property,
    options: toStringOptions
  ) {
    if (property.isInternalState || property.isState) {
      return `this.set_${property.name}(()=>${state})`;
    }
    return super.compileStateSetting(state, property, options);
  }
}
