import { ArrowFunction as AngularArrowFunction } from "../../../angular-generator/expressions/functions/arrow-function";
import { processFunctionTemplate } from "./function";
import {
  SimpleTypeExpression,
  TypeExpression,
} from "../../../base-generator/expressions/type";
import { GeneratorContext } from "../../../base-generator/types";
import { Block } from "../../../base-generator/expressions/statements";
import { Expression } from "../../../base-generator/expressions/base";
import { toStringOptions } from "../../types";
import { Parameter } from "./parameter";
import { TypeParameterDeclaration } from "../../../base-generator/expressions/type-parameter-declaration";
import { isElement } from "../../../angular-generator/expressions/jsx/elements";
import { JsxChildExpression, JsxExpression } from "../jsx/jsx-expression";

export class ArrowFunction extends AngularArrowFunction {
  constructor(
    modifiers: string[] | undefined,
    typeParameters: TypeParameterDeclaration[] | undefined,
    parameters: Parameter[],
    type: TypeExpression | string | undefined,
    equalsGreaterThanToken: string,
    body: Block | Expression,
    context: GeneratorContext
  ) {
    super(
      modifiers,
      typeParameters,
      parameters,
      new SimpleTypeExpression(""),
      equalsGreaterThanToken,
      body,
      context
    );
  }

  processTemplateExpression(expression?: JsxExpression) {
    if (expression && !isElement(expression)) {
      return new JsxChildExpression(expression);
    }
    return super.processTemplateExpression(expression);
  }

  getTemplate(options?: toStringOptions, doNotChangeContext?: boolean): string {
    return processFunctionTemplate(
      super.getTemplate(options, doNotChangeContext),
      this.context,
      options
    );
  }

  compileTypeParameters(): string {
    return "";
  }
}
