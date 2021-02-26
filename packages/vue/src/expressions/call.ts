import SyntaxKind from "../../base-generator/syntaxKind";
import { Call as BaseCall } from "../../base-generator/expressions/common";
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
