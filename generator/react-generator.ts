import SyntaxKind from "./base-generator/syntaxKind";
import path from "path";
import { capitalizeFirstLetter } from "./base-generator/utils/string";
import BaseGenerator from "./base-generator";
import {
    Property as BaseProperty,
    GetAccessor as BaseGetAccessor,
    Method as BaseMethod,
    BaseClassMember
} from "./base-generator/expressions/class-members";
import { Identifier } from "./base-generator/expressions/common";
import { Expression, SimpleExpression } from "./base-generator/expressions/base";
import {
    JsxAttribute as BaseJsxAttribute,
    JsxOpeningElement as BaseJsxOpeningElement,
    JsxSpreadAttribute
} from "./base-generator/expressions/jsx";
import { toStringOptions, GeneratorContext } from "./base-generator/types";
import { Component, getProps } from "./base-generator/expressions/component";
import { HeritageClause as BaseHeritageClause } from "./base-generator/expressions/class";
import { BindingElement, BindingPattern } from "./base-generator/expressions/binding-pattern";
import { VariableStatement, VariableDeclarationList, VariableDeclaration } from "./base-generator/expressions/variables";
import { PropertyAccess as BasePropertyAccess } from "./base-generator/expressions/property-access";
import { ReturnStatement, Block } from "./base-generator/expressions/statements";
import { getModuleRelativePath } from "./base-generator/utils/path-utils";
import {
    ExpressionWithTypeArguments,
    TypeExpression,
    TypeReferenceNode as BaseTypeReferenceNode
} from "./base-generator/expressions/type";
import { Parameter } from "./base-generator/expressions/functions";
import { ComponentInput as BaseComponentInput } from "./base-generator/expressions/component-input";
import { ObjectLiteral } from "./base-generator/expressions/literal";
import { Decorator } from "./base-generator/expressions/decorator";

const eventsDictionary = {
    pointerover: "onPointerOver",
    pointerout: "onPointerOut",
    pointerdown: "onPointerDown",
    click: "onClick"
}

function getLocalStateName(name: Identifier | string, componentContext: string="") {
    return `${componentContext}__state_${name}`;
}

function getPropName(name: Identifier | string, componentContext:string="") {
    return `${componentContext}props.${name}`;
}

function stateSetter(stateName: Identifier | string) {
    return `__state_set${capitalizeFirstLetter(stateName)}`
}

export class ComponentInput extends BaseComponentInput { 
    toString() { 
        const inherited = this.baseTypes.map(t => `...${t}`);
       
        const types = this.heritageClauses.reduce((t: string[], h) => t.concat(h.typeNodes.map(t => `typeof ${t}`)), []);
        const typeName = `${this.name}Type`;

        const typeDeclaration = `export declare type ${typeName} ${types.concat([`{
            ${this.members.filter(m => !(m as Property).inherited).map(p => p.typeDeclaration()).join(";\n")}
        }`]).join("&")}`;

        return `${typeDeclaration}
        ${this.modifiers.join(" ")} const ${this.name}:${typeName}={
           ${inherited.concat(
               this.members
                   .filter(m => !(m as Property).inherited && (m as Property).initializer && 
                   (m.decorators.find(d => d.name !== "TwoWay") || (m as Property).questionOrExclamationToken !== "?"))
                   .map(p => (p as Property).defaultDeclaration())
           ).join(",\n")}
        };`;
    }
}

export class HeritageClause extends BaseHeritageClause { 
    constructor(token: string, types: ExpressionWithTypeArguments[], context: GeneratorContext) {
        super(token, types, context);
        this.defaultProps = 
        types.reduce((defaultProps: string[], { type }) => {
            const importName = type.replace("typeof ", "");
            const component = context.components && context.components[importName]
            if (component && component.compileDefaultProps() !== "") {
                defaultProps.push(`${component.defaultPropsDest().replace(component.name.toString(), importName)}`);
            }
            return defaultProps;
        }, []);
    }
}

export class PropertyAccess extends BasePropertyAccess {
    compileStateSetting(state: string, property: Property, options?: toStringOptions) {
        const setState = `${stateSetter(this.name)}(${state})`;
        if (property.decorators.find(d => d.name === "TwoWay")) { 
            return `(${setState}, props.${this.name}Change!(${state}))`;
        }
        return setState;
    }
}

