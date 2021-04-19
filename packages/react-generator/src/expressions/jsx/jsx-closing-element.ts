import { Expression, toStringOptions } from '@devextreme-generator/core';
import { JsxOpeningElement } from './jsx-opening-element';

export class JsxClosingElement extends JsxOpeningElement {
  constructor(tagName: Expression) {
    super(tagName, [], [], {});
  }

  toString(options?: toStringOptions) {
    return `</${this.processTagName(this.tagName).toString(options)}>`;
  }
}
