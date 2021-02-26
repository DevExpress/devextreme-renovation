import { SyntaxKind, Call as BaseCall } from "@devextreme-generator/core";
import { toStringOptions } from "../types";
export class Call extends BaseCall {
  compileTypeArguments() {
    return "";
  }
}
export class New extends Call {
  toString(options?: toStringOptions) {
    return `${SyntaxKind.NewKeyword} ${super.toString(options)}`;
  }
}
