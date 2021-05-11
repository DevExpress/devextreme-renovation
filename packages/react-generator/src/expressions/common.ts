import {
  Conditional, Identifier, New as BaseNew, PropertyAccess, toStringOptions,
} from '@devextreme-generator/core';

export class New extends BaseNew {
  toString(options?: toStringOptions) {
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
