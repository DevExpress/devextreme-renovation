import { Expression } from '../expressions/base';
import { toStringOptions, GeneratorContext } from '../types';
import { Identifier, Paren, AsExpression } from '../expressions/common';
import { JsxExpression } from '../expressions/jsx';
import { PropertyAccess, PropertyAccessChain } from '../expressions/property-access';
import { Property, Method } from '../expressions/class-members';
import { TypeReferenceNode } from '../expressions/type';
import { ComponentInput } from '../expressions/component-input';

export function getExpression(
  expression: Expression,
  options?: toStringOptions,
): Expression {
  if (expression instanceof Identifier) {
    while (
      options?.variables?.[expression.toString()]
      && options.variables[expression.toString()].toString()
        !== expression.toString()
    ) {
      expression = options.variables[expression.toString()];
    }
  }

  if (expression instanceof Paren || expression instanceof AsExpression) {
    return getExpression(expression.expression, options);
  } if (expression instanceof JsxExpression && expression.expression) {
    return getExpression(expression.expression, options);
  }

  return expression;
}

export function getMember(
  expression: Expression,
  options?: toStringOptions,
): Property | Method | undefined {
  expression = getExpression(expression, options);

  if (expression instanceof PropertyAccess) {
    return expression.getMember(options);
  }
  // if (expression instanceof PropertyAccessChain
  //     && expression.expression instanceof PropertyAccess) {
  //   return expression.expression.getMember(options);
  // }
  return undefined;
}

export function getTemplateProperty(
  expression: Expression,
  options?: toStringOptions,
) {
  const tagName = getExpression(expression, options).toString(options);
  return options?.members.find(
    (s) => s.isTemplate && tagName === `${s.getter(options?.newComponentContext)}`,
  );
}

export function findComponentInput(
  type: TypeReferenceNode,
  context: GeneratorContext,
): ComponentInput {
  return context.components?.[
    type.type.toString().replace('typeof ', '')
  ] as ComponentInput;
}