export class Property extends BaseProperty { 
    defaultProps(){ 
        return this.defaultDeclaration();
    }

    typeDeclaration() {
        if (this.decorators.find(d => d.name === "Slot")) {
            return `${this.name}${this.questionOrExclamationToken}:React.ReactNode`;
        }
        if (this.decorators.find(d => d.name === "Ref" || d.name === "ApiRef")){ 
            return `${this.name}:any`;
        }
        return super.typeDeclaration();
    }

    getter(componentContext?: string) { 
        componentContext = this.processComponentContext(componentContext);
        if (this.decorators.find(d => d.name === "InternalState") || this.decorators.length===0) {
            return getLocalStateName(this.name, componentContext);
        } else if (this.decorators.find(d => d.name === "OneWay" ||  d.name === "Event" || d.name === "Template" || d.name === "Slot")) {
            return getPropName(this.name, componentContext);
        } else if (this.decorators.find(d => d.name === "Ref" || d.name === "ApiRef")) {
            return `${this.name}.current${this.questionOrExclamationToken}`
        } else if (this.decorators.find(d => d.name === "TwoWay")) { 
            const propName = getPropName(this.name, componentContext);
            return `(${propName}!==undefined?${propName}:${getLocalStateName(this.name, componentContext)})`;
        }
        throw `Can't parse property: ${this._name}`;
    }

    getDependency() { 
        if (this.decorators.find(d => d.name === "InternalState") || this.decorators.length === 0) {
            return [getLocalStateName(this.name)];
        } else if (this.decorators.find(d => d.name === "OneWay" || d.name === "Event" || d.name === "Template" || d.name === "Slot")) {
            return [getPropName(this.name)];
        } else if (this.decorators.find(d => d.name === "Ref" || d.name === "ApiRef")) {
            return [this.name.toString()]
        } else if (this.decorators.find(d => d.name === "TwoWay")) {
            return [getPropName(this.name), getLocalStateName(this.name), getPropName(`${this.name}Change`)];
        }
        throw `Can't parse property: ${this._name}`;
    }

    inherit() { 
        return new Property(this.decorators, this.modifiers, this._name, this.questionOrExclamationToken, this.type, this.initializer, true);
    }

    toString() { 
        if (this.decorators.find(d => d.name === "TwoWay")) {
            const propName = getPropName(this.name);
            const initializer = this.initializer ? `||${this.initializer.toString()}` : "";
            return `const [${getLocalStateName(this.name)}, ${stateSetter(this.name)}] = useState(()=>(${propName}!==undefined?${propName}:props.default${capitalizeFirstLetter(this.name)})${initializer})`;
        }
        return `const [${getLocalStateName(this.name)}, ${stateSetter(this.name)}] = useState(${this.initializer})`;
    }
}

export class Method extends BaseMethod {
    getDependency(properties: Property[] = []) {
        const dependency = this.body.getDependency();
        const additionalDependency = [];

        if (dependency.find(d => d === "props")) { 
            additionalDependency.push("props");
        }

        const result = [...new Set(dependency)]
            .map(d => properties.find(p => p.name.toString() === d))
            .filter(d => d)
            .reduce((d: string[], p) => d.concat(p!.getDependency()), [])
            .concat(additionalDependency);
        
        if (additionalDependency.indexOf("props") > -1) { 
            return result.filter(d => !d.startsWith("props."));
        }
        
        return result;
    }
}

export class GetAccessor extends BaseGetAccessor { 
    getter() { 
        return `${super.getter()}()`;
    }
}

function getSubscriptions(methods: BaseMethod[]) {
    return methods.map(m => {
        const [event, parameters] = m.decorators.find(d => d.name === "Listen")!.expression.arguments;
        
        let target: string | undefined;
        if (parameters instanceof ObjectLiteral) {
            target = parameters.getProperty("target")?.toString();
        }
        
        return {
            name: m.name,
            target,
            eventName: event?.toString()
        }
    }).filter(s => s.target);
}

