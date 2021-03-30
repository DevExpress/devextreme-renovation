import { Expression } from '@devextreme-generator/core';
import { JsxClosingElement as ReactJsxClosingElement } from '@devextreme-generator/react';

import { processTagName } from './jsx-opening-element';

export class JsxClosingElement extends ReactJsxClosingElement {
  processTagName(tagName: Expression) {
    return processTagName(tagName);
  }
}
