import { JsxElement as BaseJsxElement } from "../../../base-generator/expressions/jsx";
import { toStringOptions } from "../../../base-generator/types";
import { JsxOpeningElement } from "./jsx-opening-element";

export class JsxElement extends BaseJsxElement {
  toString(options?: toStringOptions) {
    let str: string;
    if (this.openingElement.getTemplateProperty(options)) {
      str = this.openingElement.toString(options);
    } else {
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
          } else if (typeof c === "string") {
            str = c.trim();
          } else {
            str = c.toString(options);
          }
          return str;
        })
        .join("\n");

      str = `${this.openingElement.toString(
        options
      )}${children}${this.closingElement.toString(options)}`;
    }
    return str;
  }
}
