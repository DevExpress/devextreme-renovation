import { VariableDeclaration as VariableDeclarationBase } from "../../base-generator/expressions/variables";
import { toStringOptions } from "../../base-generator/types";

export class VariableDeclaration extends VariableDeclarationBase {
  toString(options?: toStringOptions) {
    if (this.initializer?.toString() === "this" && options?.members.length) {
      options.variables = {
        ...options.variables,
        ...this.getVariables(options.members),
      };
    }
    return super.toString(options);
  }
}
