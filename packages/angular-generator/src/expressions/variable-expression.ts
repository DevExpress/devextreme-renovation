import { toStringOptions, VariableDeclaration as BaseVariableDeclaration } from '@devextreme-generator/core';

export class VariableDeclaration extends BaseVariableDeclaration {
  toString(options?: toStringOptions) {
    if (this.isJsx()) {
      return '';
    }
    return super.toString(options);
  }
}
