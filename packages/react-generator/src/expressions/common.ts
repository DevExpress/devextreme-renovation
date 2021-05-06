import {
  Conditional,
  Identifier,
  New as BaseNew,
  toStringOptions,
  Call as BaseCall,
} from '@devextreme-generator/core';
import { PropertyAccess } from './property-access';

export class New extends BaseNew {
  toString(options?: toStringOptions): string {
    const componentInputs = options?.componentInputs || [];
    if (componentInputs.length) {
      const matchedInput = componentInputs.find(
        (c) => c.name === this.expression.toString(),
      );
      if (matchedInput?.members.some((m) => m.isNested)) {
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
  compileHasOwnProperty(value: string, options?: toStringOptions): string {
    const nestedAndTwoWayNames = options?.members.filter(
      (m) => m.isNested || m.decorators?.[0]?.toString() === '@TwoWay()',
    )
      .map((m) => m.name) ?? [];
    const isTwoWayOrNested = (nestedAndTwoWayNames.some((name) => name === value.toString()));
    if (
      this.expression instanceof PropertyAccess
      && this.arguments.length > 0
      && isTwoWayOrNested
    ) {
      const propsContext = options?.newComponentContext ? `${options?.newComponentContext}.` : '';
      return `${this.expression.expression.toString(options)}.${value} !== undefined || ${propsContext
      }props.hasOwnProperty("${value}")`;
    }
    return super.compileHasOwnProperty(value, options);
  }
}
