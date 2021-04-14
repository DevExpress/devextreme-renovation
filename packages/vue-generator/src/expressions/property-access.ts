import { PropertyAccess as BasePropertyAccess } from '@devextreme-generator/angular';
import { BindingElement } from '@devextreme-generator/core';
import { Property } from './class-members/property';
import { toStringOptions } from '../types';

export class PropertyAccess extends BasePropertyAccess {
  processProps(
    result: string,
    _options: toStringOptions,
    _elements: BindingElement[] = [],
  ) {
    return result;
  }

  compileStateSetting(state: string, property: Property) {
    const isState = property.isState;
    const propertyName = isState ? `${property.name}_state` : property.name;
    const stateSetting = `this.${propertyName}=${state}`;
    if (isState) {
      return `${stateSetting},\nthis.${property._name}Change(this.${propertyName})`;
    }
    if (property.isRef) {
      return `this.$refs.${propertyName}=${state}`;
    }
    if (property.isForwardRefProp) {
      return `this.forwardRef_${propertyName}(${state}), this.${propertyName}(${state})`;
    }
    return stateSetting;
  }

  toString(options?: toStringOptions, elements: BindingElement[] = []) {
    const member = this.getMember(options);
    if (member && member.isRefProp && member instanceof Property) {
      return `${member.getter(options!.newComponentContext)}`;
    }
    return super.toString(options, elements);
  }

  getRefAccessor(member: Property) {
    if (member.isRef || member?.isForwardRef || member.isApiRef) {
      return '';
    }
    if (member.isRefProp || member.isForwardRefProp) {
      return '()';
    }
    return null;
  }
}
