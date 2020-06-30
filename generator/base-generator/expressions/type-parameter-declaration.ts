import { Identifier } from "./common";
import { TypeExpression } from "./type";

export class TypeParameterDeclaration { 
    name: Identifier;
    constraint?: TypeExpression;
    defaultType?: TypeExpression;
    constructor(name: Identifier, constraint?: TypeExpression, defaultType?: TypeExpression) { 
        this.name = name;
        this.constraint = constraint;
        this.defaultType = defaultType;
    }

    toString() { 
        const constraint = this.constraint ? ` extends ${this.constraint}` : "";
        const defaultType = this.defaultType ? ` = ${this.defaultType}` : "";
        return `${this.name}${constraint}${defaultType}`;
    }
}
