import {
  Function as AngularFunction,
  isElement,
} from '@devextreme-generator/angular';
import {
  Identifier,
  Decorator,
  Parameter,
  Block,
  GeneratorContext,
  SimpleTypeExpression,
  TypeExpression,
} from '@devextreme-generator/core';
import { toStringOptions } from '../../types';
import { JsxElement } from '../jsx/element';
import { JsxChildExpression, JsxExpression } from '../jsx/jsx-expression';
import { JsxClosingElement, JsxOpeningElement } from '../jsx/opening-element';

export function processFunctionTemplate(
  template: string,
  context: GeneratorContext,
  options?: toStringOptions,
) {
  if (template.startsWith('<slot')) {
    return new JsxElement(
      new JsxOpeningElement(
        new Identifier('Fragment'),
        undefined,
        undefined,
        context,
      ),
      [template],
      new JsxClosingElement(new Identifier('Fragment'), context),
    ).toString(options);
  }
  return template;
}

export class Function extends AngularFunction {
  constructor(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    asteriskToken: string,
    name: Identifier,
    typeParameters: any,
    parameters: Parameter[],
    _type: TypeExpression | undefined,
    body: Block,
    context: GeneratorContext,
  ) {
    super(
      decorators,
      modifiers,
      asteriskToken,
      name,
      typeParameters,
      parameters,
      new SimpleTypeExpression(''),
      body,
      context,
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
      options,
    );
  }

  compileTypeParameters(): string {
    return '';
  }
}
