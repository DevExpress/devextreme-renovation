import { Identifier } from "./common";
import { GetAccessor, Property, Method, BaseClassMember } from "./class-members";
import { SimpleExpression, Expression } from "./base";
import { ObjectLiteral } from "./literal";
import { HeritageClause, inheritMembers, Class, Heritable } from "./class";
import { GeneratorContext } from "../types";
import { Block } from "./statements";
import { getModuleRelativePath } from "../utils/path-utils";
import { Decorator } from "./decorator";

export function isJSXComponent(heritageClauses: HeritageClause[]) {
    return heritageClauses
        .reduce((typeNodes: string[], h) => typeNodes.concat(h.typeNodes), [])
        .filter(t => t === "JSXComponent").length;
}

export function getProps(members: BaseClassMember[]): Property[] {
    return members.filter(m => m.decorators
        .find(d =>
            d.name === "OneWay" ||
            d.name === "TwoWay" ||
            d.name === "Event" ||
            d.name === "Template" ||
            d.name === "Slot")
    ) as Property[];
}

export class Component extends Class implements Heritable {
    props: Property[] = [];
    state: Property[] = [];
    internalState: Property[];
    refs: Property[];
    apiRefs: Property[];


    listeners: Method[];
    methods: Method[];
    effects: Method[];
    slots: Property[];

    api: Method[];

    view: any;
    viewModel: any;

    context: GeneratorContext;

    defaultOptionRules?: Expression | null;

    get name() { 
        return this._name.toString();
    }

    addPrefixToMembers(members: Array<Property | Method>, heritageClauses: HeritageClause[]) { 
        if (isJSXComponent(heritageClauses)) { 
            members.filter(m => !m.inherited && m instanceof GetAccessor).forEach(m => {
                m.prefix = "__";
            });
        }
        return members;
    }

    get needGenerateDefaultOptions(): boolean { 
        return !!this.context.defaultOptionsModule && (!this.defaultOptionRules || this.defaultOptionRules.toString() !== "null");
    }

    processMembers(members: Array<Property | Method>, heritageClauses: HeritageClause[]) { 
        members = super.processMembers(
            inheritMembers(heritageClauses,
                this.addPrefixToMembers(members, heritageClauses)),
            heritageClauses);
        
        members.push(this.createRestPropsGetter(members));
        return members;
    }

    constructor(decorator: Decorator, modifiers: string[] = [], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[] = [], members: Array<Property | Method>, context: GeneratorContext) {
        super([decorator], modifiers, name, typeParameters, heritageClauses, members);
        members = this.members;
        this.props = members
            .filter(m => m.decorators.find(d => d.name === "OneWay" || d.name === "Event" || d.name === "Template")) as Property[];

        const refs = members.filter(m => m.decorators.find(d => d.name === "Ref")).reduce((r: {refs: Property[], apiRefs: Property[]}, p) => {
            if(context.components && context.components[p.type!.toString()] instanceof Component) {
                p.decorators.find(d => d.name === "Ref")!.expression.expression = new SimpleExpression("ApiRef");
                r.apiRefs.push(p as Property);
            } else {
                r.refs.push(p as Property);
            }
            return r;
        }, { refs: [], apiRefs: []});
        this.refs = refs.refs;
        this.apiRefs = refs.apiRefs;

        this.internalState = members
            .filter(m =>
                m instanceof Property &&
                (m.decorators.length === 0 || m.decorators.find(d => d.name === "InternalState"))
            ) as Property[];

        this.state = members.filter(m => m.decorators.find(d => d.name === "TwoWay")) as Property[];

        this.methods = members.filter(m => m instanceof Method && m.decorators.length === 0 || m instanceof GetAccessor) as Method[];

        this.listeners = members.filter(m => m.decorators.find(d => d.name === "Listen")) as Method[];

        this.effects = members.filter(m => m.decorators.find(d => d.name === "Effect")) as Method[];

        this.api = members.filter(m => m.decorators.find(d => d.name === "Method")) as Method[];

        this.slots = members.filter(m => m.decorators.find(d => d.name === "Slot")) as Property[];

        const parameters = (decorator.expression.arguments[0] as ObjectLiteral);

        this.view = parameters.getProperty("view");
        this.viewModel = parameters.getProperty("viewModel") || "";

        this.defaultOptionRules = parameters.getProperty("defaultOptionRules");

        this.context = context;

        if (context.defaultOptionsImport) { 
            context.defaultOptionsImport.add("convertRulesToOptions");
            context.defaultOptionsImport.add("Rule");
        }
    }

    compileDefaultProps() { 
        return "";
    }

    get heritageProperies() {
        return this.members
            .filter(m => m instanceof Property &&
                m.decorators.find(d =>
                    d.name === "OneWay" ||
                    d.name === "TwoWay" ||
                    d.name === "Event" ||
                    d.name === "Slot" ||
                    d.name === "Template"))
            .map(p=>p as Property)
            .map(p => {
                const property = new Property(p.decorators, p.modifiers, p._name, p.questionOrExclamationToken, p.type, p.initializer);
                property.inherited = true;
                return property;
            });
    }

    defaultPropsDest() { 
        return "";
    }

    createRestPropsGetter(members: BaseClassMember[]) {
        return new GetAccessor(
            undefined,
            undefined,
            new Identifier('restAttributes'),
            [], undefined,
            new Block([
                new SimpleExpression("return {}")
            ], true));
    }

    compileDefaultOptionsImport(imports: string[]): void { 
        if (!this.context.defaultOptionsImport && this.needGenerateDefaultOptions && this.context.defaultOptionsModule && this.context.dirname) {
            const relativePath = getModuleRelativePath(this.context.dirname, this.context.defaultOptionsModule);
            imports.push(`import {convertRulesToOptions, Rule} from "${relativePath}"`);
        }
    }

    compilePropsType() {
        return this.isJSXComponent ? this.heritageClauses[0].defaultProps : this.name;
    }

    compileDefaultOptionsMethod(defaultOptionRulesInitializer:string = "[]", statements: string[]=[]) { 
        if (this.needGenerateDefaultOptions) { 
            const defaultOptionsTypeName = `${this.name}OptionRule`;
            const defaultOptionsTypeArgument = this.compilePropsType();
            return `type ${defaultOptionsTypeName} = Rule<${defaultOptionsTypeArgument}>;

            const __defaultOptionRules:${defaultOptionsTypeName}[] = ${defaultOptionRulesInitializer};
            export function defaultOptions(rule: ${defaultOptionsTypeName}) { 
                __defaultOptionRules.push(rule);
                ${statements.join("\n")}
            }`;
        }
        return "";
    }

    processModuleFileName(module: string) {
        return module;
    }

    get isJSXComponent() {
        return isJSXComponent(this.heritageClauses);
    }

}
