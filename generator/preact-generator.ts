import {
    Generator,
    ReactComponent,
    Decorator,
    Identifier,
    Property as BaseProperty,
    Method,
    StringLiteral,
    ImportClause,
    JsxAttribute,
    JsxOpeningElement as ReactJsxOpeningElement,
    JsxClosingElement as ReactJsxClosingElement,
    ImportDeclaration,
    HeritageClause,
    Expression,
} from "./react-generator";
import path from "path";


export class PreactComponent extends ReactComponent {
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

export class Property extends BaseProperty { 
    typeDeclaration() {
        if (this.decorators.find(d => d.name === "Slot")) { 
            return `${this.name}${this.questionOrExclamationToken}:any`;
        }
        return super.typeDeclaration();
    }
}

const processTagName = (tagName: Identifier) => tagName.toString() === "Fragment" ? new Identifier("Preact.Fragment") : tagName;

class JsxOpeningElement extends ReactJsxOpeningElement { 
    constructor(tagName: Identifier, typeArguments: any[], attributes: JsxAttribute[] = []) { 
        super(processTagName(tagName), typeArguments, attributes);
    }
}

class JsxClosingElement extends ReactJsxClosingElement { 
    constructor(tagName: Identifier) { 
        super(processTagName(tagName));
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
        return new JsxClosingElement(tagName);
    }

    createProperty(decorators: Decorator[], modifiers: string[] = [], name: Identifier, questionOrExclamationToken: string = "", type: string = "", initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }
}

export default new PreactGenerator();
