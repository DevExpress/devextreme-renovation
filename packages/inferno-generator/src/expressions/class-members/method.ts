import { toStringOptions, compileType } from '@devextreme-generator/core';
import { Method as ReactMethod } from '@devextreme-generator/react';

export class Method extends ReactMethod {
  toString(options?: toStringOptions) {
    if (options) {
      return `${this.modifiers.join(' ')} ${
        this.name
      }${this.compileTypeParameters()}(${this.parameters})${compileType(
        this.type.toString(),
      )}${this.body.toString(options)}`;
    }

    return super.toString();
  }
}
