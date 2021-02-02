import { TypeReferenceNode as ReactTypeReferenceNode } from "../../react-generator/expressions/type-reference-node";

export class TypeReferenceNode extends ReactTypeReferenceNode {
  REF_OBJECT_TYPE = "RefObject";

  toString() {
    if (this.typeName.toString() === "JSXTemplate") {
      return "any";
    }
    return super.toString();
  }
}
