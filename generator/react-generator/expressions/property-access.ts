import { PropertyAccess as BasePropertyAccess } from "../../base-generator/expressions/property-access";
import {
  Property,
  getLocalStateName,
  stateSetter,
} from "./class-members/property";
import { Property as BaseProperty } from "../../base-generator/expressions/class-members";
import { toStringOptions } from "../../base-generator/types";
import { Identifier } from "../../base-generator/expressions/common";
import { ObjectLiteral } from "../../base-generator/expressions/literal";
import {
  PropertyAssignment,
  SpreadAssignment,
} from "../../base-generator/expressions/property-assignment";
import SyntaxKind from "../../base-generator/syntaxKind";
import { BindingElement } from "../../base-generator/expressions/binding-pattern";
import { getProps } from "../../base-generator/expressions/component";

export function getChangeEventToken(property: Property): string {
  if (property.questionOrExclamationToken === SyntaxKind.QuestionToken) {
    if (property.initializer) {
      return SyntaxKind.ExclamationToken;
    } else {
      return SyntaxKind.QuestionDotToken;
    }
  }
  return "";
}

export class PropertyAccess extends BasePropertyAccess {
  compileStateSetting(
    state: string,
    property: Property,
    options: toStringOptions
  ) {
    const setState = `${stateSetter(this.name)}(${getLocalStateName(
      this.name
    )} => ${state.startsWith("{") ? `(${state})` : state})`;
    if (property.isState) {
      const propertyName = `${this.name}Change`;
      const props = getProps(options.members);
      const changeProperty = props.find(
        (m) => m.name === propertyName
      ) as Property;
      return `(${setState}, props.${this.name}Change${getChangeEventToken(
        changeProperty
      )}(${state}))`;
    }
    if (
      property.isRef ||
      property.isRefProp ||
      property.isForwardRef ||
      property.isForwardRefProp
    ) {
      const scope = property.processComponentContext(property.scope);
      return `${scope}${this.name}${
        scope ? property.questionOrExclamationToken : ""
      }.current=${state}`;
    }
    return setState;
  }

  getAssignmentDependency(options?: toStringOptions) {
    return [`${this.name}Change`];
  }

  needToCreateAssignment(property: BaseProperty, elements: BindingElement[]) {
    return (
      !property.canBeDestructured &&
      !property.isRefProp &&
      (elements.length === 0 ||
        elements.some(
          (e) =>
            (e.propertyName || e.name).toString() === property._name.toString()
        ))
    );
  }

  processProps(
    result: string,
    options: toStringOptions,
    elements: BindingElement[] = []
  ) {
    const props = getProps(options.members);
    const hasComplexProps = props.some((p) =>
      this.needToCreateAssignment(p, elements)
    );

    if (
      hasComplexProps &&
      options.componentContext === SyntaxKind.ThisKeyword
    ) {
      const hasSimpleProps = props.some((p) => p.canBeDestructured);
      const initValue = (hasSimpleProps
        ? [new SpreadAssignment(new Identifier("props"))]
        : []) as (PropertyAssignment | SpreadAssignment)[];

      const destructedProps = props.reduce((acc, p) => {
        if (this.needToCreateAssignment(p, elements)) {
          acc.push(
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
          );
        }
        return acc;
      }, initValue);

      const expression = new ObjectLiteral(destructedProps, true);
      return expression.toString(options);
    }

    return result;
  }
}
