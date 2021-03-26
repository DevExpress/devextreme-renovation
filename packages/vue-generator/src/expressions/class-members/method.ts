import {
  Method as BaseMethod,
  GetAccessor,
} from "@devextreme-generator/core";
import { toStringOptions } from "../../types";

export function compileMethod(
  expression: Method | GetAccessor,
  options?: toStringOptions
): string {
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