export class ReactComponent extends Component {
    createRestPropsGetter(members: BaseClassMember[]) {
        const props = getProps(members);
        const bindingElements = props.map(p => new BindingElement(
                undefined,
                undefined,
                p._name,
            )).concat([
                new BindingElement(
                    SyntaxKind.DotDotDotToken,
                    undefined,
                    new Identifier("restProps"))
            ]);

        const statements = [new VariableStatement(
            undefined,
            new VariableDeclarationList(
                [new VariableDeclaration(
                    new BindingPattern(
                        bindingElements,
                        "object"
                    ),
                    undefined,
                    new PropertyAccess(
                        new SimpleExpression("this"),
                        new Identifier("props")
                    )
                )],
                SyntaxKind.ConstKeyword
            )
        ), new ReturnStatement(new SimpleExpression("restProps"))];

        return  new GetAccessor(undefined, undefined, new Identifier('restAttributes'), [], undefined, new Block(statements, true));
    }

    compileImportStatements(hooks: string[], compats: string[]) {
        return [`import React, {${hooks.concat(compats).join(",")}} from 'react';`];
    }

    compileImports() {
        const imports: string[] = [];
        const hooks: string[] = [];
        const compats: string[] = [];

        if (this.internalState.length || this.state.length) {
            hooks.push("useState");
        }

        if (this.listeners.length || this.methods.length) {
            hooks.push("useCallback");
        }

        if (getSubscriptions(this.listeners).length || this.effects.length) {
            hooks.push("useEffect");
        }

        if (this.refs.length || this.apiRefs.length) {
            hooks.push("useRef");
        }

        if (this.api.length) {
            hooks.push("useImperativeHandle");
            compats.push("forwardRef");
        }

        if(this.apiRefs.length) {
            imports.splice(-1, 0, ...this.apiRefs.reduce((imports: string[], ref) => {
                const baseComponent = this.context.components![ref.type!.toString()] as ReactComponent;
                if(this.context.dirname) {
                    const relativePath = getModuleRelativePath(this.context.dirname, baseComponent.context.path!);
                    imports.push(`import {${baseComponent.name}Ref as ${ref.type}Ref} from "${this.processModuleFileName(relativePath.replace(path.extname(relativePath), ''))}"`);
                }
                return imports;
            }, []));
        }

        this.compileDefaultOptionsImport(imports);

        return imports.concat(this.compileImportStatements(hooks, compats)).join(";\n");
    }

    defaultPropsDest() {
        return `${this.name.toString()}.defaultProps`;
    }


    compileDefaultProps() {
        const defaultProps = this.heritageClauses
            .filter(h => h.defaultProps.length).map(h => `...${h.defaultProps}`)
            .concat(
                this.props.filter(p => !p.inherited && p.initializer)
                    .map(p => (p as Property).defaultProps())
            );

        if (this.defaultOptionRules && this.needGenerateDefaultOptions) { 
            defaultProps.push(`...convertRulesToOptions(${this.defaultOptionRules})`);
        }

        if (this.needGenerateDefaultOptions) { 
            return `
                function __createDefaultProps(){
                    return {
                        ${defaultProps.join(",\n")}
                    }
                }
                ${this.defaultPropsDest()}= __createDefaultProps();
            `;
        }
        if (defaultProps.length) {
            return `${this.defaultPropsDest()} = {
                ${defaultProps.join(",\n")}
            }`;
        }

        return "";
    }

    stateDeclaration() {
        return `${this.state.concat(this.internalState).join(";\n")}`;
    }

    compileUseEffect() {
        const subscriptions = getSubscriptions(this.listeners);

        const effects = this.effects;

        const effectsString = effects.map(e => `useEffect(${e.arrowDeclaration(this.getToStringOptions())}, 
        [${e.getDependency(this.props.concat(this.state).concat(this.internalState))}])`).join(";\n");

        let subscriptionsString = "";
        if (subscriptions.length) {
            const { add, cleanup } = subscriptions.reduce(({ add, cleanup }, s) => {
                (add as string[]).push(`${s.target}.addEventListener(${s.eventName}, ${s.name});`);
                (cleanup as string[]).push(`${s.target}.removeEventListener(${s.eventName}, ${s.name});`);
                return { add, cleanup }
            }, { add: [], cleanup: [] });

            subscriptionsString = `useEffect(()=>{
                    ${add.join("\n")}
                    return function cleanup(){
                        ${cleanup.join("\n")}
                    }
                });`;
        }
        return subscriptionsString + effectsString;
    }

