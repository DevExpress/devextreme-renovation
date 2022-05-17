import { JsxOpeningElement as ReactJsxOpeningElement } from '@devextreme-generator/react';
import { Expression, toStringOptions } from '@devextreme-generator/core';

export class JsxOpeningElement extends ReactJsxOpeningElement {
  processTagName(tagName: Expression): Expression {
    return tagName;
  }
}

export class JsxClosingElement extends JsxOpeningElement {
  constructor(tagName: Expression) {
    super(tagName, [], [], {});
  }

  toString(options?: toStringOptions): string {
    return `</${this.processTagName(this.tagName).toString(options)}>`;
  }
}
