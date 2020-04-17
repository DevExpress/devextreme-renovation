import { toStringOptions, GeneratorContext } from "../types";
import SyntaxKind from "../syntaxKind";
import { ExpressionWithExpression, Expression, SimpleExpression } from "./base";
import { TypeExpression } from "./type";
import { ArrowFunction, Function } from "./functions";
import { ObjectLiteral } from "./literal";

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

export class Decorator {
    expression: Call;
    context: GeneratorContext;
    viewParameter?: Expression | null;

    constructor(expression: Call, context: GeneratorContext) {
        this.expression = expression;
        this.context = context;
        if (this.name === "Component") { 
            this.viewParameter = this.getParameter("view");
        }
    }

    addParameter(name: string, value: Expression) {
        const parameters = (this.expression.arguments[0] as ObjectLiteral);
        parameters.setProperty(name, value);
    }

    getParameter(name: string) { 
        const parameters = (this.expression.arguments[0] as ObjectLiteral);
        return parameters.getProperty(name);
    }

    getViewFunction() {
        const viewFunctionValue = this.viewParameter
        let viewFunction: ArrowFunction | Function | null = null;
        if (viewFunctionValue instanceof Identifier) {
            viewFunction = this.context.viewFunctions ? this.context.viewFunctions[viewFunctionValue.toString()] : null;
        }

        return viewFunction
    }

    get name() {
        return this.expression.expression.toString();
    }

    toString() {
        return `@${this.expression.toString()}`;
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
