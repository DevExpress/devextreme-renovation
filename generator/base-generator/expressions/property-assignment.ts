import { Expression, ExpressionWithOptionalExpression, ExpressionWithExpression } from "./base";
import { toStringOptions } from "../types";
import { Identifier } from "./common";

export class PropertyAssignment extends Expression {
    key: Identifier;
    value: Expression;
    constructor(key: Identifier, value: Expression) {
        super();
        this.key = key;
        this.value = value;
    }
    toString(options?: toStringOptions) {
        return `${this.key}:${this.value.toString(options)}`;
    }

    getDependency() {
        return this.value.getDependency();
    }
}

export class ShorthandPropertyAssignment extends ExpressionWithOptionalExpression {
    name: Identifier;

    constructor(name: Identifier, expression?: Expression) {
        super(expression);
        this.name = name;
    }

    get key() {
        return this.name;
    }

    get value() {
        return this.expression ? this.expression : this.name;
    }

    toString(options?: toStringOptions) {
        let expression = this.expression ? `:${super.toString(options)}` : "";
        if (!expression && options?.variables?.[this.name.toString()]) { 
            expression = `:${options.variables[this.name.toString()].toString(options)}`;
        }

        return `${this.name}${expression}`;
    }

}

export class SpreadAssignment extends ExpressionWithExpression {
    key: null = null;
    value: null = null;

    toString(options?: toStringOptions) {
        return `...${this.expression.toString(options)}`;
    }
}
