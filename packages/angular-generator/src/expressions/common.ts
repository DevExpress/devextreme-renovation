import { Call as BaseCall, StringLiteral } from '@devextreme-generator/core';
import { toStringOptions } from '../types';

export class Call extends BaseCall {
  toString(options?: toStringOptions) {
    if (this.expression.toString() === 'this.props.hasOwnProperty') {
      return this.compileHasOwnProperty(options);
    }
    return super.toString(options);
  }

  compileHasOwnProperty(options?: toStringOptions) {
    let argument = this.arguments?.[0];
    if (argument instanceof StringLiteral) {
      const value = argument.valueOf();
      const nestedNames = options?.members.filter((m) => m.isNested).map((m) => m.name) ?? [];
      if (
        this.arguments.length > 0
        && nestedNames.some((name) => name === value.toString())
      ) {
        argument = new StringLiteral(`__${value}`, argument.quoteSymbol);
      }
    }

    return `this.hasOwnProperty(${argument})`;
  }
}
