import { TypeReferenceNode as ReactTypeReferenceNode } from "../../react-generator/expressions/type-reference-node";

export class TypeReferenceNode extends ReactTypeReferenceNode {
  get REF_OBJECT_TYPE() {
    return "RefObject";
  }

  toString() {
    if (this.typeName.toString() === "JSXTemplate") {
      return "any";
    }
    return super.toString();
  }
}
