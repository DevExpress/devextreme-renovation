import { Expression } from '@devextreme-generator/core';
import { JsxOpeningElement as ReactJsxOpeningElement } from '@devextreme-generator/react';

export const processTagName = (tagName: Expression) => tagName;

export class JsxOpeningElement extends ReactJsxOpeningElement {
  processTagName(tagName: Expression) {
    return processTagName(tagName);
  }
}
