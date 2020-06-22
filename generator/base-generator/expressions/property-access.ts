import { Expression, ExpressionWithExpression } from "./base";
import { toStringOptions } from "../types";
import { Identifier } from "./common";
import SyntaxKind from "../syntaxKind";
import { Property } from "./class-members";
import { getProps } from "./component";
import { processComponentContext } from "../utils/string";
import { BindingElement } from "./binding-pattern";

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

    processProps(result: string, options: toStringOptions, elements: BindingElement[] = []) {
        return result;
    }

    checkPropsAccess(result: string, options?: toStringOptions) { 
        return result === `${processComponentContext(options?.componentContext)}props`;
    }

    calculateComponentContext(options?: toStringOptions) {
        return options?.componentContext !== undefined ? options?.componentContext : SyntaxKind.ThisKeyword;
    }

    getMembers(options?: toStringOptions) { 
        const expressionString = this.expression.toString({
            members: [],
            variables: {
                ...options?.variables
            }
        });
        const componentContext = this.calculateComponentContext(options);
        const usePropsSpace = `${processComponentContext(componentContext)}props`;
        if (expressionString === componentContext || expressionString === usePropsSpace) {
            const props = getProps(options?.members || []);
            return options?.members
                .filter(m =>
                    expressionString === usePropsSpace
                        ? m instanceof Property && props.indexOf(m) > -1 :
                        m instanceof Property && props.indexOf(m) || true
                )
        }
    }

    getMember(options?: toStringOptions) { 
        return this.getMembers(options)?.find(m => m._name.toString() === this.name.toString());
    }

    toString(options?: toStringOptions, elements: BindingElement[] = []) {
        const member = this.getMember(options);
        if (member) {
            return `${member.getter(options!.newComponentContext)}`;
        }

        const result = `${this.expression.toString(options)}.${this.name}`;
        const context = this.calculateComponentContext(options);

        if (options?.newComponentContext !== undefined && result.startsWith(`${context}.`)) {
            const value = options?.newComponentContext === ""
                ? result.replace(`${context}.`, options.newComponentContext)
                : result.replace(context, options.newComponentContext);

            if (this.checkPropsAccess(result, options)) { 
                return this.processProps(value, options, elements);
            }

            return options?.newComponentContext === "" ? this.name.toString() : value;
        }

        return result;
    }

    compileStateSetting(state: string, property: Property, options?: toStringOptions) {
        return `this.${property.name}=${state}`;
    }

    getDependency(options?: toStringOptions) {
        const expressionString = this.expression.toString();
        const componentContext = options?.componentContext || SyntaxKind.ThisKeyword;
        if ((expressionString === componentContext && this.name.toString() !== "props") || expressionString === `${componentContext}.props`) {
            return [this.name.toString()];
        }
        const dependency = this.expression.getDependency();
        if (this.toString() === `${componentContext}.props` && dependency.length === 0) {
            return ["props"];
        }
        return dependency;
    }

    isPropsScope(options?: toStringOptions) {
        if (this.expression instanceof PropertyAccess &&
            this.expression.expression.toString(options) === options?.componentContext &&
            this.expression.name.toString() === "props"
        ) { 
            return true;
        }
        return false;
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