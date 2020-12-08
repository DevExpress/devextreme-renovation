import { JsxExpression } from "./jsx-expression";
import { Expression } from "../../../base-generator/expressions/base";
import { toStringOptions } from "../../types";
import { getMember } from "../../../base-generator/utils/expressions";
import {
  PropertyAssignment,
  ShorthandPropertyAssignment,
} from "../../../base-generator/expressions/property-assignment";
import {
  Identifier,
  AsExpression,
} from "../../../base-generator/expressions/common";
import { PropertyAccess } from "../property-access";
import { ObjectLiteral } from "../../../base-generator/expressions/literal";
import { GeneratorContext } from "../../../base-generator/types";
import {
  PropertySignature,
  MethodSignature,
  TypeLiteralNode,
} from "../../../base-generator/expressions/type";
export interface JsxSpreadAttributeMeta {
  refExpression: Expression;
  expression: Expression;
}

export class JsxSpreadAttribute extends JsxExpression {
  expression: Expression;
  constructor(dotDotDotToken: string = "", expression: Expression) {
    super(dotDotDotToken, expression);
    this.expression = expression;
  }

  getExpression(options?: toStringOptions) {
    return super.getExpression(options) || this.expression;
  }

  getPropertyAssignmentFormSpread(
    expression: Expression,
    options?: toStringOptions,
    context?: GeneratorContext
  ): PropertyAssignment[] {
    const member = getMember(expression, options);
    const components = context?.components;

    if (member) {
      if (member._name.toString() === "restAttributes") {
        return [];
      }

      const type =
        expression instanceof AsExpression ? expression.type : member.type;

      if (components?.[type.toString()]) {
        return components[type.toString()].members.map(
          (m) =>
            new PropertyAssignment(
              new Identifier(m.name),
              new PropertyAccess(expression, new Identifier(m.name))
            )
        );
      }
      const extractPropertyAssignment = (container: {
        members: Array<PropertySignature | MethodSignature>;
      }) =>
        container.members.map(
          (m) =>
            new PropertyAssignment(
              m.name,
              new PropertyAccess(expression, m.name)
            )
        );
      const propInterface =
        context?.interfaces?.[type.toString()] ||
        context?.externalInterfaces?.[type.toString()];
      if (propInterface) {
        return extractPropertyAssignment(propInterface);
      }
      const propType =
        context?.types?.[type.toString()] ||
        context?.externalTypes?.[type.toString()];
      if (propType instanceof TypeLiteralNode) {
        return extractPropertyAssignment(propType);
      }
      if (type instanceof TypeLiteralNode) {
        return extractPropertyAssignment(type);
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
          this.getPropertyAssignmentFormSpread(e.expression, options, context)
        );
      }, []);
    }

    return this.getPropertyAssignmentFormSpread(expression, options, context);
  }

  toString(options?: toStringOptions) {
    return "";
  }
}
