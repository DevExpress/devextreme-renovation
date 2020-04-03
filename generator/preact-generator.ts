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
    TypeExpression,
} from "./react-generator";
import path from "path";

const processModuleFileName = (module: string) => `${module}.p`;

export class PreactComponent extends ReactComponent {
    compileImportStatements(hooks: string[], compats: string[]) {
        const imports = ["import * as Preact from 'preact'"]; 
        if (hooks.length) { 
            imports.push(`import {${hooks.join(",")}} from 'preact/hooks'`);
        }

        if (compats.length) { 
            imports.push(`import {${compats.join(",")}} from "preact/compat"`);
        }
        
        return imports;
    }

    processModuleFileName(module: string) {
        return processModuleFileName(module);
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

const processTagName = (tagName: Expression) => tagName.toString() === "Fragment" ? new Identifier("Preact.Fragment") : tagName;

class JsxOpeningElement extends ReactJsxOpeningElement { 
    processTagName(tagName: Expression) { 
        return processTagName(tagName);
    }
}

class JsxClosingElement extends ReactJsxClosingElement { 
    processTagName(tagName: Expression) { 
        return processTagName(tagName);
    }
}

export class PreactGenerator extends Generator { 
    createImportDeclaration(decorators: Decorator[] = [], modifiers: string[] = [], importClause: ImportClause = new ImportClause(), moduleSpecifier: StringLiteral) {
        const importStatement = super.createImportDeclaration(decorators, modifiers, importClause, moduleSpecifier);

        const module = moduleSpecifier.expression.toString();
        const modulePath = `${module}.tsx`;
        const context = this.getContext();
        if (context.dirname) {
            const fullPath = path.resolve(context.dirname, modulePath);
            if (this.cache[fullPath]) { 
                (importStatement as ImportDeclaration).replaceSpecifier(module, processModuleFileName(module));
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

    createProperty(decorators: Decorator[], modifiers: string[] = [], name: Identifier, questionOrExclamationToken: string = "", type?: TypeExpression, initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }
}

export default new PreactGenerator();
