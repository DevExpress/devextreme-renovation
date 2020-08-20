import {
  TypeReferenceNode as BaseTypeReferenceNode,
  TypeExpression,
} from "../../base-generator/expressions/type";
import { GeneratorContext } from "../../base-generator/types";
import { Identifier } from "../../base-generator/expressions/common";
import { ComponentInput } from "./react-component-input";

export class TypeReferenceNode extends BaseTypeReferenceNode {
  context: GeneratorContext;
  constructor(
    typeName: Identifier,
    typeArguments: TypeExpression[] | undefined,
    context: GeneratorContext
  ) {
    super(typeName, typeArguments);
    this.context = context;
  }
  toString() {
    if (
      this.context.components?.[this.typeName.toString()] instanceof
      ComponentInput
    ) {
      return `typeof ${super.toString()}`;
    }
    return super.toString();
  }
}
