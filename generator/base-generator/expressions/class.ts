import { Identifier } from "./common";
import { Property, Method } from "./class-members";
import { ExpressionWithTypeArguments } from "./type";
import { GeneratorContext } from "../types";
import { Decorator } from "./decorator";

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
    get typeNodes() {
        return this.types.map(t => t.typeNode);
    }
    constructor(token: string, types: ExpressionWithTypeArguments[], context: GeneratorContext) {
        this.token = token;
        this.types = types;

        this.members = types.reduce((properties: Property[], { type }) => {
            if (context.components && context.components[type] && context.components[type]) {
                properties = properties.concat(context.components[type].heritageProperies)
            }
            return properties;
        }, []);

        this.defaultProps = types.reduce((defaultProps: string[], { type }) => {
            const importName = type;
            const component = context.components && context.components[importName]
            if (component && component.compileDefaultProps() !== "") {
                defaultProps.push(
                    `${component.defaultPropsDest().replace(component.name.toString(), importName)}${
                        type.indexOf("typeof ") === 0 ? "Type": ""
                    }`
                );
            }
            return defaultProps;
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

    processMembers(members: Array<Property | Method>, heritageClauses: HeritageClause[]) { 
        return members;
    }

    constructor(decorators: Decorator[], modifiers: string[] = [], name: Identifier, typeParameters: any[], heritageClauses: HeritageClause[] = [], members: Array<Property | Method>) {
        members = this.processMembers(members, heritageClauses);
        this.decorators = decorators;
        this._name = name;
        this.members = members;
        this.modifiers = modifiers;
        this.heritageClauses = heritageClauses;
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
    heritageProperies: Property[];
    compileDefaultProps(): string;
    defaultPropsDest(): string;
}
