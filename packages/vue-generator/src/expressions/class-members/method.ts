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
    if (!this.body && this.modifiers.indexOf('abstract') !== -1) {
      return '{}';
    } if (this.body && this.modifiers.indexOf('abstract') === -1) {
      return this.body.toString(options);
    } if (this.body && this.modifiers.indexOf('abstract') !== -1) {
      throw new Error(`Method '${this.name}' cannot have an implementation because it is marked abstract.`);
    } else if (!this.body && this.modifiers.indexOf('abstract') === -1) {
      throw new Error('Function implementation is missing or not immediately following the declaration.');
    }
    return '';
  }

  toString(options?: toStringOptions): string {
    if (!options) {
      return `${this.name}(${this.parameters})${this.compileBody(options)}`;
    }
    return compileMethod(this, options);
  }
}
