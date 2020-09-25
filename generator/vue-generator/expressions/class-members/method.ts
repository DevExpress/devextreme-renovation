import {
  Method as BaseMethod,
  GetAccessor,
} from "../../../base-generator/expressions/class-members";
import { toStringOptions } from "../../types";

export function compileMethod(
  expression: Method | GetAccessor,
  options?: toStringOptions
): string {
  if (expression.name === "props") {
    options = options || { members: [] };
    options.keepRef = true;
  }
  return `${expression.name}(${
    expression.parameters
  })${expression.body.toString(options)}`;
}

export class Method extends BaseMethod {
  toString(options?: toStringOptions): string {
    if (!options) {
      return `${this.name}(${this.parameters})${this.body.toString()}`;
    }
    return compileMethod(this, options);
  }
}
