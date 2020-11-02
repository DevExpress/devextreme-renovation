import { HeritageClause } from "../../base-generator/expressions/class";
import { Identifier } from "../../base-generator/expressions/common";
import { Decorator } from "../../base-generator/expressions/decorator";
import {
  ExpressionWithTypeArguments,
  extractElementType,
  isTypeArray,
  TypeExpression,
  TypeQueryNode,
  TypeReferenceNode,
} from "../../base-generator/expressions/type";
import { GeneratorContext } from "../../base-generator/types";
import { Decorators } from "../../component_declaration/decorators";
import { Call } from "./call";
import { VueComponent } from "./vue-component";
import { VueComponentInput } from "./vue-component-input";

export function extractComponentFromType(
  typeExpression: string | TypeExpression | undefined,
  context: GeneratorContext
): VueComponent | undefined {
  const type = isTypeArray(typeExpression)
    ? extractElementType(typeExpression)
    : typeExpression;

  if (
    type instanceof TypeReferenceNode &&
    type.typeName.toString() === "JSXTemplate" &&
    type.typeArguments[0] instanceof TypeReferenceNode
  ) {
    const propsName = (type
      .typeArguments[0] as TypeReferenceNode).type.toString();
    const componentInput = context.components?.[propsName];
    if (componentInput instanceof VueComponentInput) {
      return new VueComponent(
        new Decorator(new Call(new Identifier(Decorators.Component)), context),
        [],
        new Identifier("temp"),
        [],
        [
          new HeritageClause(
            "extends",
            [
              new ExpressionWithTypeArguments(
                undefined,
                new Call(new Identifier("JSXComponent"), type.typeArguments)
              ),
            ],
            context
          ),
        ],
        [],
        context
      );
    }
  }

  if (
    type instanceof TypeReferenceNode &&
    context.components?.[type.typeName.toString()] instanceof VueComponent
  ) {
    return context.components![type.typeName.toString()] as VueComponent;
  }

  if (
    type instanceof TypeQueryNode &&
    context.components?.[type.expression.toString()] instanceof VueComponent
  ) {
    return context.components![type.expression.toString()] as VueComponent;
  }
}
