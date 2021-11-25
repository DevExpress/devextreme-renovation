import { toStringOptions } from '@devextreme-generator/core';
// import { AngularDirective } from './angular-directive';
import type { JsxOpeningElement } from './jsx-opening-element';
import { tryToGetContent } from './ng-content-generator';

export const elementPostProcess = (element: JsxOpeningElement, options?: toStringOptions): { prefix: string, postfix: string } => {
  const { content, elementDirectives, condition } = tryToGetContent(element);

  elementDirectives?.forEach((e) => element.addAttribute(e));

  return {
    prefix: condition ? `<ng-container ${condition.toString(options)}>` : '',
    postfix: `${content}${condition ? '</ng-container>' : ''}`,
  };
};
