import { SimpleExpression, Expression } from "./base";
import { PropertyAssignment, ShorthandPropertyAssignment, SpreadAssignment } from "./property-assignment";
import { Identifier } from "./common";

export class StringLiteral extends SimpleExpression {
    quoteSymbol: string;
    constructor(value: string, quoteSymbol = '"') {
        super(value);
        this.quoteSymbol = quoteSymbol;
    }
    toString() {
        return `${this.quoteSymbol}${this.expression}${this.quoteSymbol}`;
    }
    valueOf() { 
        return this.expression;
    }
}

export class ArrayLiteral extends Expression {
    elements: Expression[];
    multiLine: boolean;
    constructor(elements: Expression[], multiLine: boolean) {
        super();
        this.elements = elements;
        this.multiLine = multiLine;
    }

    toString() {
        return `[${this.elements.join(",")}]`;
    }
}

export class ObjectLiteral extends Expression {
    properties: Array<PropertyAssignment | ShorthandPropertyAssignment | SpreadAssignment>;
    multiLine: boolean;
    constructor(properties: Array<PropertyAssignment | ShorthandPropertyAssignment | SpreadAssignment>, multiLine: boolean) {
        super();
        this.properties = properties;
        this.multiLine = multiLine;
    }

    getProperty(propertyName: string) {
        const property = this.properties.find(p => p.key && p.key.toString() === propertyName);
        if (property) {
            return property.value;
        }
    }

    setProperty(propertyName: string, value: Expression) { 
        this.properties.push(
            new PropertyAssignment(
                new Identifier(propertyName),
                value
            )
        )
    }

    removeProperty(propertyName: string) { 
        this.properties = this.properties.filter(p => p.key?.toString() !== propertyName);
    }

    toString(options?:any) {
        return `{${this.properties.map(p => p.toString(options)).join(`,\n`)}}`;
    }

    getDependency() {
        return this.properties.reduce((d: string[], p) => d.concat(p.getDependency()), []);
    }
}
