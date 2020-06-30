import { Component, getProps } from "../../base-generator/expressions/component";
import { Decorator } from "./decorator";
import { StringLiteral, ArrayLiteral } from "../../base-generator/expressions/literal";
import { HeritageClause } from "../../base-generator/expressions/class";
import { Identifier, Call } from "../../base-generator/expressions/common";
import { SimpleExpression } from "../../base-generator/expressions/base";
import { Block } from "../../base-generator/expressions/statements";
import { toStringOptions, AngularGeneratorContext } from "../types";
import SyntaxKind from "../../base-generator/syntaxKind";
import { Parameter, getTemplate } from "../../base-generator/expressions/functions";
import { SimpleTypeExpression, FunctionTypeNode } from "../../base-generator/expressions/type";
import { Property } from "./class-members/property";
import { Method } from "../../base-generator/expressions/class-members";
import { GetAccessor } from "./class-members/get-accessor";
import { SetAccessor } from "./class-members/set-accessor";
import { Decorators } from "../../component_declaration/decorators";
import { isElement } from "./jsx/elements";
import { GeneratorContext } from "../../base-generator/types";

export function compileCoreImports(members: Array<Property|Method>, context: AngularGeneratorContext, imports:string[] = []) { 
    if (members.some(m =>
        m.decorators.some(d =>
            d.name === Decorators.OneWay ||
            d.name === Decorators.RefProp ||
            d.name === Decorators.Nested ||
            d.name === Decorators.ForwardRefProp
        )
    )) {
        imports.push("Input");
    }
    if (members.some(m => m.isState)) { 
        imports.push("Input", "Output", "EventEmitter");
    }
    if (members.some(m => m.isTemplate)) { 
        imports.push("Input", "TemplateRef");
    }
    if (members.some(m => m.isEvent)) {
        imports.push("Output", "EventEmitter");
    }

    if (members.some(m => m.isSlot)) {
        imports.push("ViewChild", "ElementRef");
    }

    if (members.some(m => m.isNestedComp)) {
        imports.push("ContentChildren", "QueryList", "Directive");
    }

    if (members.some(m => m.isForwardRef)) {
        imports.push("ElementRef");
    }

    const set = new Set(context.angularCoreImports);
    const needImport = imports.filter(name => !set.has(name));
    context.angularCoreImports = [...set, ...needImport];

    if (needImport.length) {
        return `import {${[...new Set(needImport)].join(",")}} from "@angular/core"`;
    }

    return "";
}

function separateDependency(allDependency: string[], internalState: Property[]): [string[], string[]]{
    const result: [string[], string[]] = [[], []];
     return allDependency.reduce((r, d) => {
        if(internalState.find(m => m.name.toString() === d)) {
            r[1].push(d);
        } else {
            r[0].push(d);
        }
        
        return r;
    }, result);
}

const ngOnChangesParameters = ["changes"];

export const getAngularSelector = (name: string | Identifier, postfix: string = "") => {
    name = name.toString()
    const words = name.toString().split(/(?=[A-Z])/).map(w => w.toLowerCase());
    return [`dx${postfix}`].concat(words).join("-");
}

export class AngularComponent extends Component {
    decorator: Decorator;
    constructor(componentDecorator: Decorator, modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>, context: GeneratorContext) {
        super(componentDecorator, modifiers, name, typeParameters, heritageClauses, members, context);
        componentDecorator.addParameter("selector", new StringLiteral(this.selector));
        this.decorator = componentDecorator;
    }

    processMembers(members: Array<Property | Method>) { 
        this.heritageClauses.forEach(h => { 
            if (h.isRequired) { 
                h.members.filter(m=>m instanceof Property).forEach(m => {
                    (m as Property).required = true;
                });
            }
        });
        members = super.processMembers(members);
        members = members.concat((members.filter(m => m.isForwardRefProp) as Property[]).map(m => {
            return new Property(
                [
                    new Decorator(
                        new Call(new Identifier(Decorators.Ref), [], []),
                        this.context
                    )
                ],
                [],
                new Identifier(`${m.name}Ref`),
                m.questionOrExclamationToken,
                m.type
            );
        }));

        members = members.concat(members.filter(m => m.isForwardRef||m.isForwardRefProp).map(m => { 
            return new GetAccessor(
                [],
                [],
                new Identifier(`forwardRef_${m.name}`),
                [],
                new FunctionTypeNode(
                    [],
                    [new Parameter(
                        [],
                        [],
                        undefined,
                        new Identifier("ref"),
                        undefined,
                        new SimpleTypeExpression("any")
                    )],
                    new SimpleTypeExpression("void")
                ),
                new Block([
                    new SimpleExpression(`return (ref)=>this.${m.name}${m.isForwardRefProp ? "Ref" : ""}=ref`)
                ], true)
            );
        }))

        return members;
    }

