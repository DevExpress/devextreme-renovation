import {
  PropertyAccess as BasePropertyAccess,
  compileRefOptions,
  BindingElement,
  ObjectLiteral,
  Property as BaseProperty,
  PropertyAssignment,
  Identifier,
  NonNullExpression,
  getProps,
  Property,
  isProperty,
  getMember,
  SyntaxKind,
  SpreadAssignment,
  SimpleExpression,
} from '@devextreme-generator/core';
import { toStringOptions } from '../types';

export class PropertyAccess extends BasePropertyAccess {
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
                `${ options.newComponentContext.length ? `${options.newComponentContext}` : ''}`,
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
    // const hasRest = elements.some((e) => e.dotDotDotToken);
    // const props = getProps(options.members).filter(
    //   (p) => hasRest
    //     || elements.length === 0
    //     || elements.some(
    //       (e) => (e.propertyName || e.name).toString() === p._name.toString(),
    //     ),
    // );
    // if (props.some((p) => !p.canBeDestructured) || props.length === 0) {
    //   const expression = new ObjectLiteral(
    //     props.map(
    //       (p) => new PropertyAssignment(
    //         p._name,
    //         new PropertyAccess(
    //           new PropertyAccess(
    //             new Identifier(this.calculateComponentContext(options)),
    //             new Identifier('props'),
    //           ),
    //           p._name,
    //         ),
    //       ),
    //     ),
    //     true,
    //   );
    //   return expression.toString(options);
    // }
    // return options.newComponentContext!;

  compileStateSetting(
    value: string,
    property: Property,
    options: toStringOptions,
  ) {
    if (property.isState) {
      return `this._${this.name}Change(${this.toString(options)}=${value})`;
    }
    if (property.isRef || property.isForwardRefProp) {
      const setValue = value.endsWith('.nativeElement')
        ? `new ElementRef(${value})`
        : value;
      if (property.isForwardRefProp) {
        return `this.forwardRef_${property.name}(${setValue})`;
      }
      return `this.${property.name} = ${setValue}`;
    }

    return `this._${property.name}=${value}`;
  }

  getRefAccessor(member: Property) {
    if (member.isRef || member.isForwardRef) {
      return '.nativeElement';
    }
    if (member.isForwardRefProp) {
      const token = member.isOptional ? '?.' : '';
      return `${token}()?.nativeElement`;
    }
    if (member.isRefProp || member.isApiRef) {
      return '';
    }
    return null;
  }

  processName(options?: toStringOptions) {
    if (
      this.name.toString() === 'current'
      && (this.expression instanceof PropertyAccess
        || this.expression instanceof Identifier
        || this.expression instanceof NonNullExpression)
    ) {
      const expressionString = this.expression.expression.toString({
        members: [],
        variables: {
          ...options?.variables,
        },
      });
      const expression = this.expression instanceof NonNullExpression
        ? this.expression.expression
        : this.expression;
      const member = getMember(
        expression,
        compileRefOptions(expressionString, options),
      );

      if (member && isProperty(member)) {
        const accessor = this.getRefAccessor(member);
        if (accessor !== null) {
          return accessor;
        }
      }
    }

    return super.processName(options);
  }
}
