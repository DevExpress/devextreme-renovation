import { JsxElement as BaseJsxElement } from "../../../base-generator/expressions/jsx";
import { toStringOptions } from "../../../base-generator/types";
import { JsxOpeningElement } from "./jsx-opening-element";

export class JsxElement extends BaseJsxElement {
  toString(options?: toStringOptions) {
    const children: string = this.children
      .map((c) => {
        let str = "";
        if (
          c instanceof JsxElement &&
          c.openingElement.getTemplateProperty(options)
        ) {
          str = `{${c.openingElement.toString(options)}}`;
        } else if (
          c instanceof JsxOpeningElement &&
          c.getTemplateProperty(options)
        ) {
          str = `{${c.toString(options)}}`;
        } else {
          str = c.toString(options);
        }
        return str;
      })
      .join("\n");

    return `${this.openingElement.toString(
      options
    )}${children}${this.closingElement.toString(options)}`;
  }
}
