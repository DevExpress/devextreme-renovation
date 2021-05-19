import {
  Method as BaseMethod,
  GetAccessor,
} from '@devextreme-generator/core';
import { toStringOptions } from '../../types';

export function compileMethod(
  expression: Method | GetAccessor,
  options?: toStringOptions,
): string {
  return `${expression.name}(${
    expression.parameters
  })${expression.body?.toString(options)}`;
}

export class Method extends BaseMethod {
  compileBody(options?: toStringOptions): string {
    if (this.modifiers.indexOf('abstract') !== -1) {
      if (!this.body) {
        return '{}';
      }
      throw new Error(`Method '${this.name}' cannot have an implementation because it is marked abstract.`);
    } else {
      if (this.body) {
        return this.body.toString(options);
      }
      throw new Error('Function implementation is missing or not immediately following the declaration.');
    }
  }

  toString(options?: toStringOptions): string {
    if (!options) {
      return `${this.name}(${this.parameters})${this.compileBody(options)}`;
    }
    return compileMethod(this, options);
  }
}
