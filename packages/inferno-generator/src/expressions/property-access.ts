import {
  BindingElement, capitalizeFirstLetter, lowerizeFirstLetter, toStringOptions,
} from '@devextreme-generator/core';
import { PropertyAccess as ReactPropertyAccess } from '@devextreme-generator/react';

import { Property } from './class-members/property';

const dottedPropWayToCapitalized = (prop: string): string => prop.split('.')
  .map(capitalizeFirstLetter)
  .join('');

const combineNestedPropsWithState = (state: string, propName: string, statePrefix: string) => {
  const nestedPropAccess = `this.props.${propName}`;
  const subFieldsAccess = '(\\.[a-zA-Z]+)+';

  const nestedPropsRegExp = new RegExp(`\\b${nestedPropAccess}${subFieldsAccess}\\b`, 'g');
  const nestedProps = state.match(nestedPropsRegExp);

  if (nestedProps?.length) {
    const nestedStateAccess = `${statePrefix}.${propName}`;
    let processedState = state;

    nestedProps.forEach((nestedProp) => {
      const propWay = nestedProp.replace(nestedPropAccess, '');
      const estimatedStateName = dottedPropWayToCapitalized(propWay);

      const nestedState = `${nestedStateAccess}${estimatedStateName}`;
      const processedNestedGetter = `(${nestedProp} !== undefined ? ${nestedProp} : ${nestedState})`;

      processedState = processedState.replace(new RegExp(`\\b${nestedProp}\\b`, 'g'), processedNestedGetter);
    });

    return processedState;
  }

  return state;
};

export class PropertyAccess extends ReactPropertyAccess {
  compileNestedSetting(
    state: string,
    property: Property,
    options: toStringOptions,
  ): string {
    const stateName = lowerizeFirstLetter(
      this.expression.toString()
        .replace('this.props.', '')
        .split('.')
        .concat(this.name.toString())
        .map(capitalizeFirstLetter)
        .join(''),
    );
    const processedState = combineNestedPropsWithState(state, property.name, '__state');
    const setState = `this.setState((__state) => {
      __newValue = ${processedState};
      return {${stateName}: __newValue};
    })`;

    const eventName = `${this.name}Change`;
    const eventCall = `${this.expression.toString(options)}.${eventName}?.(__newValue)`;

    return `{
      let __newValue;
      ${setState};
      ${eventCall};
    }`;
  }

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
      return `{
        let __newValue;
        this.setState((state: any) => {
          __newValue = ${contextlessState};
          return {${property.name}: __newValue};
        });
        this.props.${property.name}Change!(__newValue);
      }`;
    }
    return super.compileStateSetting(state, property, options);
  }

  toString(options?: toStringOptions, elements?: BindingElement[]): string {
    if (this.expression instanceof ReactPropertyAccess) {
      const member = this.expression.getMember(options);
      if (member?.isNested) {
        const internalStates = options?.members.filter(({ isInternalState }) => isInternalState);
        const estimatedStateName = `${this.expression.name}${dottedPropWayToCapitalized(this.name.toString())}`;
        if (internalStates?.some(({ name }) => name === estimatedStateName)) {
          const result = super.toString(options, elements);
          return combineNestedPropsWithState(result, member.name, 'this.state');
        }
      }
    }
    return super.toString(options, elements);
  }
}
