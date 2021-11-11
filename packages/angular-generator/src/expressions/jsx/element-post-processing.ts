import { toStringOptions } from '@devextreme-generator/core';
import type { JsxOpeningElement } from './jsx-opening-element';
import { tryToGetContent } from './ng-content-generator';

export const process = (element: JsxOpeningElement, options?: toStringOptions): { prefix: string, postfix: string } => {
  const { content, elementDirective, condition } = tryToGetContent(element);

  if (elementDirective !== null) {
    element.attributes.push(elementDirective);
  }

  return {
    prefix: condition ? `<ng-container ${condition.toString(options)}>` : '',
    postfix: `${content}${condition ? '</ng-container>' : ''}`,
  };
};
