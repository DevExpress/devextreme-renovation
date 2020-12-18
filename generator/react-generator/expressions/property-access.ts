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
import { SimpleExpression } from "../../base-generator/expressions/base";
import { processComponentContext } from "../../base-generator/utils/string";

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
    if (property.isRef || property.isForwardRefProp) {
      const componentContext = property.processComponentContext(
        options.newComponentContext
      );
      const scope = property.processComponentContext(property.scope);
      return `${componentContext}${scope}​​​​​​​​​${property.name}​​​​​​​​.current=${state}​​​​​​​​`;
    }
    return setState;
  }

  getAssignmentDependency(options?: toStringOptions) {
    return [`${this.name}Change`];
  }

  needToCreateAssignment(
    property: BaseProperty,
    elements: BindingElement[],
    hasRest: boolean
  ) {
    return (
      !property.canBeDestructured &&
      (elements.length === 0 ||
        elements.some(
          (e) =>
            (e.propertyName || e.name).toString() ===
              property._name.toString() || hasRest
        ))
    );
  }

  processProps(
    result: string,
    options: toStringOptions,
    elements: BindingElement[] = []
  ) {
    const props = getProps(options.members);
    const hasRest = elements.some((e) => e.dotDotDotToken);
    const hasComplexProps = props.some((p) =>
      this.needToCreateAssignment(p, elements, hasRest)
    );

    if (
      hasComplexProps &&
      options.componentContext === SyntaxKind.ThisKeyword
    ) {
      const hasSimpleProps = props.some((p) => p.canBeDestructured);
      const initValue: (PropertyAssignment | SpreadAssignment)[] =
        hasSimpleProps || elements.some((e) => e.dotDotDotToken)
          ? [
              new SpreadAssignment(
                options.newComponentContext
                  ? new SimpleExpression(
                      `${processComponentContext(
                        options.newComponentContext
                      )}props`
                    )
                  : new Identifier("props")
              ),
            ]
          : [];

      const destructedProps = props.reduce((acc, p) => {
        if (this.needToCreateAssignment(p, elements, hasRest)) {
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
