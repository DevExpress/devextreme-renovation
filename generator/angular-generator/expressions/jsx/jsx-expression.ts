import { JsxExpression as BaseJsxExpression } from "../../../base-generator/expressions/jsx";
import { Expression } from "../../../base-generator/expressions/base";
import { Call } from "../../../base-generator/expressions/common";
import { BaseFunction } from "../../../base-generator/expressions/functions";
import { PropertyAccessChain, PropertyAccess } from "../../../base-generator/expressions/property-access";
import { toStringOptions } from "../../types";

export class JsxExpression extends BaseJsxExpression {
    getIterator(expression: Expression): BaseFunction| undefined {
        if (expression instanceof Call &&
            (expression.expression instanceof PropertyAccess ||
                expression.expression instanceof PropertyAccessChain) &&
            expression.expression.name.toString() === "map") {
            const iterator = expression.arguments[0];
            if (iterator instanceof BaseFunction) {
                return iterator;
            }
        }
        return;
    }

    toString(options?: toStringOptions) {
        const expression = this.getExpression(options);
        return expression ? expression.toString(options) : "";
    }
}
