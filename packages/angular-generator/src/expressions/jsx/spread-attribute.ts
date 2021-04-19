import {
  Expression,
  getMember,
  PropertyAssignment,
  ShorthandPropertyAssignment,
  Identifier,
  AsExpression,
  ObjectLiteral,
  GeneratorContext,
  PropertySignature,
  MethodSignature,
  TypeLiteralNode,
  Method,
} from '@devextreme-generator/core';
import { toStringOptions } from '../../types';
import { JsxExpression } from './jsx-expression';
import { PropertyAccess } from '../property-access';
import { Property } from '../class-members/property';

export interface JsxSpreadAttributeMeta {
  refExpression: Expression;
  expression: Expression;
}

export class JsxSpreadAttribute extends JsxExpression {
  expression: Expression;

  constructor(dotDotDotToken = '', expression: Expression) {
    super(dotDotDotToken, expression);
    this.expression = expression;
  }

  getExpression(options?: toStringOptions) {
    return super.getExpression(options) || this.expression;
  }

  getPropertyAssignmentFormSpread(
    expression: Expression,
    options?: toStringOptions,
    context?: GeneratorContext,
  ): PropertyAssignment[] {
    const member = getMember(expression, options);
    const components = context?.components;

    if (member) {
      if (member._name.toString() === 'restAttributes') {
        return [];
      }

      const type = expression instanceof AsExpression ? expression.type : member.type;

      const propComponent = components?.[type.toString()];
      const propInterface = context?.interfaces?.[type.toString()]
        || context?.externalInterfaces?.[type.toString()];
      const propType = context?.types?.[type.toString()]
        || context?.externalTypes?.[type.toString()];
      const container = propComponent
        || propInterface
        || (propType instanceof TypeLiteralNode ? propType : undefined)
        || (type instanceof TypeLiteralNode ? type : undefined);
      if (container) {
        return extractPropertyAssignment(container, expression);
      }
    }
    return [];
  }

  getTemplateContext(options?: toStringOptions, context?: GeneratorContext) {
    const expression = this.getExpression(options);

    if (expression instanceof ObjectLiteral) {
      return expression.properties.reduce((props: PropertyAssignment[], e) => {
        if (e instanceof PropertyAssignment) {
          return props.concat(e);
        }
        if (e instanceof ShorthandPropertyAssignment) {
          return props.concat(new PropertyAssignment(e.key, e.name));
        }
        return props.concat(
          this.getPropertyAssignmentFormSpread(e.expression, options, context),
        );
      }, []);
    }

    return this.getPropertyAssignmentFormSpread(expression, options, context);
  }

  toString(_options?: toStringOptions) {
    return '';
  }
}

function extractPropertyAssignment(
  container: {
    members: Array<PropertySignature | MethodSignature | Property | Method>;
  },
  expression: Expression,
) {
  return container.members.map((m) => {
    const name = m.name instanceof Identifier ? m.name : new Identifier(m.name);
    return new PropertyAssignment(name, new PropertyAccess(expression, name));
  });
}
