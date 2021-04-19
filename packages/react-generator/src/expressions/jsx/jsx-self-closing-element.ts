import { toStringOptions } from '@devextreme-generator/core';
import { JsxOpeningElement } from './jsx-opening-element';

export class JsxSelfClosingElement extends JsxOpeningElement {
  toString(options?: toStringOptions) {
    if (this.getTemplateProperty(options)) {
      return super.toString(options);
    }
    return `<${this.processTagName(this.tagName).toString(
      options,
    )} ${this.attributesString(options)}/>`;
  }
}