    addPrefixToMembers(members: Array<Property | Method>) { 
        members.filter(m => !m.isApiMethod).forEach(m => {
            m.prefix = "__";
        });
        members = members.reduce((members, member) => {
            if (member.isInternalState) { 
                members.push(
                    new SetAccessor(
                        undefined,
                        undefined,
                        new Identifier(`_${member.name}`),
                        [new Parameter(
                            [],
                            [],
                            undefined,
                            member._name,
                            (member as Property).questionOrExclamationToken,
                            member.type,
                            undefined
                        )],
                        new Block(
                            [new SimpleExpression(`this.${member.name}=${member._name}`)],
                            false
                        )
                    )
                );
            }
            return members;
         }, members);
        return members;
    }

    get selector() {
        return getAngularSelector(this._name);
    }

    get module() { 
        return `Dx${this._name}Module`
    }

    compileImports(coreImports: string[]=[]) { 
        const core = ["Component", "NgModule"].concat(coreImports);
    
        if (this.refs.length || this.apiRefs.length) {
            core.push("ViewChild");
        }
        if (this.refs.length) {
            core.push("ElementRef");
        }

        if(this.modelProp) {
            core.push("forwardRef", "HostListener");
        }

        const imports = [
            `${compileCoreImports(this.members.filter(m => !m.inherited), this.context, core)}`,
            'import {CommonModule} from "@angular/common"',
            ...(this.modelProp ? ["import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'"] : [])
        ];

        this.compileDefaultOptionsImport(imports);

        return imports.join(";\n");
    }

    compileGetterCache(ngOnChanges: string[]): string { 
        const getters = this.members.filter(m => m instanceof GetAccessor && m.isMemorized());

        if (getters.length) { 
            const statements = [
                `__getterCache: {
                    ${getters.map(g=>`${g._name}?:${g.type}`).join(";\n")}
                } = {}`
            ];

            getters.map((g) => { 
                const allDeps = g.getDependency(this.members);
                const [propsDependency, internalStateDependency] = separateDependency(allDeps, this.internalState);
                const deleteCacheStatement = `this.__getterCache["${g._name.toString()}"] = undefined;`;
                
                if (propsDependency.length) {
                    const conditionArray = [];
                    if (propsDependency.indexOf("props") === -1) {
                        conditionArray.push(
                            `[${propsDependency.map(d => `"${d}"`).join(",")}].some(d=>${ngOnChangesParameters[0]}[d])`
                        );
                    }

                    if (conditionArray.length) {
                        ngOnChanges.push(`
                        if (${conditionArray.join("&&")}) {
                            ${deleteCacheStatement}
                        }`);
                    } else { 
                        ngOnChanges.push(deleteCacheStatement);
                    }
                }

                internalStateDependency.forEach(name => { 
                    const setter = this.members.find(p => p.name === `_${name}`) as SetAccessor;
                    if (setter) { 
                        setter.body.statements.push(
                            new SimpleExpression(deleteCacheStatement)
                        );
                    }
                });
            });


            return statements.join("\n");
        }

        return "";
    }

    compileEffects(ngAfterViewInitStatements: string[], ngOnDestroyStatements: string[], ngOnChanges:string[], ngAfterViewCheckedStatements: string[]) { 
        const effects = this.members.filter(m => m.isEffect) as Method[];
        let hasInternalStateDependency = false;
        
        if (effects.length) { 
            const statements = [
                "__destroyEffects: any[] = [];",
                "__viewCheckedSubscribeEvent: Array<()=>void> = [];"
            ];

            const subscribe = (e: Method) => `this.${e.getter()}()`;
            effects.map((e, i) => { 
                const allDeps = e.getDependency(this.members);
                const [propsDependency, internalStateDependency] = separateDependency(allDeps, this.internalState);

                const updateEffectMethod = `__schedule_${e._name}`
                if (propsDependency.length || internalStateDependency.length) { 
                    statements.push(`${updateEffectMethod}(){
                        this.__destroyEffects[${i}]?.();
                        this.__viewCheckedSubscribeEvent[${i}] = ()=>{
                            this.__destroyEffects[${i}] = ${subscribe(e)}
                        }
                    }`);
                }
                if (propsDependency.length) {
                    const conditionArray = ["this.__destroyEffects.length"];
                    if (propsDependency.indexOf("props") === -1) {
                        conditionArray.push(
                            `[${propsDependency.map(d => `"${d}"`).join(",")}].some(d=>${ngOnChangesParameters[0]}[d])`
                        );
                    }
                   
                    ngOnChanges.push(`
                        if (${conditionArray.join("&&")}) {
                            this.${updateEffectMethod}();
                        }`);
                }

                internalStateDependency.forEach(name => { 
                    const setter = this.members.find(p => p.name === `_${name}`) as SetAccessor;
                    if (setter) { 
                        setter.body.statements.push(
                            new SimpleExpression(`
                            if (this.__destroyEffects.length) {
                                this.${updateEffectMethod}();
                            }`)
                        );
                        hasInternalStateDependency = true;
                    }
                });
            });
            if (ngOnChanges.length || hasInternalStateDependency) { 
                ngAfterViewCheckedStatements.push(`
                this.__viewCheckedSubscribeEvent.forEach(s=>s?.());
                this.__viewCheckedSubscribeEvent = [];
                `);
            }
            ngAfterViewInitStatements.push(`this.__destroyEffects.push(${effects.map(e => subscribe(e)).join(",")});`);
            ngOnDestroyStatements.push(`this.__destroyEffects.forEach(d => d && d());`)
            return statements.join("\n");
        }

        return "";
    }

