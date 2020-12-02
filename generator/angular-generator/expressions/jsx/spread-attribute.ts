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
import { TypeLiteralNode } from "../../../base-generator/expressions/type";

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
      if (context?.interfaces?.[type.toString()]) {
        return context?.interfaces?.[type.toString()].members.map(
          (m) =>
            new PropertyAssignment(
              m.name,
              new PropertyAccess(expression, m.name)
            )
        );
      }
      if (type instanceof TypeLiteralNode) {
        return type.members.map(
          (m) =>
            new PropertyAssignment(
              m.name,
              new PropertyAccess(expression, m.name)
            )
        );
      }
    }
    return [];
  }

  getTemplateContext(options?: toStringOptions, context?: GeneratorContext) {
    const expression = this.getExpression(options);
    const components = context?.components;

    if (expression instanceof ObjectLiteral) {
      return expression.properties.reduce((props: PropertyAssignment[], e) => {
        if (e instanceof PropertyAssignment) {
          return props.concat(e);
        }
        if (e instanceof ShorthandPropertyAssignment) {
          return props.concat(new PropertyAssignment(e.key, e.name));
        }
        return props.concat(
          this.getPropertyAssignmentFormSpread(
            e.expression,
            options,
            components
          )
        );
      }, []);
    }

    return this.getPropertyAssignmentFormSpread(expression, options, context);
  }

  toString(options?: toStringOptions) {
    return "";
  }
}
