import { Expression } from "./base";
import { toStringOptions } from "../types";
import SyntaxKind from "../syntaxKind";
import { Property } from "./class-members";
import { PropertyAccess } from "./property-access";
import { checkDependency } from "../utils/dependency";

const isShortOperator = (operator: string) => {
    return operator === SyntaxKind.PlusEqualsToken
        || operator === SyntaxKind.MinusEqualsToken
        || operator === SyntaxKind.SlashEqualsToken
        || operator === SyntaxKind.AsteriskEqualsToken;
}

const unaryPlusOrMinus = (operator: string) => {
  return operator === SyntaxKind.PlusPlusToken
      || operator === SyntaxKind.MinusMinusToken;
}

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
        const dependencyMember = checkDependency(this.left, options?.members);
        if (options &&
            this.left instanceof PropertyAccess &&
            this.left.expression.toString().startsWith(SyntaxKind.ThisKeyword) &&
            dependencyMember) {

            let rightExpression;

            if (this.operator === SyntaxKind.EqualsToken) {
                rightExpression = this.right.toString(options);
            }

            if (isShortOperator(this.operator)) {
                const operator = this.operator[0] ;
                rightExpression = `${this.left.toString(options)}${operator}${this.right.toString(options)}`;
            }

            if (rightExpression) {
                if (dependencyMember.isReadOnly()) {
                    throw `Error: Can't assign property use TwoWay() or Internal State - ${this.toString()}`;
                }

                return `${this.left.compileStateSetting(rightExpression, dependencyMember as Property, options)}`;
            }
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

    compileUnaryMath(options?: toStringOptions) {
        const dependencyMember = checkDependency(this.operand, options?.members);
        if (unaryPlusOrMinus(this.operator) && 
            this.operand instanceof PropertyAccess &&
            this.operand.expression.toString().startsWith(SyntaxKind.ThisKeyword) &&
            dependencyMember
        ) {
            if (dependencyMember.isReadOnly()) {
                throw `Error: Can't assign property use TwoWay() or Internal State - ${this.toString()}`;
            }
            const operator = this.operator[0] ;
            const rightExpression = `${this.operand.toString(options)}${operator}${1}`;
            return `${this.operand.compileStateSetting(rightExpression, dependencyMember as Property, options)}`;
        }
        return '';
    }

    toString(options?: toStringOptions) {
        const unaryMath = this.compileUnaryMath(options);
        if (unaryMath) return unaryMath;

        return `${this.operator}${this.operand.toString(options)}`;
    }

    getDependency() {
        return this.operand.getDependency();
    }
}

export class Postfix extends Prefix {
    toString(options?: toStringOptions) {
        const unaryMath = this.compileUnaryMath(options);
        if (unaryMath) return unaryMath;

        return `${this.operand.toString(options)}${this.operator}`;
    }
}