    compileTrackBy(options: toStringOptions): string { 
        return options.trackBy?.map(trackBy => trackBy.getTrackByDeclaration()).join("\n") || "";
    }

    compileSpreadAttributes(ngOnChangesStatements: string[], coreImports: string[]): string { 
        const viewFunction = this.decorator.getViewFunction();
        if (viewFunction) { 
            const options = {
                members: this.members,
                state: [],
                internalState: [],
                props: [],
                newComponentContext: this.viewModel ? "_viewModel" : ""
            };
            const expression = getTemplate(viewFunction, options);
            if (isElement(expression)) { 
                options.newComponentContext = "this";
                const members = [];
                const statements = expression.getSpreadAttributes().map((o, i) => { 
                    const expressionString = o.expression.toString(options);
                    const refString = o.refExpression instanceof SimpleExpression ? `this.${o.refExpression.toString()}?.nativeElement` : o.refExpression.toString(options).replace(/(\w|\d)!?\.nativeElement/, "$1?.nativeElement");
                    if (o.refExpression instanceof SimpleExpression) { 
                        coreImports.push("ViewChild", "ElementRef");
                        members.push(`@ViewChild("${o.refExpression.toString()}", { static: false }) ${o.refExpression.toString()}?: ElementRef<HTMLDivElement>`)
                    }
                    return `
                    const _attr_${i}:{[name: string]:string } = ${expressionString} || {};
                    const _ref_${i} = ${refString};
                    if(_ref_${i}){
                        for(let key in _attr_${i}) {
                            _ref_${i}.setAttribute(key, _attr_${i}[key]);
                        }
                    }
                    `;
                });

                if (statements.length) { 
                    const methodName = "__applyAttributes__";
                    ngOnChangesStatements.push(`this.${methodName}()`);
                    
                    members.push(`${methodName}(){
                        ${statements.join("\n")}
                    }`);

                    return members.join(";\n");
                }
            }
        }
        return "";
    }

    compileNgStyleProcessor(options?: toStringOptions): string { 
        if (options?.hasStyle) {
            return `__processNgStyle(value:any){
                    if (typeof value === "object") {
                        return Object.keys(value).reduce((v: { [name: string]: any }, k) => {
                            if (typeof value[k] === "number") {
                                v[k] = value[k] + "px";
                            } else {
                                v[k] = value[k];
                            }
                            return v;
                        }, {});
                    }
            
                    return value;
                }`;
        }
        return "";
    }

    compileLifeCycle(name: string, statements: string[], parameters:string[] = []): string { 
        if (statements.length) { 
            return `${name}(${parameters.join(",")}){
                ${statements.join("\n")}
            }`;
        }
        return "";
    }

    compileDefaultOptionsPropsType() { 
        return `Partial<${super.compileDefaultOptionsPropsType()}>`;
    }

    compileDefaultOptions(constructorStatements: string[]): string { 
        if (this.needGenerateDefaultOptions) { 
            constructorStatements.push(`
            const defaultOptions = convertRulesToOptions(__defaultOptionRules);
            Object.keys(defaultOptions).forEach(option=>{
                (this as any)[option] = (defaultOptions as any)[option];
            });`);

            return this.compileDefaultOptionsMethod(this.defaultOptionRules ? this.defaultOptionRules.toString() : "[]", []);
        }
        return "";
    }

