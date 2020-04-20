import { Expression, ExpressionWithExpression } from "./base";
import { toStringOptions } from "../types";
import { Identifier } from "./common";
import SyntaxKind from "../syntaxKind";
import { Property } from "./class-members";

export class ElementAccess extends ExpressionWithExpression {
    index: Expression;
    constructor(expression: Expression, index: Expression) {
        super(expression);
        this.index = index;
    }

    toString(options?: toStringOptions) {
        return `${super.toString(options)}[${this.index.toString(options)}]`;
    }

    getDependency() {
        return super.getDependency().concat(this.index.getDependency());
    }
}

export class ComputedPropertyName extends ExpressionWithExpression {
    toString(options?: toStringOptions) {
        return `[${super.toString(options)}]`;
    }
}

export class PropertyAccess extends ExpressionWithExpression {
    name: Identifier
    constructor(expression: Expression, name: Identifier) {
        super(expression);
        this.name = name;
    }

    toString(options?: toStringOptions) {
        const expressionString = this.expression.toString();
        const componentContext = options?.componentContext || SyntaxKind.ThisKeyword;
        const usePropsSpace = `${componentContext}.props`;
        if (expressionString === componentContext || expressionString === usePropsSpace) {
            const member = options?.members
                .filter(m => expressionString === usePropsSpace ? m.inherited : true)
                .find(m => m._name.toString() === this.name.toString());
            if (member) { 
                return `${options?.newComponentContext ? `${options.newComponentContext}.` : ""}${member.getter()}`;
            }
        }

        const result = `${this.expression.toString(options)}.${this.name}`;

        if (options?.newComponentContext !== undefined && result.startsWith(componentContext)) {
            if (options.newComponentContext === "") { 
                return this.name.toString();
            }
            return result.replace(options.componentContext!, options.newComponentContext);
        }

        return result;
    }

    compileStateSetting(state: string, property: Property, options?: toStringOptions) {
        return `this.${property.getter()}=${state}`;
    }

    getDependency(options?: toStringOptions) {
        const expressionString = this.expression.toString();
        const componentContext = options?.componentContext || SyntaxKind.ThisKeyword;
        if ((expressionString === componentContext && this.name.toString() !== "props") || expressionString === `${componentContext}.props`) {
            return [this.name.toString()];
        }
        const dependecy = this.expression.getDependency();
        if (this.toString() === `${componentContext}.props` && dependecy.length === 0) {
            return ["props"];
        }
        return dependecy;
    }
}

export class PropertyAccessChain extends ExpressionWithExpression {
    questionDotToken: string;
    name: Expression;
    constructor(expression: Expression, questionDotToken: string = SyntaxKind.DotToken, name: Expression) {
        super(expression);
        this.questionDotToken = questionDotToken;
        this.name = name;
    }

    toString(options?: toStringOptions) {
        const replaceMark = this.questionDotToken === SyntaxKind.QuestionDotToken;
        const firstPart = this.expression.toString(options);

        return `${replaceMark ? firstPart.replace(/[\?!]$/, '') : firstPart}${this.questionDotToken}${this.name.toString(options)}`;
    }

    getDependency() {
        return super.getDependency().concat(this.name.getDependency());
    }
}

export class Spread extends ExpressionWithExpression { 
    toString(options?: toStringOptions) { 
        return `${SyntaxKind.DotDotDotToken}${super.toString(options)}`;
    }
}