import { GetAccessor as ReactGetAccessor } from "../../../react-generator/expressions/class-members/get-accessor";

export class GetAccessor extends ReactGetAccessor {
  getter(componentContext?: string) {
    return super.getter(componentContext).replace("()", "");
  }
}
