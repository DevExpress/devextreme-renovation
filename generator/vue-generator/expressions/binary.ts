import { Binary as BinaryBase } from "../../base-generator/expressions/operators";
import { toStringOptions } from "../types";
import { PropertyAccess } from "./property-access";

export class Binary extends BinaryBase {
  toString(options?: toStringOptions) {
    const dependencyMember =
      this.left instanceof PropertyAccess && this.left.getMember(options);

    if (
      dependencyMember &&
      (dependencyMember.isRef ||
        dependencyMember.isForwardRef ||
        dependencyMember.isRefProp ||
        dependencyMember.isForwardRefProp)
    ) {
      if (
        this.operator === "&&" &&
        `!${this.left.toString(options)}` === this.right.toString(options)
      ) {
        return this.right.toString(options);
      }
    }

    return super.toString(options);
  }
}
