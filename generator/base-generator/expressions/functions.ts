import { Expression } from "./base";
import { Decorator, Identifier } from "./common";
import { TypeExpression } from "./type";
import { toStringOptions, GeneratorContext } from "../types";
import { Block } from "./statements";
import { BindingPattern } from "./binding-pattern";
import { variableDeclaration, compileType } from "../utils/string";
import { Component } from "./component";

export class Parameter {
    decorators: Decorator[]
    modifiers: string[];
    dotDotDotToken: any;
    name: Identifier | BindingPattern;
    questionToken: string;
    type?: TypeExpression;
    initializer?: Expression;
    constructor(decorators: Decorator[], modifiers: string[], dotDotDotToken: any, name: Identifier | BindingPattern, questionToken: string = "", type?: TypeExpression, initializer?: Expression) {
        this.decorators = decorators;
        this.modifiers = modifiers;
        this.dotDotDotToken = dotDotDotToken;
        this.name = name;
        this.questionToken = questionToken;
        this.type = type;
        this.initializer = initializer;
    }

    typeDeclaration() {
        return variableDeclaration(this.name, this.type?.toString() || "any", undefined, this.questionToken);
    }

    declaration() {
        return variableDeclaration(this.name, this.type?.toString(), this.initializer, this.questionToken);
    }

    toString() {
        return this.name.toString();
    }
}

export class BaseFunction extends Expression { 
    modifiers: string[];
    typeParameters: string[];
    parameters: Parameter[];
    type?: TypeExpression;
    body: Block | Expression;
    context: GeneratorContext;

    constructor(modifiers: string[] = [], typeParameters: any, parameters: Parameter[], type: TypeExpression|undefined, body: Block | Expression, context: GeneratorContext) { 
        super();
        this.modifiers = modifiers;
        this.typeParameters = typeParameters;
        this.parameters = parameters;
        this.type = type;
        this.body = body;
        this.context = context;
    }

    getDependency() { 
        return this.body.getDependency();
    }

    getToStringOptions(options?: toStringOptions) { 
        const widget = this.parameters[0] && this.context.components?.[this.parameters[0].type?.toString() || ""];
        if (widget && widget instanceof Component) { 
            options = {
                members: widget.members.filter(m => m.decorators.find(d => d.name === "Template" || d.name === "Slot")),
                componentContext: this.parameters[0].name.toString(),
                newComponentContext: this.parameters[0].name.toString()
            };
        }
        return options;
    }
}

export class Function extends BaseFunction {
    decorators: Decorator[];
    asteriskToken: string;
    name?: Identifier;
    body: Block;
    constructor(decorators: Decorator[] = [], modifiers: string[]|undefined, asteriskToken: string, name: Identifier | undefined, typeParameters: any, parameters: Parameter[], type: TypeExpression|undefined, body: Block, context: GeneratorContext) {
        super(modifiers, typeParameters, parameters, type, body, context);
        this.decorators = decorators;
        this.asteriskToken = asteriskToken;
        this.name = name;
        this.body = body;
    }

    toString(options?: toStringOptions) {
        options = this.getToStringOptions(options);
        return `${this.modifiers.join(" ")} function ${this.name || ""}(${
            this.parameters.map(p => p.declaration()).join(",")
            })${compileType(this.type?.toString())}${this.body.toString(options)}`;
    }
}

export class ArrowFunction extends BaseFunction {
    typeParameters: string[];
    parameters: Parameter[];
    body: Block | Expression;
    equalsGreaterThanToken: string;
    constructor(modifiers: string[]|undefined, typeParameters: any, parameters: Parameter[], type: TypeExpression|undefined, equalsGreaterThanToken: string, body: Block | Expression, context: GeneratorContext) {
        super(modifiers, typeParameters, parameters, type, body, context);
        this.typeParameters = typeParameters;
        this.parameters = parameters;
        this.body = body;
        this.equalsGreaterThanToken = equalsGreaterThanToken;
    }

    toString(options?: toStringOptions) {
        const bodyString = this.body.toString(this.getToStringOptions(options));
        return `${this.modifiers.join(" ")} (${this.parameters.map(p => p.declaration()).join(",")})${compileType(this.type?.toString())} ${this.equalsGreaterThanToken} ${bodyString}`;
    }
}
