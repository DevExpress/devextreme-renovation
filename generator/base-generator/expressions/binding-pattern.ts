import { Expression, SimpleExpression } from "./base";
import { Identifier } from "./common";
import { VariableExpression } from "../types";
import { ElementAccess, PropertyAccess } from "./property-access";

export class BindingElement extends Expression {
    dotDotDotToken?: string;
    propertyName?: Identifier;
    name: string | Identifier | BindingPattern;
    initializer?: Expression;
    constructor(dotDotDotToken: string = "", propertyName: Identifier | undefined, name: string | Identifier | BindingPattern, initializer?: Expression) {
        super();
        this.dotDotDotToken = dotDotDotToken;
        this.propertyName = propertyName;
        this.name = name;
        this.initializer = initializer;
    }

    toString() {
        const key = this.propertyName ? `${this.propertyName}:` : "";
        return `${key}${this.dotDotDotToken}${this.name}`;
    }

    getDependency() {
        if (!this.propertyName) { 
            return [this.name.toString()];
        }
        return [this.propertyName.toString()];
    }
}

export class BindingPattern extends Expression {

    elements: Array<BindingElement>
    type: 'array' | 'object'

    constructor(elements: Array<BindingElement>, type: 'object' | 'array') {
        super();
        this.elements = elements;
        this.type = type;
    }

    toString() {
        if (this.elements.length === 0) { 
            return "";
        }
        return this.type === "array" ? `[${this.elements}]` : `{${this.elements.sort((a, b) => {
            if (a.dotDotDotToken) { 
                return 1;
            }
            if (b.dotDotDotToken) { 
                return -1;
            }
            const aValue = a.propertyName?.toString() || a.name.toString();
            const bValue = b.propertyName?.toString() || b.name.toString();
    
            if (aValue < bValue) {
                return -1;
            }
            return 1;
        })}}`;
    }

    remove(name: string) {
        this.elements = this.elements.filter(e => e.name?.toString() !== name);
    }

    add(element: BindingElement) { 
        this.elements.push(element);
    }

    getDependency() { 
        return this.elements.reduce((d: string[], e) => d.concat(e.getDependency()), []);
    }

    hasRest() { 
        return this.elements.find(e => e.dotDotDotToken);
    }

    getVariableExpressions(startExpression: Expression): VariableExpression { 
        return this.elements.reduce((v: VariableExpression, e, index) => {
            if (e.name) {
                let expression: Expression | null = null;

                if (this.type !== "object") {
                    expression = new ElementAccess(startExpression, new SimpleExpression(index.toString()));
                } else if (e.name instanceof Identifier) {
                    expression = new PropertyAccess(startExpression, e.name);
                } else if (typeof e.name === "string") {
                    const name = e.name;
                    expression = new PropertyAccess(startExpression, new Identifier(name));
                } else if (e.name instanceof BindingPattern && e.propertyName) { 
                    return {
                        ...e.name.getVariableExpressions(
                            new PropertyAccess(startExpression, e.propertyName)
                        ),
                        ...v
                    };
                }   
                /* istanbul ignore next */
                if (expression) {
                    return {
                        [e.name.toString()]: expression,
                        ...v,
                    };
                }
            }
            /* istanbul ignore next */
            return v;
        }, {})
    }
}
