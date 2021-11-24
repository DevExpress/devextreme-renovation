import { Identifier, SimpleExpression, toStringOptions } from '@devextreme-generator/core';
import { AngularDirective } from './angular-directive';
import type { JsxOpeningElement } from './jsx-opening-element';
import { tryToGetContent } from './ng-content-generator';

export const elementPostProcess = (element: JsxOpeningElement, options?: toStringOptions): { prefix: string, postfix: string } => {
  const { content, elementDirective, condition } = tryToGetContent(element);

  if (elementDirective !== null) {
    element.addAttribute(elementDirective);
    element.addAttribute(new AngularDirective(new Identifier('styles'), new SimpleExpression('{display: contents}')));
  }

  return {
    prefix: condition ? `<ng-container ${condition.toString(options)}>` : '',
    postfix: `${content}${condition ? '</ng-container>' : ''}`,
  };
};
