import {
  capitalizeFirstLetter,
  compileType,
  GeneratorContext,
  Identifier,
  toStringOptions,
  TypeExpression
} from '@devextreme-generator/core';
import { Decorators } from '@devextreme-generator/declaration';
import { Property as BaseProperty } from '@devextreme-generator/preact';

import { TypeReferenceNode } from '../type-reference-node';

export class Property extends BaseProperty {
  compileTypeReferenceNode(
    typeName: Identifier,
    typeArguments: TypeExpression[],
    context: GeneratorContext
  ) {
    return new TypeReferenceNode(typeName, typeArguments, context);
  }

  getter(componentContext?: string) {
    if (
      this.isInternalState ||
      this.isProvider ||
      this.isConsumer ||
      this.isMutable
    ) {
      return `${this.processComponentContext(componentContext)}${this.name}`;
    }

    if (this.isState) {
      return `${this.processComponentContext(componentContext)}__state_${
        this.name
      }`;
    }

    return super.getter(componentContext);
  }

  defaultDeclaration() {
    if (this.isState) {
      return `${this.name}: this.props.${this.name}!==undefined?this.props.${
        this.name
      }: this.props.default${capitalizeFirstLetter(this.name)}`;
    }
    return super.defaultDeclaration();
  }

  inherit() {
    return new Property(
      this.decorators,
      this.modifiers,
      this._name,
      this.questionOrExclamationToken,
      this.type,
      this.initializer,
      true
    );
  }

  toString(options?: toStringOptions) {
    if (this.isRef || this.isForwardRef || this.isApiRef) {
      const type =
        (this.type instanceof TypeReferenceNode &&
          this.type.typeArguments[0]) ||
        "any";
      const refType = this.isApiRef ? "any" : type;
      return `${this.modifiers.join(" ")} ${
        this.name
      }:RefObject<${refType}> = infernoCreateRef<${type}>()`;
    }

    if (this.isMutable) {
      return `${this.modifiers.join(" ")} ${this.name}${
        this.questionOrExclamationToken
      }${compileType(this.type.toString())} ${
        this.initializer && this.initializer.toString()
          ? `= ${this.initializer.toString()}`
          : ""
      }`;
    }

    if (this.isProvider) {
      return `${this.modifiers.join(" ")} ${this.typeDeclaration()} ${
        this.initializer && this.initializer.toString()
          ? `= ${this.initializer.toString()}`
          : ""
      }`;
    }

    if (this.isConsumer) {
      return `${this.modifiers.join(" ")} get ${this.name}()${compileType(
        this.type.toString()
      )}{
        if("${this.context}" in this.context){
          return this.context.${this.context};
        }
        return ${this.context};
      }`;
    }

    return super.toString(options);
  }

  getDependency() {
    if (
      this.decorators.some(
        (d) =>
          d.name === Decorators.OneWay ||
          d.name === Decorators.Event ||
          d.name === Decorators.Template ||
          d.name === Decorators.Slot
      )
    ) {
      return [`props.${this.name}`];
    } else if (
      this.decorators.some(
        (d) =>
          d.name === Decorators.Ref ||
          d.name === Decorators.ForwardRef ||
          d.name === Decorators.ApiRef ||
          d.name === Decorators.RefProp ||
          d.name === Decorators.ForwardRefProp
      )
    ) {
      const scope = this.processComponentContext(this.scope);
      return this.questionOrExclamationToken === "?"
        ? [
            `${scope}${this.name}${
              scope ? this.questionOrExclamationToken : ""
            }.current`,
          ]
        : [];
    } else if (this.isState) {
      return [`__state_${this.name}`, `props.${this.name}Change`];
    } else if (this.isInternalState || this.isProvider || this.isConsumer) {
      return [`${this.name}`];
    } else if (this.isMutable) {
      return [];
    }
    throw `Can't parse property: ${this._name}`;
  }
}
