import { toStringOptions } from "../../types";
import { GetAccessor as BaseGetAccessor } from "../../../base-generator/expressions/class-members";
import { compileMethod } from "./method";

export class GetAccessor extends BaseGetAccessor {
  toString(options?: toStringOptions): string {
    return compileMethod(this, options);
  }

  getter(componentContext?: string) {
    return `${this.processComponentContext(
      componentContext
    )}${super.getter()}()`;
  }
}
