import { Property as ReactProperty } from "../../../react-generator/expressions/class-members/property";

export class Property extends ReactProperty {
  getter(componentContext?: string, keepRef: boolean = false) {
    if (this.isInternalState) {
      return `${this.processComponentContext(componentContext)}${this.name}`;
    }
    return super.getter(componentContext, keepRef);
  }
}
