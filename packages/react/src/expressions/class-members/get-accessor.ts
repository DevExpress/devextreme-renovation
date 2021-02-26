import { GetAccessor as BaseGetAccessor } from "../../../base-generator/expressions/class-members";
import { calculateMethodDependency } from "./method";
import { toStringOptions } from "../../../base-generator/types";

export class GetAccessor extends BaseGetAccessor {
  getter(componentContext?: string) {
    return `${super.getter(componentContext)}()`;
  }

  getDependency(options: toStringOptions) {
    return calculateMethodDependency(
      super.getDependency(options),
      options.members
    );
  }
}
