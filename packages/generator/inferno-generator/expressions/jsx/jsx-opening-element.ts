import { JsxOpeningElement as ReactJsxOpeningElement } from "../../../react-generator/expressions/jsx/jsx-opening-element";
import { Expression } from "../../../base-generator/expressions/base";

export const processTagName = (tagName: Expression) => tagName;

export class JsxOpeningElement extends ReactJsxOpeningElement {
  processTagName(tagName: Expression) {
    return processTagName(tagName);
  }
}
