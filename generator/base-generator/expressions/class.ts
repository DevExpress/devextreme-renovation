import { Identifier, Call } from "./common";
import { Property, Method } from "./class-members";
import { ExpressionWithTypeArguments } from "./type";
import { GeneratorContext } from "../types";
import { Decorator } from "./decorator";
import syntaxKind from "../syntaxKind";

export function inheritMembers(heritageClauses: HeritageClause[], members: Array<Property | Method>) {
    return heritageClauses.reduce((m, { members }) => {
        members = members.filter(inheritMember => m.every(m => m.name.toString() !== inheritMember.name.toString()));
        return m.concat(members);
    }, members);
}

export class HeritageClause {
    token: string;
    types: ExpressionWithTypeArguments[];
    members: Property[];
    defaultProps: string[] = [];

    get propsType() { 
        if (this.isJsxComponent) { 
            return this.types[0].typeArguments[0];
        }
        return this.types[0]
    }

    get typeNodes() {
        return this.types.map(t => t.typeNode);
    }

    get isJsxComponent() { 
        return this.types.some(t => t.isJsxComponent);
    }

    get isRequired() { 
        return this.types[0].typeArguments[0] && this.types[0].typeArguments[0].toString().startsWith("Required");
    }

    constructor(token: string, types: ExpressionWithTypeArguments[], context: GeneratorContext) {
        this.token = token;
        this.types = types;

        this.members = types.reduce((properties: Property[], typeExpression) => {
            const typeString = typeExpression.type.toString().replace("typeof ", "");
            if (context.components && context.components[typeString] && context.components[typeString]) {
                properties = properties.concat(context.components[typeString].heritageProperties)
            }
            return properties;
        }, []);
    }

    toString() {
        return `${this.token} ${this.types.map(t => t.toString())}`;
    }
}

export class Class {
    decorators: Decorator[];
    _name: Identifier;
    members: Array<Property | Method>;
    modifiers: string[];
    heritageClauses: HeritageClause[];

    get name() { 
        return this._name.toString();
    }

    processMembers(members: Array<Property | Method>) { 
        return members;
    }

    constructor(decorators: Decorator[], modifiers: string[] = [], name: Identifier, typeParameters: any[], heritageClauses: HeritageClause[] = [], members: Array<Property | Method>) {
        this._name = name;
        this.decorators = decorators;
        this.modifiers = modifiers;
        this.heritageClauses = heritageClauses;
        this.members = this.processMembers(members);
    }

    toString() {
        return `${this.decorators.join("\n")}
        ${this.modifiers.join(" ")} 
        class ${this.name} ${this.heritageClauses.length ? `${this.heritageClauses.join(" ")}` : ""} {
            ${this.members.join("\n")}
        }`;
    }
}

export interface Heritable {
    name: string;
    heritageProperties: Property[];
    compileDefaultProps(): string;
    defaultPropsDest(): string;
}