    compileNgModel() {
        if(!this.modelProp) {
            return "";
        }

        const disabledProp = getProps(this.members).find(m => m._name.toString() === "disabled");
        
        return `
        @HostListener('${this.modelProp.name}Change', ['$event']) change() { }
        @HostListener('onBlur', ['$event']) touched = () => {};
        
        writeValue(value: any): void {
            this.${this.modelProp.name} = value;
        }
    
        ${disabledProp ? `setDisabledState(isDisabled: boolean): void {
            this.disabled = isDisabled;
        }` : ""}
    
        registerOnChange(fn: () => void): void { this.change = fn; }
        registerOnTouched(fn: () => void): void { this.touched = fn; }
        `;
    }

    getAdditionalModules() {
        const modules = this.members.filter(m => m.isNestedComp)
        if (modules.length) {
            return [""].concat(modules.map(m => m.type.toString())).join(',');
        }
        return "";
    }

    toString() { 
        const props = this.heritageClauses.filter(h => h.isJsxComponent).map(h => h.types.map(t => t.type.toString()));
        
        const components = this.context.components || {};

        const modules = Object.keys(components)
            .map((k) => components[k])
            .filter(c => c instanceof AngularComponent && c !== this)
            .map(c => (c as AngularComponent).module)
            .concat(["CommonModule"]);

        const ngOnChangesStatements: string[] = [];
        const ngAfterViewInitStatements: string[] = [];
        const ngOnDestroyStatements: string[] = [];
        const ngAfterViewCheckedStatements: string[] = [];
        const constructorStatements: string[] = [];
        const coreImports: string[] = [];

        const decoratorToStringOptions: toStringOptions = {
            members: this.members,
            newComponentContext: this.viewModel ? "_viewModel" : "",
            disableTemplates: true
        };

        const implementedInterfaces: string[] = [];
        let valueAccessor = "";
        if(this.modelProp) {
            implementedInterfaces.push("ControlValueAccessor");

            valueAccessor = `const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ${this.name}),
                multi: true
            }`

            this.decorator.addParameter("providers", new ArrayLiteral([new SimpleExpression("CUSTOM_VALUE_ACCESSOR_PROVIDER")], true));
        }

        const componentDecorator = this.decorator.toString(decoratorToStringOptions);
        const spreadAttributes = this.compileSpreadAttributes(ngOnChangesStatements, coreImports);

        this.members.filter(m => m.isForwardRefProp).forEach(m => {
            ngAfterViewInitStatements.push(`
                this.${m.name}(this.${m.name}Ref);
            `);
        });

        return `
        ${this.compileImports(coreImports)}
        ${this.compileDefaultOptions(constructorStatements)}
        ${valueAccessor}
        ${componentDecorator}
        ${this.modifiers.join(" ")} class ${this.name} ${props.length ? `extends ${props.join(" ")}`:""} ${implementedInterfaces.length ? `implements ${implementedInterfaces.join(",")}`:""} {
            ${this.members
                .filter(m => !m.inherited && !(m instanceof SetAccessor))
                .map(m => m.toString({
                    members: this.members,
                    componentContext: SyntaxKind.ThisKeyword,
                    newComponentContext: SyntaxKind.ThisKeyword
                }))
            .filter(m => m).join("\n")}
            ${spreadAttributes}
            ${this.compileTrackBy(decoratorToStringOptions)}
            ${this.compileEffects(ngAfterViewInitStatements, ngOnDestroyStatements, ngOnChangesStatements, ngAfterViewCheckedStatements)}
            ${this.compileGetterCache(ngOnChangesStatements)}
            ${this.compileNgModel()}
            ${this.compileLifeCycle("ngAfterViewInit", ngAfterViewInitStatements)}
            ${this.compileLifeCycle("ngOnChanges", ngOnChangesStatements, [`${ngOnChangesParameters[0]}: {[name:string]: any}`])}
            ${this.compileLifeCycle("ngOnDestroy", ngOnDestroyStatements)}
            ${this.compileLifeCycle("ngAfterViewChecked", ngAfterViewCheckedStatements)}
            ${this.compileLifeCycle("constructor",
                constructorStatements.length ?
                    ["super()"].concat(constructorStatements) :
                    constructorStatements
            )}
            ${this.members.filter(m=>m instanceof SetAccessor).join("\n")}
            ${this.compileNgStyleProcessor(decoratorToStringOptions)}
        }
        @NgModule({
            declarations: [${this.name}${this.getAdditionalModules()}],
            imports: [
                ${modules.join(",\n")}
            ],
            exports: [${this.name}${this.getAdditionalModules()}]
        })
        export class ${this.module} {}
        ${this.compileDefaultComponentExport()}
        `;
    }
}
