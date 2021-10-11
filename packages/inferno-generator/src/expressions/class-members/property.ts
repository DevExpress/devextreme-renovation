import {
  capitalizeFirstLetter,
  compileType,
  Decorators,
  GeneratorContext,
  Identifier,
  toStringOptions,
  TypeExpression,
} from '@devextreme-generator/core';
import { Property as BaseProperty } from '@devextreme-generator/preact';

import { TypeReferenceNode } from '../type-reference-node';

export class Property extends BaseProperty {
  compileTypeReferenceNode(
    typeName: Identifier,
    typeArguments: TypeExpression[],
    context: GeneratorContext,
  ): TypeReferenceNode {
    return new TypeReferenceNode(typeName, typeArguments, context);
  }

  getter(componentContext?: string): string {
    if (
      this.isProvider
      || this.isConsumer
      || this.isMutable
    ) {
      return `${this.processComponentContext(componentContext)}${this.name}`;
    }

    if (this.isInternalState) {
      return `${this.processComponentContext(componentContext)}state.${this.name}`;
    }

    if (this.isState) {
      const propState = `${this.processComponentContext(componentContext)}props.${this.name}`;
      const innerState = `${this.processComponentContext(componentContext)}state.${this.name}`;
      return `(${propState} !== undefined ? ${propState} : ${innerState})`;
    }

    return super.getter(componentContext);
  }

  defaultDeclaration(options?: toStringOptions): string {
    if (this.isState) {
      return `${this.name}: this.props.${this.name}!==undefined?this.props.${
        this.name
      }: this.props.default${capitalizeFirstLetter(this.name)}`;
    }
    return super.defaultDeclaration(options);
  }

  inherit(): Property {
    return new Property(
      this.decorators,
      this.modifiers,
      this._name,
      this.questionOrExclamationToken,
      this.type,
      this.initializer,
      true,
    );
  }

  toString(options?: toStringOptions): string {
    if (this.isRef || this.isForwardRef || this.isApiRef) {
      const type = (this.type instanceof TypeReferenceNode
          && this.type.typeArguments[0])
        || 'any';
      const refType = this.isApiRef ? 'any' : type;
      return `${this.modifiers.join(' ')} ${
        this.name
      }:RefObject<${refType}> = infernoCreateRef<${type}>()`;
    }

    if (this.isMutable) {
      const initializer = this.initializer && this.initializer.toString()
        ? `= ${this.initializer.toString()}`
        : '';

      return `${this.modifiers.join(' ')} ${this.name}${
        this.questionOrExclamationToken
      }${compileType(this.type.toString())} ${initializer}`;
    }

    if (this.isProvider) {
      const initializer = this.initializer && this.initializer.toString()
        ? `= ${this.initializer.toString()}`
        : '';

      return `${this.modifiers.join(' ')} ${this.typeDeclaration()} ${initializer}`;
    }

    if (this.isConsumer) {
      return `${this.modifiers.join(' ')} get ${this.name}()${compileType(
        this.type.toString(),
      )}{
        if("${this.context}" in this.context){
          return this.context.${this.context};
        }
        return ${this.context};
      }`;
    }

    return super.toString(options);
  }

  getDependencyString(): string[] {
    if (
      this.decorators.some(
        (d) => d.name === Decorators.OneWay
          || d.name === Decorators.Event
          || d.name === Decorators.Template
          || d.name === Decorators.Slot,
      )
    ) {
      return [`props.${this.name}`];
    }
    if (
      this.decorators.some(
        (d) => d.name === Decorators.Ref
          || d.name === Decorators.ForwardRef
          || d.name === Decorators.ApiRef
          || d.name === Decorators.RefProp
          || d.name === Decorators.ForwardRefProp,
      )
    ) {
      const scope = this.processComponentContext(this.scope);
      return this.questionOrExclamationToken === '?'
        ? [
          `${scope}${this.name}${
            scope ? this.questionOrExclamationToken : ''
          }.current`,
        ]
        : [];
    }
    if (this.isState) {
      return [`state.${this.name}`, `props.${this.name}`];
    }
    if (this.isInternalState) {
      return [`state.${this.name}`];
    }
    if (this.isProvider || this.isConsumer || this.isMutable) {
      return [`${this.name}`];
    }
    throw `Can't parse property: ${this._name}`;
  }

  instanceDeclaration(): string {
    return `${this.name}${compileType(
      this.type.toString(),
      this.questionOrExclamationToken.length ? this.questionOrExclamationToken : '!',
    )}`;
  }
}
