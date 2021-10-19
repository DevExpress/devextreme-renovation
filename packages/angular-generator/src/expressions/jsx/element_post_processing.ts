import type { JsxOpeningElement } from './jsx-opening-element';
import { tryToGetContent } from './ng-content-generator';

export const process = (element: JsxOpeningElement): string => {
  const { content, elementDirective } = tryToGetContent(element);

  if (elementDirective !== null) {
    element.attributes.push(elementDirective);
  }

  return content;
};
