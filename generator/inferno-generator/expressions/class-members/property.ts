import { Property as ReactProperty } from "../../../react-generator/expressions/class-members/property";
import { capitalizeFirstLetter } from "../../../base-generator/utils/string";

export class Property extends ReactProperty {
  getter(componentContext?: string, keepRef: boolean = false) {
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
}
