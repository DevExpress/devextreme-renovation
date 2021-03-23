import { ExpressionWithExpression, Expression } from "./base";
import { toStringOptions } from "../types";

export class TemplateSpan extends ExpressionWithExpression {
  literal: string;
  constructor(expression: Expression, literal: string) {
    super(expression);
    this.literal = literal;
  }

  toString(options?: toStringOptions) {
    const expressionString = super.toString(options);
    if (options?.disableTemplates) {
      return `${expressionString}+"${this.literal}"`;
    }
    return `\${${expressionString}}${this.literal}`;
  }
}

export class TemplateExpression extends Expression {
  head: string;
  templateSpans: TemplateSpan[];

  constructor(head: string, templateSpans: TemplateSpan[]) {
    super();
    this.head = head;
    this.templateSpans = templateSpans;
  }

  toString(options?: toStringOptions) {
    const templateSpansStrings = this.templateSpans.map((s) =>
      s.toString(options)
    );
    if (options?.disableTemplates) {
      return `"${this.head}"+${templateSpansStrings.join("+")}`;
    }
    return `\`${this.head}${templateSpansStrings.join("")}\``;
  }

  getDependency(options: toStringOptions) {
    return this.templateSpans.reduce(
      (d: string[], t) => d.concat(t.getDependency(options)),
      []
    );
  }
}
