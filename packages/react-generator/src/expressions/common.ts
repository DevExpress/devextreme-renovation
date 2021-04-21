import {
  Conditional,
  Identifier,
  New as BaseNew,
  toStringOptions,
  Call as BaseCall,
  StringLiteral
} from '@devextreme-generator/core';
import { PropertyAccess } from './property-access';

export class New extends BaseNew {
  toString(options?: toStringOptions):string {
    const componentInputs = options?.componentInputs || [];
    if (componentInputs.length) {
      const matchedInput = componentInputs.find(
        (c) => c.name === this.expression.toString(),
      );
      if (matchedInput?.isNested) {
        const conditional = new Conditional(
          new PropertyAccess(
            this.expression,
            new Identifier('__defaultNestedValues'),
          ),
          new PropertyAccess(
            this.expression,
            new Identifier('__defaultNestedValues'),
          ),
          this.expression,
        );
        return conditional.toString();
      }
      if (matchedInput) {
        return this.expression.toString();
      }
    }
    return super.toString(options);
  }
}

export class Call extends BaseCall {
  toString(options?: toStringOptions): string {
    if (this.expression.toString() === 'this.props.hasOwnProperty') {
      const argument = this.arguments?.[0];
      if (argument instanceof StringLiteral) {
        const value = argument.valueOf();
        const nestedNames = options?.members.filter((m) => m.isNested).map((m) => m.name) ?? [];
        if (
          this.expression instanceof PropertyAccess
          && this.arguments.length > 0
          && nestedNames.some((name) => name === value.toString())
        ) {
          return `${this.expression.expression.toString(options)}.${value} !== undefined || props.hasOwnProperty(${argument})`;
        }
        const twoWayNames = options?.members
          .filter((m) => m.decorators?.[0]?.toString() === '@TwoWay()').map((m) => m.name) ?? [];
        if (
          this.expression instanceof PropertyAccess
          && this.arguments.length > 0
          && twoWayNames.some((name) => name === value.toString())
        ) {
          return `${this.expression.expression.toString(options)}.${value} !== undefined || props.hasOwnProperty(${argument})`;
        }
      }
    }
    return super.toString(options);
  }
}
