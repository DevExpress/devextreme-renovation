import { Property as ReactProperty } from "../../../react-generator/expressions/class-members/property";
import { capitalizeFirstLetter } from "../../../base-generator/utils/string";
import { toStringOptions } from "../../../base-generator/types";
import { TypeReferenceNode } from "../type-reference-node";
import { Decorators } from "../../../component_declaration/decorators";

export class Property extends ReactProperty {
  getter(componentContext?: string, keepRef?: boolean) {
    if (this.isInternalState || this.isState) {
      return `${this.processComponentContext(componentContext)}${this.name}`;
    }
    return super.getter(componentContext, keepRef);
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
    if (this.isRef || this.isForwardRef) {
      const type =
        (this.type instanceof TypeReferenceNode &&
          this.type.typeArguments[0]) ||
        "any";
      return `${this.modifiers.join(" ")} ${
        this.name
      } = infernoCreateRef<${type}>()`;
    }

    return super.toString(options);
  }

  getDependency(options: toStringOptions) {
    const componentContext = this.processComponentContext(
      options.componentContext
    );
    if (
      this.decorators.some(
        (d) =>
          d.name === Decorators.OneWay ||
          d.name === Decorators.Event ||
          d.name === Decorators.Template ||
          d.name === Decorators.Slot
      )
    ) {
      return [`${componentContext}props.${this.name}`];
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
            `${componentContext}${scope}${this.name}${
              scope ? this.questionOrExclamationToken : ""
            }.current`,
          ]
        : [];
    } else if (this.isState) {
      return [
        `${componentContext}${this.name}`,
        `${componentContext}props.${this.name}Change`,
      ];
    } else if (this.isInternalState) {
      return [`${componentContext}${this.name}`];
    } else if (this.isProvider || this.isConsumer) {
      return [this.name];
    }
    throw `Can't parse property: ${this._name}`;
  }
}
