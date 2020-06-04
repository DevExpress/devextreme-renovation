import {
    Generator,
    ReactComponent,
    Property as BaseProperty,
    JsxAttribute,
    JsxOpeningElement as ReactJsxOpeningElement,
    JsxClosingElement as ReactJsxClosingElement,
    HeritageClause,
} from "./react-generator";
import path from "path";
import { Expression } from "./base-generator/expressions/base";
import { Identifier } from "./base-generator/expressions/common";
import { ImportClause, ImportDeclaration } from "./base-generator/expressions/import";
import { StringLiteral, ObjectLiteral } from "./base-generator/expressions/literal";
import { TypeExpression } from "./base-generator/expressions/type";
import { getModuleRelativePath } from "./base-generator/utils/path-utils";
import { GeneratorContext as BaseGeneratorContext } from "./base-generator/types";
import { Decorator } from "./base-generator/expressions/decorator";
import { Method } from "./base-generator/expressions/class-members";
import { compileType } from "./base-generator/utils/string";

const processModuleFileName = (module: string) => `${module}.p`;

export class PreactComponent extends ReactComponent {
    context!: GeneratorContext;
    decorator: Decorator;

    constructor(decorator: Decorator, modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>, context: GeneratorContext) {
        super(decorator, modifiers, name, typeParameters, heritageClauses, members, context);

        this.decorator = decorator;
    }

