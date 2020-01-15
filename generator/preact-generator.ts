import reactGenerator, { ReactComponent, Decorator, Identifier, Property, Method, Slot, StringLiteral } from "./react-generator";
import fs from "fs";
import path from "path";

class PreactSlot extends Slot { 
    constructor(slot: Slot) { 
        super(slot.property);
    }

    typeDeclaration() {
        return `${this.name}${this.property.questionOrExclamationToken}:any`;
    }
}
class PreactComponent extends ReactComponent {
    constructor(decorator: Decorator, modifiers: string[] = [], name: Identifier, typeParameters: string[], heritageClauses: any, members: Array<Property | Method>) {
        super(decorator, modifiers, name, typeParameters, heritageClauses, members);
        this.slots = this.slots.map(s => new PreactSlot(s));
    }
    compileImportStatements(hooks: string[]) {
        const imports = ["import * as Preact from 'preact'"]; 
        if (hooks.length) { 
            imports.push(`import {${hooks.join(",")}} from 'preact/hooks'`);
        }
        return imports;
    }

    defaultPropsDest() { 
        return `(${super.defaultPropsDest()} as any)`;
    }
}

export default {
    ...reactGenerator,

    createImportDeclaration(decorators: Decorator[] = [], modifiers: string[] = [], importClause: string = "", moduleSpecifier: StringLiteral) {
        const module = moduleSpecifier.expression.toString();
        if (this.context.path) { 
            const modulePath = path.join(this.context.path, `${module}.tsx`);
            if (fs.existsSync(modulePath)) { 
                moduleSpecifier = new StringLiteral(`${module}.p`);
            }
            
        }
        return reactGenerator.createImportDeclaration(decorators, modifiers, importClause, moduleSpecifier);
    },

    processSourceFileName(name: string) {
        return name.replace(/\.tsx$/, ".p.tsx");
    },

    createClassDeclaration(decorators: Decorator[], modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: any, members: Array<Property | Method>) {
        const componentDecorator = decorators.find(d => d.name === "Component");
        if (componentDecorator) {
            return new PreactComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members);
        }

        return reactGenerator.createClassDeclaration(decorators, modifiers, name, typeParameters, heritageClauses, members);
    }
};
