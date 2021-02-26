import { VariableDeclaration as BaseVariableDeclaration } from "../../base-generator/expressions/variables";
import { toStringOptions } from "../../base-generator/types";

export class VariableDeclaration extends BaseVariableDeclaration {
  toString(options?: toStringOptions) {
    if (this.isJsx()) {
      return "";
    }
    return super.toString(options);
  }
}
