import { AngularBaseFunction } from "./angular-base-function";
import { toStringOptions } from "../../types";

export class Function extends AngularBaseFunction {
  toString(options?: toStringOptions) {
    if (this.isJsx()) {
      return "";
    }
    return super.toString(options);
  }
}
