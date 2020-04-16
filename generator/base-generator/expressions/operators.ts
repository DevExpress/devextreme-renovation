import { Expression } from "./base";
import { toStringOptions } from "../types";
import SyntaxKind from "../syntaxKind";
import { Property } from "./class-members";
import { PropertyAccess } from "./property-access";
import { checkDependency } from "../utils/dependency";

export class Binary extends Expression {
    left: Expression;
    operator: string;
    right: Expression;
    constructor(left: Expression, operator: string, right: Expression) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    toString(options?: toStringOptions) {
        const dependecyMember = checkDependency(this.left, options?.members);
        if (options &&
            this.operator === SyntaxKind.EqualsToken &&
            this.left instanceof PropertyAccess &&
            this.left.expression.toString().startsWith(SyntaxKind.ThisKeyword) &&
            dependecyMember) {

            if (dependecyMember.isReadOnly()) {
                throw `Error: Can't assign property use TwoWay() or Internal State - ${this.toString()}`;
            }
            const rightExpression = this.right.toString(options);

            return `${this.left.compileStateSetting(rightExpression, dependecyMember as Property, options)}`;
        }
        return `${this.left.toString(options)}${this.operator}${this.right.toString(options)}`;
    }

    getDependency() {
        if (this.operator === SyntaxKind.EqualsToken) {
            return this.right.getDependency();
        }
        return this.getAllDependency();
    }

    getAllDependency() {
        return this.left.getDependency().concat(this.right.getDependency());
    }
}

export class Prefix extends Expression {
    operator: string;
    operand: Expression;
    constructor(operator: string, operand: Expression) {
        super();
        this.operator = operator;
        this.operand = operand;
    }

    toString(options?: toStringOptions) {
        return `${this.operator}${this.operand.toString(options)}`;
    }

    getDependency() {
        return this.operand.getDependency();
    }
}

export class Postfix extends Prefix {
    toString(options?: toStringOptions) {
        return `${this.operand.toString(options)}${this.operator}`;
    }
}
