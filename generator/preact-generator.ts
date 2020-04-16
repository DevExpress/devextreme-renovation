import {
    Generator,
    ReactComponent,
    Property as BaseProperty,
    Method,
    JsxAttribute,
    JsxOpeningElement as ReactJsxOpeningElement,
    JsxClosingElement as ReactJsxClosingElement,
    HeritageClause,
} from "./react-generator";
import path from "path";
import { Expression } from "./base-generator/expressions/base";
import { Identifier, Decorator } from "./base-generator/expressions/common";
import { ImportClause, ImportDeclaration } from "./base-generator/expressions/import";
import { StringLiteral, ObjectLiteral } from "./base-generator/expressions/literal";
import { TypeExpression } from "./base-generator/expressions/type";
import { getModuleRelativePath } from "./base-generator/utils/path-utils";
import { GeneratorContex as BaseGeneratorContext } from "./base-generator/types";

const processModuleFileName = (module: string) => `${module}.p`;

export class PreactComponent extends ReactComponent {
    context!: GeneratorContext;
    needRegisterJQueryWidget: boolean = false;

    constructor(decorator: Decorator, modifiers: string[] = [], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[] = [], members: Array<Property | Method>, context: GeneratorContext) {
        super(decorator, modifiers, name, typeParameters, heritageClauses, members, context);

        this.needRegisterJQueryWidget = (decorator.expression.arguments[0] as ObjectLiteral).getProperty("registerJQuery")?.toString() === "true"
            && !!this.context.jqueryComponentRegistratorModule && !!this.context.jqueryBaseComponentModule;
    }

    compileImportStatements(hooks: string[], compats: string[]) {
        const imports = [`import * as Preact from "preact"`]; 
        if (hooks.length) { 
            imports.push(`import {${hooks.join(",")}} from "preact/hooks"`);
        }

        if (compats.length) { 
            imports.push(`import {${compats.join(",")}} from "preact/compat"`);
        }

        if(this.needRegisterJQueryWidget) {
            imports.push(`import registerComponent from "${getModuleRelativePath(this.context.dirname!, this.context.jqueryComponentRegistratorModule!)}"`);
            imports.push(`import Component from "${getModuleRelativePath(this.context.dirname!, this.context.jqueryBaseComponentModule!)}"`);
        }
        
        return imports;
    }

    processModuleFileName(module: string) {
        return processModuleFileName(module);
    }

    defaultPropsDest() { 
        return `(${this.name} as any).defaultProps`;
    }

    compileJQGetProps() {
        const statements: string[] = [];
        const templates = this.props.filter(p => p.decorators.find(d => d.name === "Template"))

        statements.splice(-1, 0, ...templates.map(t => {
            return `
            if(props.${t._name}) {
                props.${t.name} = this._createTemplateComponent(props, "${t._name}");
            }
            `;
        }));

        if(!statements.length) {
            return "";
        }

        return `
        getProps(props:any) {
            ${statements.join("\n")}

            return props;
        }
        `;
    }

    compileJQAPI() {
        if(!this.api.length) return "";

        const api = this.api.map(a => `${a.name}(${a.parametersTypeDeclaration()}) {
            this.viewRef.current.${a.name}(${a.parameters.map(p => p.name).join(",")});
        }`);

        return `${api.join("\n")}`;
    }

    compileJQInit() {
        const statements: string[] = [];
        if(this.api.length) {
            statements.push("this._createViewRef();");
        }

        if(!statements.length) {
            return "";
        }

        return `
        _initWidget() {
            ${statements.join(";\n")}
        }
        `;
    }

    toString() {
        const statements: string[] = [super.toString()];

        if(this.needRegisterJQueryWidget) {
            statements.push(`
            export class Dx${this.name} extends Component {
                ${this.compileJQGetProps()}
    
                ${this.compileJQAPI()}
    
                get _viewComponent() {
                    return ${this.name};
                }
    
                ${this.compileJQInit()}
            }
    
            registerComponent("${this.name}", Dx${this.name});
            `)
        }

        return `${statements.join("\n")}`;
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

export type GeneratorContext = BaseGeneratorContext & {
    jqueryComponentRegistratorModule?: string
    jqueryBaseComponentModule?: string
}

export class PreactGenerator extends Generator { 
    jqueryComponentRegistratorModule?: string
    jqueryBaseComponentModule?: string

    context: GeneratorContext[] = [];

    setContext(context: GeneratorContext | null) {
        super.setContext(context);
    }

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
