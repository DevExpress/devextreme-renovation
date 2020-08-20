import { GetAccessor as BaseGetAccessor } from "../../../base-generator/expressions/class-members";
import { Property } from "./property";
import { Method, calculateMethodDependency } from "./method";

export class GetAccessor extends BaseGetAccessor {
  getter() {
    return `${super.getter()}()`;
  }

  getDependency(members: Array<Property | Method>) {
    return calculateMethodDependency(super.getDependency(members), members);
  }
}
