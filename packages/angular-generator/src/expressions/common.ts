import {
  Block, Call as BaseCall, capitalizeFirstLetter, Identifier, ReturnStatement, SimpleExpression, StringLiteral
} from '@devextreme-generator/core';
import { Function } from './functions/function';
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
        // const functionName = `hasOwnNested${capitalizeFirstLetter(value)}`;
        // const hasOwnNestedFunction = new Function(
        //   undefined,
        //   undefined,
        //   '',
        //   new Identifier(functionName),
        //   undefined, [], undefined,
        //   new Block([new ReturnStatement(new SimpleExpression(`this.hasOwnProperty("__${value}")||this.${value}!==undefined`))], true),
        //   {}
        // );
        return `this.hasOwnProperty(${argument}) || this.${value} !== undefined`;
      }
    }

    return `this.hasOwnProperty(${argument})`;
  }

  // createHasOwnNested(options?: toStringOptions) {
  //   const argument = this.arguments?.[0];
  // }
}
