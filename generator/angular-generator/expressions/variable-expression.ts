import { VariableDeclaration as BaseVariableDeclaration } from "../../base-generator/expressions/variables";
import { toStringOptions } from "../../base-generator/types";

export class VariableDeclaration extends BaseVariableDeclaration {
  toString(options?: toStringOptions) {
    if (this.isJsx()) {
      return "";
    }
    if (this.initializer?.toString() === "this" && options?.members.length) {
      const members = options.members.filter(
        (member) => !member.canBeDestructured
      );
      options.variables = {
        ...options.variables,
        ...this.getVariables(members),
      };
    }
    return super.toString(options);
  }
}
