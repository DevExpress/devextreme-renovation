import { PropertyAccess as ReactPropertyAccess } from "../../react-generator/expressions/property-access";
import { Property } from "./class-members/property";
import { toStringOptions } from "../../base-generator/types";

export class PropertyAccess extends ReactPropertyAccess {
  compileStateSetting(
    state: string,
    property: Property,
    options: toStringOptions
  ) {
    if (property.isInternalState) {
      return `this.${property.name}=${state}`;
    }
    return "TODO";
  }
}
