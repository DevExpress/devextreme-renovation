import { toStringOptions } from "../types";
import { PropertyAccess as BasePropertyAccess } from "../../base-generator/expressions/property-access";
import { Property } from "./class-members/property";

export class PropertyAccess extends BasePropertyAccess {
  compileStateSetting(
    state: string,
    property: Property,
    options?: toStringOptions
  ) {
    const isState = property.isState;
    const propertyName = isState ? `${property.name}_state` : property.name;
    const stateSetting = `this.${propertyName}=${state}`;
    if (isState) {
      return `${stateSetting},\nthis.${property._name}Change(this.${propertyName})`;
    }
    return stateSetting;
  }
}
