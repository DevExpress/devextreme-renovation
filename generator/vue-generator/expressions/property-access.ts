import { PropertyAccess as BasePropertyAccess } from "../../base-generator/expressions/property-access";
import { Property } from "./class-members/property";
import { BindingElement } from "../../base-generator/expressions/binding-pattern";
import { toStringOptions } from "../types";

export class PropertyAccess extends BasePropertyAccess {
  compileStateSetting(state: string, property: Property) {
    const isState = property.isState;
    const propertyName = isState ? `${property.name}_state` : property.name;
    const stateSetting = `this.${propertyName}=${state}`;
    if (isState) {
      return `${stateSetting},\nthis.${property._name}Change(this.${propertyName})`;
    }
    if (property.isRef || property.isForwardRef) {
      return `this.$refs.${propertyName}=${state}`;
    }
    if (property.isForwardRefProp) {
      return `this.forwardRef_${propertyName}(${state}), this.${propertyName}(${state})`;
    }
    if (property.isRefProp) {
      return `this.props.${propertyName}=${state}`;
    }
    return stateSetting;
  }

  toString(options?: toStringOptions, elements: BindingElement[] = []) {
    const member = this.getMember(options);
    if (member && member.isRefProp && member instanceof Property) {
      return `${member.getter(options!.newComponentContext, options?.keepRef)}`;
    }
    return super.toString(options, elements);
  }
}
