import {
  TypeReferenceNode as BaseTypeReferenceNode,
  TypeExpression,
} from "../../base-generator/expressions/type";
import { Identifier } from "../../base-generator/expressions/common";
import { AngularGeneratorContext } from "../types";

export class TypeReferenceNode extends BaseTypeReferenceNode {
  constructor(
    public typeName: Identifier,
    public typeArguments: TypeExpression[] = [],
    public context: AngularGeneratorContext
  ) {
    super(typeName, typeArguments, context);
    if (typeName.toString() === "RefObject") {
      this.typeName = typeArguments.length
        ? new Identifier(typeArguments[0].toString())
        : new Identifier("any");
      this.typeArguments = [];
    }
  }

  toString() {
    if (this.typeName.toString() === "JSXTemplate") {
      return `any`;
    }
    return super.toString();
  }
}
