import { Decorator, Identifier } from "./common";
import { TypeExpression } from "./type";
import { Expression, SimpleExpression } from "./base";
import { toStringOptions } from "../types";
import { Parameter } from "./functions";
import { Block } from "./statements";
import { compileType } from "../utils/string";

export class BaseClassMember extends Expression { 
    decorators: Decorator[];
    modifiers: string[];
    _name: Identifier;
    type: TypeExpression;
    inherited: boolean;

    prefix: string = "";

    constructor(decorators: Decorator[] = [], modifiers: string[] = [], name: Identifier, type: TypeExpression = new SimpleExpression(""), inherited: boolean = false) { 
        super();
        this.decorators = decorators;
        this.modifiers = modifiers;
        this._name = name;
        this.type = type;
        this.inherited = inherited;
    }

    get name(): string { 
        return `${this.prefix}${this._name}`;
    }

    getter() { 
        return this.name;
    }

    isReadOnly() { 
        return true;
    }

}

export class Method extends BaseClassMember {
    asteriskToken?: string;
    questionToken: string;
    typeParameters: any;
    parameters: Parameter[];
    body: Block;
   
    constructor(decorators: Decorator[] = [], modifiers: string[] = [], asteriskToken: string | undefined, name: Identifier, questionToken: string = "", typeParameters: any[], parameters: Parameter[], type: TypeExpression = new SimpleExpression("any"), body: Block) {
        super(decorators, modifiers, name, type);
        this.asteriskToken = asteriskToken;
        this.questionToken = questionToken;
        this.typeParameters = typeParameters;
        this.parameters = parameters;
        this.body = body;
    }

    parametersTypeDeclaration() {
        return this.parameters.map(p => p.declaration()).join(",");
    }

    typeDeclaration() {
        return `${this.name}${this.questionToken}:(${this.parameters.map(p => p.typeDeclaration()).join(",")})=>${this.type}`
    }

    declaration(options?: toStringOptions) {
        return `function ${this.name}(${this.parametersTypeDeclaration()})${this.body.toString(options)}`;
    }

    arrowDeclaration(options?:any) {
        return `(${this.parametersTypeDeclaration()})=>${this.body.toString(options)}`
    }

    getDependency(properties: Property[] = []) {
        const dependency = this.body.getDependency();
        const additionalDependency = [];

        if (dependency.find(d => d === "props")) { 
            additionalDependency.push("props");
        }

        const result = [...new Set(dependency)]
            .map(d => properties.find(p => p.name.toString() === d))
            .filter(d => d)
            .reduce((d: string[], p) => d.concat(p!.getDependency()), [])
            .concat(additionalDependency);
        
        if (additionalDependency.indexOf("props") > -1) { 
            return result.filter(d => !d.startsWith("props."));
        }
        
        return result;
    }

    toString(options?: toStringOptions) { 
        return `${this.decorators.join(" ")} ${this.modifiers.join(" ")} ${this.name}(${
            this.parameters.map(p => p.declaration()).join(",")
            })${compileType(this.type.toString())}${this.body.toString(options)}`;
    }
}

export class GetAccessor extends Method { 
    constructor(decorators: Decorator[] = [], modifiers: string[] = [], name: Identifier, parameters: Parameter[], type?: TypeExpression, body?: Block) { 
        super(decorators, modifiers, "", name, "", [], parameters, type, body || new Block([], false));
    }

    typeDeclaration() { 
        return `${this._name}:${this.type}`;
    }

    getter() { 
        return `${this.name}`;
    }

    toString(options?: toStringOptions) { 
        return `get ${this.name}()${this.body.toString(options)}`;
    }
}

export class Property extends BaseClassMember {
    questionOrExclamationToken: string;
    initializer?: Expression;

    get name(): string {
        if (this.decorators.find(d => d.name === "Template")) {
            return this._name.toString().replace(/template/g, "render")
                .replace(/(.+)(Template)/g, "$1Render");
        }
        if (this.decorators.find(d => d.name === "Slot") && this._name.toString() === "default") {
            return "children";
        }
        return super.name;
    }

    constructor(decorators: Decorator[] = [], modifiers: string[] = [], name: Identifier, questionOrExclamationToken: string = "", type: TypeExpression = new SimpleExpression("any"), initializer?: Expression, inherited: boolean = false) {
        super(decorators, modifiers, name, type, inherited);
        this.questionOrExclamationToken = questionOrExclamationToken;
        this.initializer = initializer;
    }

    typeDeclaration() {
        return `${this.name}${this.questionOrExclamationToken}:${this.type}`;
    }

    defaultDeclaration() {
        return `${this.name}:${this.initializer}`;;
    }

    getter() {
        return this._name.toString();
    }

    isReadOnly() {
        return !!this.decorators.find(d => d.name === "OneWay" || d.name === "Event");
    }

    inherit() { 
        return new Property(this.decorators, this.modifiers, this._name, this.questionOrExclamationToken, this.type, this.initializer, true);
    }

    toString() { 
        return `${this.modifiers.join(" ")} ${this.decorators.map(d => d.toString()).join(" ")} ${this.typeDeclaration()} ${this.initializer && this.initializer.toString() ? `= ${this.initializer.toString()}` : ""}`;
    }

    get isInternalState() { 
        return this.decorators.some(d => d.name === "InternalState") || this.decorators.length === 0;
    }

    get isEvent() { 
        return this.decorators.some(d => d.name === "Event");
    }
}
