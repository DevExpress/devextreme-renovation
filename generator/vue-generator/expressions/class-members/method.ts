import {
  Method as BaseMethod,
  GetAccessor,
} from "../../../base-generator/expressions/class-members";
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
    return compileMethod(this, options);
  }
}
