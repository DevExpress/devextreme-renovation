import { TypeReferenceNode as BaseTypeReferenceNode } from '@devextreme-generator/core';

export class TypeReferenceNode extends BaseTypeReferenceNode {
  toString() {
    if (this.typeName.toString() === 'JSXTemplate') {
      return 'any';
    }
    return super.toString();
  }
}
