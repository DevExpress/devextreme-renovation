import { Identifier } from "./common";
import { TypeExpression } from "./type";
import { Expression, SimpleExpression } from "./base";
import { toStringOptions } from "../types";
import { Parameter } from "./functions";
import { Block } from "./statements";
import { compileType, processComponentContext } from "../utils/string";
import { Decorator } from "./decorator";

export class BaseClassMember extends Expression { 
    decorators: Decorator[];
    modifiers: string[];
    _name: Identifier;
    type: TypeExpression;
    inherited: boolean;

    required: boolean = false;

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

    processComponentContext(componentContext?: string) { 
        return processComponentContext(componentContext);
    }

    getter(componentContext?: string) { 
        return `${this.processComponentContext(componentContext)}${this.name}`;
    }

    isReadOnly() { 
        return true;
    }


    get isInternalState() { 
        return false;
    }

    get isEvent() { 
        return this.decorators.some(d => d.name === "Event");
    }

    get isState() { 
        return this.decorators.some(d => d.name === "TwoWay");
    }

    get isRef() { 
        return this.decorators.some(d => d.name === "Ref");
    }

    get canBeDestructured() { 
        if (this.required) { 
            return false;
        }
        return this.name === this._name.toString();
    } 

    getDependency() { 
        return [this.name];
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

    typeDeclaration() {
        return `${this.name}${this.questionToken}:(${this.parameters.map(p => p.typeDeclaration()).join(",")})=>${this.type}`
    }

    declaration(options?: toStringOptions) {
        return `function ${this.name}(${this.parameters})${this.body.toString(options)}`;
    }

    arrowDeclaration(options?:any) {
        return `(${this.parameters})=>${this.body.toString(options)}`
    }

    getDependency(members: Array<Property | Method> = []) {
        const dependency = this.body.getDependency();
        const additionalDependency = [];

        if (dependency.find(d => d === "props")) {
            additionalDependency.push("props");
        }

        const result: string[] = [...new Set(dependency)]
            .map(d => members.find(p => p.name.toString() === d))
            .filter(d => d)
            .reduce((d: string[], p) => d.concat(p!.getDependency(members.filter(p => p !== this))), [])
            .concat(additionalDependency);
        
        if (additionalDependency.indexOf("props") > -1) { 
            return result.filter(d => !d.startsWith("props."));
        }
        
        return [...new Set(result)];
    }

    toString(options?: toStringOptions) { 
        return `${this.decorators.join(" ")} ${this.modifiers.join(" ")} ${this.name}(${this.parameters})${compileType(this.type.toString())}${this.body.toString(options)}`;
    }
}

export class GetAccessor extends Method { 
    constructor(decorators: Decorator[] = [], modifiers: string[] = [], name: Identifier, parameters: Parameter[], type?: TypeExpression, body?: Block) { 
        super(decorators, modifiers, "", name, "", [], parameters, type, body || new Block([], false));
    }

    typeDeclaration() { 
        return `${this._name}:${this.type}`;
    }

    getter(componentContext?: string) { 
        return `${this.processComponentContext(componentContext)}${this.name}`;
    }

    toString(options?: toStringOptions) { 
        return `get ${this.name}()${compileType(this.type.toString())}${this.body.toString(options)}`;
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

    getter(componentContext?: string) {
        return `${this.processComponentContext(componentContext)}${this._name.toString()}`;
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
}
