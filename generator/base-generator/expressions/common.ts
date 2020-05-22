import { toStringOptions } from "../types";
import SyntaxKind from "../syntaxKind";
import { ExpressionWithExpression, Expression, SimpleExpression } from "./base";
import { TypeExpression } from "./type";

export class Identifier extends SimpleExpression {
    constructor(name: string) {
        super(name);
    }

    valueOf() {
        return this.expression;
    }

    toString(options?: toStringOptions) { 
        const baseValue = super.toString();
        if (options?.variables && options.variables[baseValue]) {
            if (options.variables[baseValue].toString() === baseValue) { 
                return baseValue;
            }
            return options.variables[baseValue].toString(options);    
        }
        return baseValue;
    }
}

export class TypeOf extends ExpressionWithExpression {
    toString(options?: toStringOptions) {
        return `${SyntaxKind.TypeOfKeyword} ${this.expression.toString(options)}`;
    }
}

export class Void extends ExpressionWithExpression {
    toString(options?: toStringOptions) {
        return `${SyntaxKind.VoidKeyword} ${this.expression.toString(options)}`;
    }
}


export class Delete extends ExpressionWithExpression {
    toString(options?: toStringOptions) {
        return `${SyntaxKind.DeleteKeyword} ${super.toString()}`;
    }
}

export class Paren extends ExpressionWithExpression {
    toString(options?: toStringOptions) {
        return `(${super.toString(options)})`;
    }
}

export class Call extends ExpressionWithExpression {
    typeArguments: any[];
    argumentsArray: Expression[];
    constructor(expression: Expression, typeArguments: any, argumentsArray: Expression[] = []) {
        super(expression);
        this.typeArguments = typeArguments;
        this.argumentsArray = argumentsArray;
    }

    get arguments() {
        return this.argumentsArray.map(a => a);
    }

    toString(options?: toStringOptions) {
        return `${this.expression.toString(options)}(${this.argumentsArray.map(a => a.toString(options)).join(",")})`;
    }

    getDependency() {
        const argumentsDependency = this.argumentsArray.reduce((d: string[], a) => {
            return d.concat(a.getDependency());
        }, []);
        return super.getDependency().concat(argumentsDependency);
    }
}

export class New extends Call {
    toString(options?: toStringOptions) {
        return `${SyntaxKind.NewKeyword} ${super.toString(options)}`;
    }
}

export class CallChain extends Call {
    questionDotToken: string;
    constructor(expression: Expression, questionDotToken: string = "", typeArguments: any, argumentsArray: Expression[] = []) {
        super(expression, typeArguments, argumentsArray);
        this.questionDotToken = questionDotToken;
    }

    toString(options?: toStringOptions) {
        return `${this.expression.toString(options)}${this.questionDotToken}(${this.argumentsArray.map(a => a.toString(options)).join(",")})`;
    }
}

export class NonNullExpression extends ExpressionWithExpression {
    toString(options?: toStringOptions) {
        return `${super.toString(options).replace(/[\?!]$/, '')}!`;
    }
}

export class AsExpression extends ExpressionWithExpression { 
    type: TypeExpression;
    constructor(expression: Expression, type: TypeExpression) {
        super(expression);
        this.type = type;
    }

    toString(options?: toStringOptions) { 
        return `${super.toString(options)} ${SyntaxKind.AsKeyword} ${this.type}`;
    }
}
