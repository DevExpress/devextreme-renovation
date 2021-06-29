import {
  SimpleExpression,
  BindingElement,
  Property as BaseProperty,
  Identifier,
  getProps,
  ObjectLiteral,
  PropertyAccess as BasePropertyAccess,
  SyntaxKind,
  toStringOptions,
  processComponentContext,
  PropertyAssignment,
  SpreadAssignment,
  lowerizeFirstLetter,
  capitalizeFirstLetter,
} from '@devextreme-generator/core';
import {
  Property,
  getLocalStateName,
  stateSetter,
} from './class-members/property';

export function getChangeEventToken(property: Property): string {
  if (property.questionOrExclamationToken === SyntaxKind.QuestionToken) {
    if (property.initializer) {
      return SyntaxKind.ExclamationToken;
    }
    return SyntaxKind.QuestionDotToken;
  }
  return '';
}

export class PropertyAccess extends BasePropertyAccess {
  compileNestedSetting(
    state: string,
    _property: Property,
    options: toStringOptions,
  ): string {
    const stateName = this.expression.toString()
      .replace('this.props.', '')
      .split('.')
      .concat(this.name.toString())
      .map(capitalizeFirstLetter)
      .join('');
    const setter = `__state_set${stateName}`;
    const localStateName = `__state_${lowerizeFirstLetter(stateName)}`;
    const setState = `${setter}(${localStateName} => (${state}))`;

    const eventName = `${this.name}Change`;
    const eventCall = `${this.expression.toString(options)}.${eventName}?.(${state})`;

    return `{
      ${setState};
      ${eventCall};
    }`;
  }

  compileStateSetting(
    state: string,
    property: Property,
    options: toStringOptions,
  ) {
    if (property.isNested) {
      return this.compileNestedSetting(state, property, options);
    }

    const setState = `${stateSetter(this.name)}(${getLocalStateName(
      this.name,
    )} => ${state.startsWith('{') ? `(${state})` : state})`;

    if (property.isState) {
      const propertyName = `${this.name}Change`;
      const props = getProps(options.members);
      const changeProperty = props.find(
        (m) => m.name === propertyName,
      ) as Property;
      return `(${setState}, props.${this.name}Change${getChangeEventToken(
        changeProperty,
      )}(${state}))`;
    }

    if (property.isRef || property.isForwardRefProp) {
      const componentContext = property.processComponentContext(
        options.newComponentContext,
      );
      const scope = property.processComponentContext(property.scope);
      const elementGetter = this.name.toString() !== property.name.toString()
        ? `.${this.name.toString()}`
        : '';
      return `${componentContext}${scope}​​​​​​​​​${property.name}${elementGetter}=${state}​​​​​​​​`;
    }

    return setState;
  }

  getAssignmentDependency(_options?: toStringOptions) {
    return [`${this.name}Change`];
  }

  needToCreateAssignment(
    property: BaseProperty,
    elements: BindingElement[],
    hasRest: boolean,
  ) {
    return (
      !property.canBeDestructured
      && (elements.length === 0
        || elements.some(
          (e) => (e.propertyName || e.name).toString()
              === property._name.toString() || hasRest,
        ))
    );
  }

  processProps(
    result: string,
    options: toStringOptions,
    elements: BindingElement[] = [],
  ) {
    const props = getProps(options.members);
    const hasRest = elements.some((e) => e.dotDotDotToken);
    const hasComplexProps = props.some((p) => this.needToCreateAssignment(p, elements, hasRest));

    if (
      hasComplexProps
      && options.componentContext === SyntaxKind.ThisKeyword
    ) {
      const hasSimpleProps = props.some((p) => p.canBeDestructured);
      const initValue: (PropertyAssignment | SpreadAssignment)[] = hasSimpleProps
      || elements.some((e) => e.dotDotDotToken)
        ? [
          new SpreadAssignment(
            options.newComponentContext
              ? new SimpleExpression(
                `${processComponentContext(
                  options.newComponentContext,
                )}props`,
              )
              : new Identifier('props'),
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
                  new Identifier('props'),
                ),
                p._name,
              ),
            ),
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
