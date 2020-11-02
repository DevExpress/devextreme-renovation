import { TypeReferenceNode as BaseTypeReferenceNode } from "../../base-generator/expressions/type";

export class TypeReferenceNode extends BaseTypeReferenceNode {
  toString() {
    if (this.typeName.toString() === "JSXTemplate") {
      return `any`;
    }
    return super.toString();
  }
}
