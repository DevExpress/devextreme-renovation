import {
    Generator,
    ReactComponent,
    Property as BaseProperty,
    JsxAttribute,
    JsxOpeningElement as ReactJsxOpeningElement,
    JsxClosingElement as ReactJsxClosingElement,
    HeritageClause,
    PropertyAccess,
} from "./react-generator";
import path from "path";
import SyntaxKind from "./base-generator/syntaxKind";
import { Expression } from "./base-generator/expressions/base";
import { Identifier, Call } from "./base-generator/expressions/common";
import { ImportClause, ImportDeclaration } from "./base-generator/expressions/import";
import { StringLiteral, ObjectLiteral } from "./base-generator/expressions/literal";
import { TypeExpression, SimpleTypeExpression } from "./base-generator/expressions/type";
import { getModuleRelativePath } from "./base-generator/utils/path-utils";
import { GeneratorContext as BaseGeneratorContext } from "./base-generator/types";
import { Decorator } from "./base-generator/expressions/decorator";
import { Method } from "./base-generator/expressions/class-members";
import { compileType } from "./base-generator/utils/string";
import { Block, ReturnStatement } from "./base-generator/expressions/statements";

const BASE_JQUERY_WIDGET = "BASE_JQUERY_WIDGET";

const processModuleFileName = (module: string) => `${module}.p`;

const getJQueryBaseComponentName = (decorators: Decorator[], context: GeneratorContext): string | undefined => {
    const jQueryProp = (decorators.find(d => d.name === "Component")!.getParameter("jQuery") as ObjectLiteral);
    const baseComponent = jQueryProp?.getProperty("component");
    
    if(!(jQueryProp?.getProperty("register")?.toString() === "true"
        && !!context.jqueryComponentRegistratorModule && (!!baseComponent || !!context.jqueryBaseComponentModule))) {
        return undefined;
    }
    return baseComponent ? baseComponent.toString() : BASE_JQUERY_WIDGET;
}

export class PreactComponent extends ReactComponent {
    context!: GeneratorContext;

    constructor(decorator: Decorator, modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>, context: GeneratorContext) {
        super(decorator, modifiers, name, typeParameters, heritageClauses, members, context);

        if(getJQueryBaseComponentName([decorator], context)) {
            const propsGetter = new Method(
                [new Decorator(new Call(new Identifier("Method"), undefined, []), {})],
                [],
                undefined,
                new Identifier("getProps"),
                undefined,
                [],
                [],
                undefined,
                new Block([
                    new ReturnStatement(new PropertyAccess(
                        new Identifier(SyntaxKind.ThisKeyword),
                        new Identifier("props")
                    ))
                ], true)
            );
            propsGetter.prefix = "__";
            this.members.push(propsGetter);
        }
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

    compileRestProps() {
        return "declare type RestProps = { className?: string; style?: { [name: string]: any }; [x: string]: any }";
    }
}

class JQueryComponent {
    constructor(private source: PreactComponent) {}

    compileGetProps() {
        const statements: string[] = [];

        const templates = this.source.props.filter(p => p.decorators.find(d => d.name === "Template"))
        statements.splice(-1, 0, ...templates.map(t => {
            const params = ["props", `props.${t.name}`];
            if(t.decorators.find(d => d.name === "Template")!.getParameter("canBeAnonymous")?.toString() === "true") {
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
        return (this.source.members.filter(a => a.isApiMethod && a.name.toString() !== "__getProps") as Method[])
            .map(a => `${a.name}(${a.parameters})${compileType(a.type.toString())} {
                return this.viewRef.${a.name}(${a.parameters.map(p => p.name).join(",")});
            }`).join("\n");
    }

    compileImports(component: string) {
        const context = this.source.context;

        const imports: string[] = [`import * as Preact from "preact"`];
        
        imports.push(`import registerComponent from "${getModuleRelativePath(context.dirname!, context.jqueryComponentRegistratorModule!)}"`);

        if(component === BASE_JQUERY_WIDGET) {
            imports.push(`import BaseComponent from "${getModuleRelativePath(context.dirname!, context.jqueryBaseComponentModule!)}"`);
        } else {
            const importClause = context.noncomponentImports!.find(i => 
                i.importClause.name?.toString() === component || 
                i.importClause.namedBindings?.node.some(n => n.toString() === component));
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
            const actionConfig = p.isEvent && p.decorators.find(d => d.name === "Event")!.getParameter("actionConfig");
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
        const baseComponent = getJQueryBaseComponentName(this.source.decorators, this.source.context)
        if(!baseComponent) {
            return "";
        }
        
        return `
        ${this.compileImports(baseComponent)}

        export default class ${this.source.name} extends ${baseComponent === BASE_JQUERY_WIDGET ? "BaseComponent" : baseComponent.toString()} {
            ${this.compileGetProps()}
            
            ${this.compileAPI()}
    
            ${this.compileEventMap()}

            get _viewComponent() {
                return ${this.source.name}Component;
            }
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
