import { Call as BaseCall, StringLiteral } from '@devextreme-generator/core';
import { Function } from './functions/function';
import { toStringOptions } from '../types';

export class Call extends BaseCall {
  compileHasOwnProperty(value: string, options?: toStringOptions): string {
    const nestedNames = options?.members.filter((m) => m.isNested).map((m) => m.name) ?? [];
    if (
      this.arguments.length > 0
      && nestedNames.some((name) => name === value.toString())
    ) {
      return `this.hasOwnProperty("__${value}") || this.${value} !== undefined`;
    }
    return `this.hasOwnProperty("${value}")`;
  }
}
