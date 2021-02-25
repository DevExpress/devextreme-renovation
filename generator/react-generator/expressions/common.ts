import {
  New as BaseNew,
  Identifier,
} from "../../base-generator/expressions/common";
import { toStringOptions } from "../../base-generator/types";
import { Conditional } from "../../base-generator/expressions/conditions";
import { PropertyAccess } from "../../base-generator/expressions/property-access";

export class New extends BaseNew {
  toString(options?: toStringOptions) {
    const componentInputs = options?.componentInputs || [];
    if (componentInputs.length) {
      const matchedInput = componentInputs.find(
        (c) => c.name === this.expression.toString()
      );
      if (matchedInput?.isNested) {
        const conditional = new Conditional(
          new PropertyAccess(
            this.expression,
            new Identifier("__defaultNestedValues")
          ),
          new PropertyAccess(
            this.expression,
            new Identifier("__defaultNestedValues()")
          ),
          this.expression
        );
        return conditional.toString();
      }
      if (matchedInput) {
        return this.expression.toString();
      }
    }
    return super.toString(options);
  }
}
