import { PropertyAccessChain as BasePropertyAccessChain } from "../../angular-generator/expressions/property-access-chain";
import { Property } from "./class-members/property";

export class PropertyAccessChain extends BasePropertyAccessChain {
  getRefAccessor(member: Property) {
    if (
      member.isRef ||
      member.isForwardRef ||
      member.isForwardRefProp ||
      member.isRefProp ||
      member.isApiRef
    ) {
      return "";
    }
    return null;
  }
}