    compileComponentRef() {
        if(this.api.length) {
            return `export type ${this.name}Ref = {${this.api.map(a => a.typeDeclaration())}}`
        }
        return "";
    }

    compileUseImperativeHandle() {
        if(this.api.length) {
            const api = this.api.reduce((r: { methods: string[], deps: string[]}, a) => {
                r.methods.push(`${a.name}: ${a.arrowDeclaration(this.getToStringOptions())}`);

                r.deps = [...new Set(r.deps
                    .concat(a.getDependency(
                        this.props.concat(this.state).concat(this.internalState)
                    )))];
                
                return r;
            }, { methods: [], deps: [] });

            return `useImperativeHandle(ref, () => ({${api.methods.join(",\n")}}), [${api.deps.join(",")}])`
        }

        return "";
    }

    compileUseRef() {
        return this.refs.map(r => {
            return `const ${r.name}=useRef<${r.type}>()`;
        }).concat(this.apiRefs.map(r => {
            return `const ${r.name}=useRef<${r.type}Ref>()`;
        })).join(";\n");
    }

    compileComponentInterface() {

        const props = this.isJSXComponent ? [`props: ${this.compilePropsType()}`] : this.props
                .concat(this.state)
                .map(p => p.typeDeclaration());

        return `interface ${this.name}{
            ${  props
                .concat(this.internalState.concat(this.refs, this.apiRefs).concat(this.slots.filter(s=>!s.inherited)).map(p => p.typeDeclaration()))
                .concat(this.listeners.map(l => l.typeDeclaration()))
                .concat(this.methods.map(m => m.typeDeclaration()))
                .concat([""])
                .join(";\n")
            }
        }`;
    }

    compileViewModelArguments(): string[] {
        const compileState = (state: BaseProperty[]) => state.map(s => `${s.name}:${s.getter()}`);
        const state = compileState(this.state);
        const internalState = compileState(this.internalState);

        const props = this.isJSXComponent ?
            [`props:{${["...props"].concat(state).join(",\n")}}`].concat(internalState) :
            ["...props"].concat(internalState).concat(state);

        return props
            .concat(this.listeners.map(l => l.name.toString()))
            .concat(this.refs.map(r => r.name.toString()))
            .concat(this.apiRefs.map(r => r.name.toString()))
            .concat(
                this.methods.map(m => m._name.toString() !== m.getter() ? `${m._name}:${m.getter()}` : m.getter())
            );
    }

    compilePropsType() {
        if (this.isJSXComponent) { 
            return `${this.heritageClauses[0].defaultProps[0]}Type`;
        }
        return `{
            ${this.props
                .concat(this.state)
                .concat(this.slots)
                .map(p => p.typeDeclaration()).join(",\n")}
        }`;
    }

    getToStringOptions() { 
        return {
            members: this.members,
            componentContext: "this",
            newComponentContext: ""
        };
    }

    toString() {
        return `
            ${this.compileImports()}
            ${this.compileComponentRef()}
            ${this.compileComponentInterface()}

            ${this.api.length === 0 
                ? `${this.modifiers.join(" ")} function ${this.name}(props: ${this.compilePropsType()}){`
                : `const ${this.name} = forwardRef<${this.name}Ref, ${this.compilePropsType()}>((props: ${this.compilePropsType()}, ref) => {`}
                ${this.compileUseRef()}
                ${this.stateDeclaration()}
                ${this.compileUseImperativeHandle()}
                ${this.listeners.concat(this.methods)
                    .map(m => {
                        return `const ${m.name}=useCallback(${m.declaration(this.getToStringOptions())}, [${
                            m.getDependency(this.internalState.concat(this.state).concat(this.props).concat(this.refs))
                        }]);`;
                    }).join("\n")}
                ${this.compileUseEffect()}
                return ${this.view}(${this.viewModel}({
                        ${ this.compileViewModelArguments().join(",\n")}
                    })
                );
            ${this.api.length === 0 ? `}` : `});\n${this.modifiers.join(" ")} ${this.name};`}
            
            ${this.compileDefaultProps()}
            ${this.compileDefaultOptionsMethod("[]", [
                `${this.defaultPropsDest()} = {
                    ...__createDefaultProps(),
                    ...convertRulesToOptions(__defaultOptionRules)
                };`
            ])}`;
    }
}