    compileImportStatements(hooks: string[], compats: string[]) {
        const imports = [`import * as Preact from "preact"`]; 
        if (hooks.length) { 
            imports.push(`import {${hooks.join(",")}} from "preact/hooks"`);
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

class JQueryComponent {
    constructor(private source: PreactComponent) {}

    compileGetProps() {
        const statements: string[] = [];

        const templates = this.source.props.filter(p => p.decorators.find(d => d.name === "Template"))
        statements.splice(-1, 0, ...templates.map(t => {
            const params = ["props", `props.${t.name}`];
            const decoratorArgs = t.decorators.find(d => d.name === "Template")!.expression.arguments[0];
            if(decoratorArgs && (decoratorArgs as ObjectLiteral).getProperty("canBeAnonymous")?.toString() === "true") {
                params.push("true");
            }
    
            return `props.${t.name} = this._createTemplateComponent(${params.join(",")});`;
        }));

        if(this.source.props.find(p => p.name === "onKeyDown" && p.isEvent)) {
            statements.push("props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);");
        }

        statements.splice(-1, 0, ...this.source.state.map(s => {
            return `props.${s.name}Change = this._stateChange('${s.name}')`
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
    
    compileAPI() {
        const api = this.source.api.map(a => `${a.name}(${a.parameters})${compileType(a.type.toString())} {
            return this.viewRef.current.${a.name}(${a.parameters.map(p => p.name).join(",")});
        }`);
    
        return `${api.join("\n")}`;
    }
    
    compileInit() {
        const statements: string[] = [];
        if(this.source.api.length) {
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

    compileImports(component: Identifier) {
        const context = this.source.context;

        const imports: string[] = [`import * as Preact from "preact"`];
        
        imports.push(`import registerComponent from "${getModuleRelativePath(context.dirname!, context.jqueryComponentRegistratorModule!)}"`);

        if(!component) {
            imports.push(`import BaseComponent from "${getModuleRelativePath(context.dirname!, context.jqueryBaseComponentModule!)}"`);
        } else {
            const importClause = context.noncomponentImports!.find(i => 
                i.importClause.name?.toString() === component.toString() || 
                i.importClause.namedBindings?.node.some(n => n.toString() === component.toString()));
            if(importClause) {
                imports.push(importClause.toString());
            }
        }

        const relativePath = getModuleRelativePath(context.dirname!, context.path!);
        imports.push(`import ${this.source.name}Component from '${processModuleFileName(relativePath.replace(path.extname(relativePath), ''))}'`);

        return imports.join(";\n");
    }

    compileEventMap() {
        const statements = this.source.props.reduce((r: string[], p) => {
            const decoratorArgs = p.isEvent && p.decorators.find(d => d.name === "Event")!.expression.arguments[0];
            const actionConfig = decoratorArgs && (decoratorArgs as ObjectLiteral).getProperty("actionConfig");
            if(actionConfig) {
                r.push(`${p.name}: ${(actionConfig as ObjectLiteral)}`)
            }

            return r;
        }, []);

        if(!statements.length) {
            return "";
        }

        return `
        _getActionConfigs() {
            return {
                ${statements.join(",\n")}
            };
        }
        `;
    }
    
    toString() {
        const jQueryProp = (this.source.decorator.expression.arguments[0] as ObjectLiteral).getProperty("jQuery");
        const registerJQuery = jQueryProp && (jQueryProp as ObjectLiteral).getProperty("register")?.toString() === "true"
        const baseComponent = jQueryProp && (jQueryProp as ObjectLiteral).getProperty("component");

        if(!(registerJQuery
            && !!this.source.context.jqueryComponentRegistratorModule && (!!baseComponent || !!this.source.context.jqueryBaseComponentModule))) {
            return "";
        }
        
        return `
        ${this.compileImports(baseComponent as Identifier)}

        export default class ${this.source.name} extends ${baseComponent ? baseComponent.toString() : "BaseComponent"} {
            ${this.compileGetProps()}
            
            ${this.compileAPI()}
    
            ${this.compileEventMap()}

            get _viewComponent() {
                return ${this.source.name}Component;
            }
    
            ${this.compileInit()}
        }
    
        registerComponent("dxr${this.source.name}", ${this.source.name});
        `;
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
    noncomponentImports?: ImportDeclaration[];
}

export class PreactGenerator extends Generator { 
    jqueryComponentRegistratorModule?: string
    jqueryBaseComponentModule?: string

    context: GeneratorContext[] = [];

    setContext(context: GeneratorContext | null) {
        context && !context.noncomponentImports && (context.noncomponentImports = []);
        super.setContext(context);
    }

    getInitialContext(): GeneratorContext {
        return {
            ...super.getInitialContext(),
            jqueryComponentRegistratorModule: this.jqueryComponentRegistratorModule && path.resolve(this.jqueryComponentRegistratorModule),
            jqueryBaseComponentModule: this.jqueryBaseComponentModule && path.resolve(this.jqueryBaseComponentModule)
        };
    }

    generate(factory: any): { path?: string, code: string }[] {
        const result = super.generate(factory);

        const { path } = this.getContext();
        const source = path && this.cache[path].find((e: any) => e instanceof PreactComponent);
        if(source) {
            result.push({ path: `${path!.replace(/\.tsx$/, ".j.tsx")}`, code: (new JQueryComponent(source)).toString() });
        }

        return result;
    }

    createImportDeclaration(decorators: Decorator[] = [], modifiers: string[] = [], importClause: ImportClause = new ImportClause(), moduleSpecifier: StringLiteral) {
        const importStatement = super.createImportDeclaration(decorators, modifiers, importClause, moduleSpecifier);

        const module = moduleSpecifier.expression.toString();
        const modulePath = `${module}.tsx`;
        const context = this.getContext() as GeneratorContext;
        if (context.dirname) {
            const fullPath = path.resolve(context.dirname, modulePath);
            if (this.cache[fullPath]) { 
                (importStatement as ImportDeclaration).replaceSpecifier(module, processModuleFileName(module));
            } else {
                importStatement && context.noncomponentImports!.push(importStatement as ImportDeclaration);
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
        return new JsxOpeningElement(tagName, typeArguments, attributes, this.getContext());
    }

    createJsxClosingElement(tagName: Identifier) {
        return new JsxClosingElement(tagName);
    }

    createProperty(decorators: Decorator[], modifiers: string[] = [], name: Identifier, questionOrExclamationToken: string = "", type?: TypeExpression, initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }
}

export default new PreactGenerator();
