import { IExpression, toStringOptions } from "../types";

export class Expression implements IExpression {
    getDependency(): string[] {
        return [];
    }

    toString(options?: toStringOptions) {
        return "";
    }

    getAllDependency() {
        return this.getDependency();
    }

    isJsx() { 
        return false;
    }
}

export class SimpleExpression extends Expression {
    expression: string;
    constructor(expression: string) {
        super();
        this.expression = expression;
    }

    toString() {
        return this.expression;
    }
}

export class ExpressionWithExpression extends Expression {
    expression: Expression;

    constructor(expression: Expression) {
        super();
        this.expression = expression || new Expression();
    }

    toString(options?: toStringOptions) {
        return this.expression.toString(options);
    }

    getDependency() {
        return this.expression.getDependency();
    }

    isJsx() { 
        return this.expression.isJsx();
    }
}

export class ExpressionWithOptionalExpression extends Expression {
    expression?: Expression;

    constructor(expression?: Expression) {
        super();
        this.expression = expression;
    }

    toString(options?: toStringOptions) {
        return this.expression ? this.expression.toString(options) : "";
    }

    isJsx() { 
        return this.expression?.isJsx() || false;
    }

    getDependency() {
        return this.expression && this.expression.getDependency() || [];
    }
}
