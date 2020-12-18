import { Method as ReactMethod } from "../../../react-generator/expressions/class-members/method";
import { toStringOptions } from "../../../base-generator/types";
import { compileType } from "../../../base-generator/utils/string";

export class Method extends ReactMethod {
  toString(options?: toStringOptions) {
    if (options) {
      return `${this.modifiers.join(" ")} ${
        this.name
      }${this.compileTypeParameters()}(${this.parameters})${compileType(
        this.type.toString()
      )}${this.body.toString(options)}`;
    }

    return super.toString();
  }
}
