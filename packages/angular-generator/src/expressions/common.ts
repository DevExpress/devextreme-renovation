import { Call as BaseCall, StringLiteral } from '@devextreme-generator/core';
import { Function } from './functions/function';
import { toStringOptions } from '../types';

export class Call extends BaseCall {
  toString(options?: toStringOptions):string {
    if (this.expression.toString() === 'this.props.hasOwnProperty') {
      return this.compileHasOwnProperty(options);
    }
    return super.toString(options);
  }

  compileHasOwnProperty(options?: toStringOptions):string {
    const argument = this.arguments?.[0];
    if (argument instanceof StringLiteral) {
      const value = argument.valueOf();
      const nestedNames = options?.members.filter((m) => m.isNested).map((m) => m.name) ?? [];
      if (
        this.arguments.length > 0
        && nestedNames.some((name) => name === value.toString())
      ) {
        return `this.hasOwnProperty(${this.getHasOwnArgument(argument)}) || this.${value} !== undefined`;
      }
    }

    return `this.hasOwnProperty(${argument})`;
  }

  getHasOwnArgument(argument:StringLiteral) {
    return new StringLiteral(`__${argument.valueOf()}`, argument.quoteSymbol);
  }
}
