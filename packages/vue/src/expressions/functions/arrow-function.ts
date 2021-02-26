import { processFunctionTemplate } from './function';
import { Parameter } from './parameter';
import { toStringOptions } from '../../types';
import { JsxChildExpression, JsxExpression } from '../jsx/jsx-expression';
import {
  ArrowFunction as AngularArrowFunction,
  isElement,
} from "@devextreme-generator/angular";
import {
  Block,
  Expression,
  GeneratorContext,
  TypeParameterDeclaration,
  SimpleTypeExpression,
  TypeExpression,
} from "@devextreme-generator/core";

export class ArrowFunction extends AngularArrowFunction {
  constructor(
    modifiers: string[] | undefined,
    typeParameters: TypeParameterDeclaration[] | undefined,
    parameters: Parameter[],
    _type: TypeExpression | string | undefined,
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