export class JsxAttribute extends BaseJsxAttribute { 
    toString(options?:toStringOptions) { 
        const name = this.name.toString(options);
        return `${(eventsDictionary as any)[name] || name}=${this.initializer.toString(options)}`;
    }
}

export class JsxOpeningElement extends BaseJsxOpeningElement { 
    processTagName(tagName: Expression) { 
        return tagName.toString() === "Fragment" ? new Identifier("React.Fragment") : tagName;
    }
}

export class JsxSelfClosingElement extends JsxOpeningElement{
    toString(options?:toStringOptions) { 
        return `<${this.tagName.toString(options)} ${this.attributesString(options)}/>`;
    }
}

export class TypeReferenceNode extends BaseTypeReferenceNode { 
    context: GeneratorContext;
    constructor(typeName: Identifier, typeArguments: TypeExpression[] | undefined, context: GeneratorContext) {
        super(typeName, typeArguments);
        this.context = context;
    }
    toString() { 
        if (this.context.components?.[this.typeName.toString()] instanceof ComponentInput) {
            return `typeof ${super.toString()}`;
        }
        return super.toString();
    }
}
 
export class JsxClosingElement extends JsxOpeningElement { 
    constructor(tagName: Expression) { 
        super(tagName, [], []);
    }

    toString(options?:toStringOptions) { 
        return `</${this.tagName.toString(options)}>`;
    }
}

export class Generator extends BaseGenerator {
    createHeritageClause(token: string, types: ExpressionWithTypeArguments[]) { 
        return new HeritageClause(token, types, this.getContext());
    }

    createComponent(componentDecorator: Decorator, modifiers: string[]|undefined, name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) { 
        return new ReactComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members, this.getContext());
    }

    createComponentBindings(decorators: Decorator[], modifiers: string[]|undefined, name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) { 
        return new ComponentInput(decorators, modifiers, name, typeParameters, heritageClauses, members)
    }

    createJsxAttribute(name: Identifier, initializer: Expression) {
        return new JsxAttribute(name, initializer);
    }

    createJsxOpeningElement(tagName: Identifier, typeArguments: any[], attributes?: Array<JsxAttribute|JsxSpreadAttribute>) {
        return new JsxOpeningElement(tagName, typeArguments, attributes);
    }

    createJsxSelfClosingElement(tagName: Identifier, typeArguments: any[], attributes?: Array<JsxAttribute|JsxSpreadAttribute>) {
        return new JsxSelfClosingElement(tagName, typeArguments, attributes);
    }

    createJsxClosingElement(tagName: Identifier) {
        return new JsxClosingElement(tagName);
    }

    createMethod(decorators: Decorator[] = [], modifiers: string[] = [], asteriskToken: string|undefined, name: Identifier, questionToken: string | undefined, typeParameters: any, parameters: Parameter[], type: TypeExpression | undefined, body: Block) {
        return new Method(decorators, modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body);
    }

    createProperty(decorators: Decorator[], modifiers: string[] | undefined, name: Identifier, questionOrExclamationToken?: string, type?: TypeExpression, initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }

    createGetAccessor(decorators: Decorator[]|undefined, modifiers: string[]|undefined, name: Identifier, parameters: Parameter[], type?: TypeExpression, body?: Block) {
        return new GetAccessor(decorators, modifiers, name, parameters, type, body);
    }

    createPropertyAccess(expression: Expression, name: Identifier) {
        return new PropertyAccess(expression, name);
    }

    createTypeReferenceNode(typeName: Identifier, typeArguments?: TypeExpression[]) {
        return new TypeReferenceNode(typeName, typeArguments, this.getContext());
    }
}

export default new Generator();
