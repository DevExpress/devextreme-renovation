import {
    Generator,
    ReactComponent,
    Decorator,
    Identifier,
    Property,
    Method,
    Slot,
    StringLiteral,
    ImportClause,
    JsxAttribute,
    JsxOpeningElement as ReactJsxOpeningElement,
    ImportDeclaration,
    GeneratorContex,
    HeritageClause
} from "./react-generator";
import path from "path";

class PreactSlot extends Slot { 
    constructor(slot: Slot) { 
        super(slot.property);
    }

    typeDeclaration() {
        return `${this.name}${this.property.questionOrExclamationToken}:any`;
    }
}
export class PreactComponent extends ReactComponent {
    constructor(decorator: Decorator, modifiers: string[] = [], name: Identifier, typeParameters: string[], heritageClauses: any, members: Array<Property | Method>, context: GeneratorContex) {
        super(decorator, modifiers, name, typeParameters, heritageClauses, members, context);
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
        return `(${this.name} as any).defaultProps`;
    }
}

class JsxOpeningElement extends ReactJsxOpeningElement { 
    constructor(tagName: Identifier, typeArguments: any[], attributes: JsxAttribute[] = []) { 
        if (tagName.toString() === "Fragment") { 
            tagName = new Identifier("Preact.Fragment");
        }
        super(tagName, typeArguments, attributes);
    }
}

export class PreactGenerator extends Generator { 
    createImportDeclaration(decorators: Decorator[] = [], modifiers: string[] = [], importClause: ImportClause = new ImportClause(), moduleSpecifier: StringLiteral) {
        const importStatement = super.createImportDeclaration(decorators, modifiers, importClause, moduleSpecifier);

        const module = moduleSpecifier.expression.toString();
        const modulePath = `${module}.tsx`;
        const context = this.getContext();
        if (context.path) {
            const fullPath = path.resolve(context.path, modulePath);
            if (this.cache[fullPath]) { 
                (importStatement as ImportDeclaration).replaceSpecifier(module, `${module}.p`);
            }
        }
        return importStatement;
    }

    processSourceFileName(name: string) {
        return name.replace(/\.tsx$/, ".p.tsx");
    }

    createComponent(componentDecorator: Decorator, modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) { 
        return new PreactComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members, this.getContext());
    }

    createJsxOpeningElement(tagName: Identifier, typeArguments: any[], attributes: JsxAttribute[]=[]) {
        return new JsxOpeningElement(tagName, typeArguments, attributes);
    }

    createJsxClosingElement(tagName: Identifier) {
        return `</${tagName.toString() === "Fragment" ? "Preact.Fragment" : tagName}>`;
    }
}

export default new PreactGenerator();
