import { Call as BaseCall } from '@devextreme-generator/core';
import { toStringOptions } from '../types';

export class Call extends BaseCall {
  compileHasOwnProperty(value: string, options?: toStringOptions): string {
    const nestedNames = options?.members.filter((m) => m.isNested).map((m) => m.name) ?? [];
    if (
      this.arguments.length > 0
      && nestedNames.some((name: string) => name === value)
    ) {
      return `this.hasOwnProperty("__${value}") || this.${value} !== undefined`;
    }
    return `this.hasOwnProperty("${value}")`;
  }
}
