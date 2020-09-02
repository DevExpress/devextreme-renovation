import { PropertyAccess as BasePropertyAccess } from "../../base-generator/expressions/property-access";
import { toStringOptions } from "../types";
import { BindingElement } from "../../base-generator/expressions/binding-pattern";
import { ObjectLiteral } from "../../base-generator/expressions/literal";
import { PropertyAssignment } from "../../base-generator/expressions/property-assignment";
import { Identifier } from "../../base-generator/expressions/common";
import { getProps } from "../../base-generator/expressions/component";
import { Property } from "../../base-generator/expressions/class-members";

export class PropertyAccess extends BasePropertyAccess {
  processProps(
    result: string,
    options: toStringOptions,
    elements: BindingElement[] = []
  ) {
    const props = getProps(options.members).filter(
      (p) =>
        elements.length === 0 ||
        elements.some(
          (e) => (e.propertyName || e.name).toString() === p._name.toString()
        )
    );
    if (props.some((p) => !p.canBeDestructured) || props.length === 0) {
      const expression = new ObjectLiteral(
        props.map(
          (p) =>
            new PropertyAssignment(
              p._name,
              new PropertyAccess(
                new PropertyAccess(
                  new Identifier(this.calculateComponentContext(options)),
                  new Identifier("props")
                ),
                p._name
              )
            )
        ),
        true
      );
      return expression.toString(options);
    }
    return options.newComponentContext!;
  }

  compileStateSetting(
    value: string,
    property: Property,
    options: toStringOptions
  ) {
    if (property.isState) {
      return `this._${this.name}Change(${this.toString(options)}=${value})`;
    }
    if (property.isRef) {
      return `this.${property.name}.nativeElement=${value}`;
    }
    return `this._${property.name}=${value}`;
  }
}
