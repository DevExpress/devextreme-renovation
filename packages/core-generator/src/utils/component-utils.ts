import { Decorators } from '../decorators';
import { HeritageClause } from '../expressions/class';
import { Call, Identifier } from '../expressions/common';
import { Component } from '../expressions/component';
import { ComponentInput } from '../expressions/component-input';
import { ImportClause } from '../expressions/import';
import { Decorator } from '../expressions/decorator';
import {
  ExpressionWithTypeArguments,
  extractElementType,
  isTypeArray,
  TypeExpression,
  TypeQueryNode,
  TypeReferenceNode,
} from '../expressions/type';
import { GeneratorContext } from '../types';

export function extractComponentFromType(
  typeExpression: string | TypeExpression | undefined,
  context: GeneratorContext,
): Component | undefined {
  const type = isTypeArray(typeExpression)
    ? extractElementType(typeExpression)
    : typeExpression;

  if (
    type instanceof TypeReferenceNode
    && type.typeName.toString() === 'JSXTemplate'
    && type.typeArguments[0] instanceof TypeReferenceNode
  ) {
    const propsName = (type
      .typeArguments[0] as TypeReferenceNode).type.toString();
    const componentInput = context.components?.[propsName];
    if (componentInput instanceof ComponentInput) {
      return new Component(
        new Decorator(new Call(new Identifier(Decorators.Component)), context),
        [],
        new Identifier('temp'),
        [],
        [
          new HeritageClause(
            'extends',
            [
              new ExpressionWithTypeArguments(
                undefined,
                new Call(new Identifier('JSXComponent'), type.typeArguments),
              ),
            ],
            context,
          ),
        ],
        [],
        context,
      );
    }
  }

  if (
    type instanceof TypeReferenceNode
    && context.components?.[type.typeName.toString()] instanceof Component
  ) {
    return context.components![type.typeName.toString()] as Component;
  }

  if (
    type instanceof TypeQueryNode
    && context.components?.[type.expression.toString()] instanceof Component
  ) {
    return context.components![type.expression.toString()] as Component;
  }

  return undefined;
}

export function isComponentWrapper(imports: {
  [name: string]: ImportClause;
} | undefined): boolean {
  return Object.keys(imports || {}).some((i: string) => i.includes('dom_component_wrapper'));
}
