import { Decorators } from '../decorators';
import { HeritageClause } from '../expressions/class';
import { Call, Identifier, Paren } from '../expressions/common';
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
import { Block, ReturnStatement } from '../expressions/statements';
import { Expression, SimpleExpression } from '../expressions/base';
import { Binary } from '../expressions/operators';
import { SyntaxKind } from '../syntaxKind';
import { ArrowFunction } from '../expressions/functions';

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

export const compileGetterCache = (
  name: Identifier,
  type: TypeExpression | string | undefined,
  body: Block,
  isProvider: boolean | undefined,
  needToHandleProvider = true,
): Expression[] => {
  const cacheAccess = `this.__getterCache["${name.toString()}"]`;
  const setCacheExpression = new Binary(
    new SimpleExpression(cacheAccess),
    SyntaxKind.EqualsToken,
    new Call(
      new Paren(
        new ArrowFunction(
          [],
          [],
          [],
          type,
          SyntaxKind.EqualsGreaterThanToken,
          new Block(body.statements, false),
          {},
        ),
      ),
      undefined,
    ),
  );
  const returnExpression = isProvider && needToHandleProvider
    ? new Binary(
      new SimpleExpression(`this.${name}Provider.value`),
      SyntaxKind.EqualsToken,
      setCacheExpression,
    )
    : setCacheExpression;
  return [
    new SimpleExpression(`
                if(${cacheAccess}!==undefined){
                    return ${cacheAccess};
                }`),
    new ReturnStatement(returnExpression),
  ];
};
