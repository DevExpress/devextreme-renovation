import { StringLiteral } from "./literal";
import { Identifier, Decorator } from "./common";

export class NamedImports {
    node: Identifier[];
    constructor(node: Identifier[], elements?: any[]) {
        this.node = node;
    }

    add(name: string) { 
        this.remove(name);
        this.node.push(new Identifier(name));
    }
    
    remove(name: string) { 
        this.node = this.node.filter(n => n.toString() !== name);
    }

    toString() {
        return this.node.length ? `{${this.node.join(",")}}` : "";
    }
}

export class ImportClause { 
    name?: Identifier;
    namedBindings?: NamedImports;
    constructor(name?: Identifier, namedBindings?: NamedImports) { 
        this.name = name;
        this.namedBindings = namedBindings;
    }

    get default() { 
        return this.name?.toString() || "";
    }

    get imports() { 
        return this.namedBindings?.node.map(m => m.toString()) || [];
    }

    remove(name:string) { 
        if (this.namedBindings) { 
            this.namedBindings.remove(name);
        }
    }

    add(name: string) { 
        if (this.namedBindings) {
            this.namedBindings.add(name);
        } else { 
            this.namedBindings = new NamedImports([new Identifier(name)]);
        }
    }

    toString() { 
        const result: string[] = [];
        if (this.name) {
            result.push(this.name.toString());
        }
        if (this.namedBindings) {
            const namedBindings = this.namedBindings.toString();
            namedBindings && result.push(namedBindings);
        }

        return result.length ? `${result.join(",")} from ` : "";
    }
}

export class ImportDeclaration { 
    decorators: Decorator[];
    modifiers: string[];
    importClause: ImportClause;
    moduleSpecifier: StringLiteral;

    replaceSpecifier(search: string | RegExp, replaceValue: string) { 
        this.moduleSpecifier.expression = this.moduleSpecifier.expression.replace(search, replaceValue);
    }
    
    add(name: string) { 
        this.importClause.add(name);
    }

    constructor(decorators: Decorator[] = [], modifiers: string[] = [], importClause: ImportClause, moduleSpecifier: StringLiteral) { 
        this.decorators = decorators;
        this.modifiers = modifiers;
        this.importClause = importClause;
        this.moduleSpecifier = moduleSpecifier;
    }

    toString() { 
        return `import ${this.importClause}${this.moduleSpecifier}`;
    }
}
