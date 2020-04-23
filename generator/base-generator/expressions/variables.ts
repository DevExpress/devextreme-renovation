import { Expression, SimpleExpression } from "./base";
import { Identifier, Paren, Call } from "./common";
import { TypeExpression } from "./type";
import { PropertyAccess } from "./property-access";
import { toStringOptions, VariableExpression } from "../types";
import { BindingPattern, BindingElement } from "./binding-pattern";
import { Method, Property } from "./class-members";
import { compileType } from "../utils/string";
import { getProps } from "./component";

export class VariableDeclaration extends Expression {
    name: Identifier | BindingPattern;
    type?: TypeExpression;
    initializer?: Expression;

    constructor(name: Identifier | BindingPattern, type?: TypeExpression, initializer?: Expression) {
        super();
        this.name = name;
        this.type = type;
        this.initializer = initializer;
    }

    processProps(result: string, options:toStringOptions) { 
        return result;
    }

    toString(options?: toStringOptions) {
        if (this.name instanceof BindingPattern && options?.members.length && this.initializer instanceof PropertyAccess) {
            const props = getProps(options.members);
            const members = this.name.getDependency()
                .map(d => props.find(m => m._name.toString() === d))
                .filter(m => m && m.name && m.name.toString() !== m._name.toString()) as Array<Property | Method>;
            const variables = members.reduce((v: VariableExpression, m) => {
                const bindingPattern = this.name as BindingPattern;
                bindingPattern.remove(m._name.toString());
                if (bindingPattern.hasRest()) {
                    bindingPattern.add(
                        new BindingElement(undefined, undefined, new Identifier(m.name))
                    );
                }
                return {
                    ...v,
                    [m._name.toString()]: this.initializer ?
                        new PropertyAccess(this.initializer, new Identifier(m.name)) :
                        new SimpleExpression(m.name)
                };
            }, options.variables || {});
                
            options.variables = variables;
        }
        
        let initilizer: string | undefined = this.initializer?.toString(options);

        if (this.initializer instanceof PropertyAccess && this.initializer.checkPropsAccess(this.initializer.toString(), options) && options) { 
            initilizer = this.processProps(initilizer!, options)
        }

        if (this.name.toString()) { 
            return `${this.name}${compileType(this.type?.toString())}${initilizer ? `=${initilizer}`:""}`;
        }
        return "";
    }

    getDependency() {
        if (this.initializer && typeof this.initializer !== "string") {
            const initializerDependency = this.initializer.getDependency();
            if (this.name instanceof BindingPattern && this.initializer.toString().startsWith("this")) {
                if (this.name.hasRest()) {
                    return initializerDependency;
                }
                return this.name.getDependency();
            }
            return initializerDependency;
        }
        return [];
    }

    getVariableExpressions(): VariableExpression { 
        if (this.name instanceof Identifier && this.initializer instanceof Expression) { 
            const expression =
                this.initializer instanceof SimpleExpression ||
                    this.initializer.isJsx() ||
                    this.initializer instanceof Call ?
                
                    this.initializer :
                    new Paren(this.initializer);
            
            return {
                [this.name.toString()]: expression
            };
        }
        if (this.name instanceof BindingPattern && this.initializer) {
            return this.name.getVariableExpressions(this.initializer);
        }
        return {};
    }

    isJsx() { 
        return this.initializer instanceof Expression && this.initializer.isJsx()
    }
}

export class VariableDeclarationList extends Expression {
    declarations: VariableDeclaration[];
    flags?: string;

    constructor(declarations: VariableDeclaration[], flags?: string) {
        super();
        this.declarations = declarations;
        this.flags = flags;
    }

    toString(options?: toStringOptions) {
        const declarations = this.declarations.map(d => d.toString(options)).filter(d => d);
        if (declarations.length === 0) { 
            return "";
        }
        return `${this.flags} ${declarations}`;
    }

    getDependency() {
        return this.declarations.reduce((d: string[], p) => d.concat(p.getDependency()), []);
    }

    getVariableExpressions(): VariableExpression { 
        return this.declarations.reduce((v: VariableExpression, d) => { 
            return {
                ...v,
                ...d.getVariableExpressions()
            }
        }, {});
    }
}

export class VariableStatement extends Expression {
    declarationList: VariableDeclarationList;
    modifiers: string[];
    constructor(modifiers: string[] = [], declarationList: VariableDeclarationList) {
        super();
        this.modifiers = modifiers;
        this.declarationList = declarationList;
    }


    toString(options?: toStringOptions) {
        const declarationList = this.declarationList.toString(options);
        return declarationList ? `${this.modifiers.join(" ")} ${declarationList}` : "";
    }

    getDependency() {
        return this.declarationList.getDependency();
    }

    getVariableExpressions() { 
        return this.declarationList.getVariableExpressions();
    }
}
