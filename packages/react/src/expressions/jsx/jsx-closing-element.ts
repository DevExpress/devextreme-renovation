import { JsxOpeningElement } from "./jsx-opening-element";
import { Expression } from "../../../base-generator/expressions/base";
import { toStringOptions } from "../../../base-generator/types";

export class JsxClosingElement extends JsxOpeningElement {
  constructor(tagName: Expression) {
    super(tagName, [], [], {});
  }

  toString(options?: toStringOptions) {
    return `</${this.processTagName(this.tagName).toString(options)}>`;
  }
}
