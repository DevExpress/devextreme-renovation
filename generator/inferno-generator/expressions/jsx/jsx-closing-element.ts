import { JsxClosingElement as ReactJsxClosingElement } from "../../../react-generator/expressions/jsx/jsx-closing-element";
import { Expression } from "../../../base-generator/expressions/base";
import { processTagName } from "./jsx-opening-element";

export class JsxClosingElement extends ReactJsxClosingElement {
  processTagName(tagName: Expression) {
    return processTagName(tagName);
  }
}
