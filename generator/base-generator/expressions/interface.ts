import { Expression } from "./base";
import { Decorator } from "./decorator";
import { Identifier } from "./common";
import { HeritageClause } from "./class";
import { PropertySignature, MethodSignature } from "./type";

export class Interface extends Expression { 
    decorators: Decorator[];
    modifiers: string[];
    name: Identifier;
    typeParameters?: any[];
    heritageClauses: HeritageClause[];
    members: Array<PropertySignature | MethodSignature>;

    constructor(
        decorators: Decorator[] = [],
        modifiers: string[] = [],
        name: Identifier,
        typeParameters: any[] | undefined,
        heritageClauses: HeritageClause[] = [],
        members: Array<PropertySignature | MethodSignature>
    ) { 
        super();
        this.decorators = decorators;
        this.modifiers = modifiers;
        this.name = name;
        this.typeParameters = typeParameters;
        this.heritageClauses = heritageClauses;
        this.members = members;
    }

    toString() { 
        return `
            ${this.decorators.join("\n")}
            ${this.modifiers.join(" ")} interface ${this.name} ${this.heritageClauses.join(" ")} {
                ${this.members.join(";\n")}
            }`;
    }
}
