import {
  Binary as BinaryBase,
  Prefix,
} from "../../base-generator/expressions/operators";
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
        `!${this.left.toString(options)}.current` ===
          this.right.toString(options)
      ) {
        return this.right.toString(options);
      }
    }
    if (
      this.right instanceof Prefix &&
      this.right.operand instanceof PropertyAccess
    ) {
      const rightExpression = this.right.operand.extractRefExpression(options);
      if (rightExpression) {
        const rightMember = rightExpression.getMember(options);
        const equalMembers = rightMember === dependencyMember;
        if (equalMembers) {
          return this.right.toString(options);
        }
      }
    }

    return super.toString(options);
  }
}
