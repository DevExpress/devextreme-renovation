import SyntaxKind from "./base-generator/syntaxKind";
import path from "path";
import { capitalizeFirstLetter, removePlural } from "./base-generator/utils/string";
import BaseGenerator from "./base-generator";
import {
    Property as BaseProperty,
    GetAccessor as BaseGetAccessor,
    Method as BaseMethod,
    BaseClassMember
} from "./base-generator/expressions/class-members";
import { Identifier, Call } from "./base-generator/expressions/common";
import { Expression, SimpleExpression } from "./base-generator/expressions/base";
import {
    JsxAttribute as BaseJsxAttribute,
    JsxExpression,
    JsxElement as BaseJsxElement,
    JsxOpeningElement as BaseJsxOpeningElement,
    JsxSpreadAttribute
} from "./base-generator/expressions/jsx";
import { toStringOptions, GeneratorContext, isTypeArray } from "./base-generator/types";
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
    TypeReferenceNode as BaseTypeReferenceNode,
    FunctionTypeNode,
    SimpleTypeExpression
} from "./base-generator/expressions/type";
import { Parameter } from "./base-generator/expressions/functions";
import { ComponentInput as BaseComponentInput } from "./base-generator/expressions/component-input";
import { ObjectLiteral } from "./base-generator/expressions/literal";
import { Decorator } from "./base-generator/expressions/decorator";
import { PropertyAssignment, SpreadAssignment } from "./base-generator/expressions/property-assignment";
import { Decorators } from "./component_declaration/decorators";
import { TypeParameterDeclaration } from "./base-generator/expressions/type-parameter-declaration";

const eventsDictionary = {
    pointerover: "onPointerOver",
    pointerout: "onPointerOut",
    pointerdown: "onPointerDown",
    click: "onClick"
}

function getLocalStateName(name: Identifier | string, componentContext: string = "") {
    return `${componentContext}__state_${name}`;
}

function getPropName(name: Identifier | string, componentContext: string = "", scope = "props.") {
    return `${componentContext}${scope}${name}`;
}

function stateSetter(stateName: Identifier | string) {
    return `__state_set${capitalizeFirstLetter(stateName)}`
}

function getTemplatePropName(name: Identifier | string, propName: string) {
    return name.toString().replace(/template/g, propName)
        .replace(/(.+)(Template)/g, `$1${capitalizeFirstLetter(propName)}`);
}

function buildTemplateProperty(templateMember: Property, members: BaseClassMember[], propName: string, keepType = false) {
    const templatePropName = getTemplatePropName(templateMember._name, propName);
    if (!members.find(m => m._name.toString() === templatePropName)) {
        return new Property(
            [new Decorator(new Call(new Identifier("OneWay"), undefined, []), {})],
            [],
            new Identifier(templatePropName),
            SyntaxKind.QuestionToken,
            keepType ? templateMember.type : undefined,
            undefined
        );
    } else {
        throw `You can't use '${templatePropName}' property. It'll be generated for '${templateMember._name}' template property.`
    }
}

export class ComponentInput extends BaseComponentInput {
    createProperty(decorators: Decorator[], modifiers: string[] | undefined, name: Identifier, questionOrExclamationToken?: string, type?: TypeExpression, initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }

    buildTemplateProperties(templateMember: Property, members: BaseClassMember[]) {
        return [
            buildTemplateProperty(templateMember, members, "render"),
            buildTemplateProperty(templateMember, members, "component")
        ];
    }

    toString() {
        const inherited = this.baseTypes.map(t => `...${t}`);

        const types = this.heritageClauses.reduce((t: string[], h) => t.concat(h.typeNodes.map(t => `typeof ${t}`)), []);
        const typeName = `${this.name}Type`;

        const properties = this.members.
            filter(m => !(m as Property).inherited) as Property[];

        const typeDeclaration = `export declare type ${typeName} = ${types.concat([`{
            ${properties.map(p => p.typeDeclaration()).join(";\n")}
        }`]).join("&")}`;

        const typeCasting = properties.some(p =>
            p.questionOrExclamationToken === SyntaxKind.ExclamationToken && !p.initializer ||
            p.type.toString()==="any" && !p.questionOrExclamationToken && !p.initializer
        )
            ? ` as ${typeName}`
            : "";

        const declarationModifiers = this.modifiers.indexOf("default") !== -1 ? [] : this.modifiers;

        const propertiesWithInitializer = this.members
            .filter(m =>
                !(m as Property).inherited && (m as Property).initializer &&
                (m.decorators.find(d => d.name !== Decorators.TwoWay) || (m as Property).questionOrExclamationToken !== "?")) as Property[];

        return `${this.exportNestedComponents()}
        ${typeDeclaration}
        ${declarationModifiers.join(" ")} const ${this.name}:${typeName}={
           ${inherited
                .concat(propertiesWithInitializer.map(p => p.defaultDeclaration()))
                .join(",\n")}
        }${typeCasting};
        ${declarationModifiers !== this.modifiers ? `${this.modifiers.join(" ")} ${this.name}` : ""}`;
    }

    exportNestedComponents() {
        const nestedComponents = this.members.filter(m => m.isNestedProp);
        if (nestedComponents.length) {
            return nestedComponents.map(m => {
                let name = capitalizeFirstLetter(m.name);
                if (isTypeArray(m.type)) {
                    name = removePlural(name);
                }
                return `export const ${name} = () => null;`
            }).join('\n');
        }
        return "";
    }

    createChildrenForNested(members: Array<BaseProperty | Method>) {        
        const hasChildren = members.some(m => m.isSlot && m.name === "children");
        const hasNested = members.some(m => m.isNestedProp);
        if (hasNested && !hasChildren) {
            return new Property(
                [new Decorator(new Call(new Identifier(Decorators.Slot), undefined, undefined), {})],
                undefined,
                new Identifier('children'),
                "?",
                undefined,
                undefined,
                undefined,
            );
        }
        return null;
    }
    

    processMembers(members: Array<BaseProperty | Method>) {
        members = super.processMembers(members).filter(m => !m.isNestedComp);
        const children = this.createChildrenForNested(members);
        if (children !== null) {
            members.push(children);
        }
        return members;
    }
}

export class HeritageClause extends BaseHeritageClause {
    constructor(token: string, types: ExpressionWithTypeArguments[], context: GeneratorContext) {
        super(token, types, context);
        this.defaultProps = types.reduce((defaultProps: string[], { type, isJsxComponent }) => {

            if (isJsxComponent) {
                defaultProps.push(type.toString());
            } else {
                const importName = type.toString().replace("typeof ", "");
                const component = context.components && context.components[importName];
                if (component && component.compileDefaultProps() !== "") {
                    defaultProps.push(
                        `${component.defaultPropsDest().replace(component.name.toString(), importName)}${
                        type.toString().indexOf("typeof ") === 0 ? "Type" : ""
                        }`
                    );
                }
            }
            return defaultProps;
        }, []);
    }
}

export class PropertyAccess extends BasePropertyAccess {
    compileStateSetting(state: string, property: Property, options?: toStringOptions) {
        const setState = `${stateSetter(this.name)}(${getLocalStateName(this.name)} => ${state})`;
        if (property.isState) {
            return `(${setState}, props.${this.name}Change!(${state}))`;
        }
        return setState;
    }

    needToCreateAssignment(property: BaseProperty, elements: BindingElement[]) {
        return !property.canBeDestructured &&
            !property.isRefProp &&
            (elements.length === 0 || elements.some(e => (e.propertyName || e.name).toString() === property._name.toString()));
    }

    processProps(result: string, options: toStringOptions, elements: BindingElement[]=[]) {
        const props = getProps(options.members);
        const hasComplexProps = props.some(p => this.needToCreateAssignment(p, elements));

        if (hasComplexProps && options.componentContext === SyntaxKind.ThisKeyword) {
            const hasSimpleProps = props.some(p => p.canBeDestructured);
            const initValue = (hasSimpleProps ? [new SpreadAssignment(new Identifier("props"))] : []) as (PropertyAssignment | SpreadAssignment)[];

            const destructedProps = props.reduce((acc, p) => {
                if(this.needToCreateAssignment(p, elements)){
                    acc.push(new PropertyAssignment(
                        p._name,
                        new PropertyAccess(
                          new PropertyAccess(
                            new Identifier(this.calculateComponentContext(options)),
                            new Identifier("props")
                          ),
                          p._name
                        )
                    ))
                }
                return acc;
            }, initValue)

            const expression = new ObjectLiteral(destructedProps, true);
            return expression.toString(options);
        }

        return result;
    }
}

export class Property extends BaseProperty {
    defaultProps() {
        return this.defaultDeclaration();
    }

    typeDeclaration() {
        let type = this.type;

        if (this.isSlot) {
            type =  "React.ReactNode";
        }
        if (this.decorators.find(d => d.name === Decorators.Ref || d.name === Decorators.ApiRef)) {
            type = "any";
        }
        if (this.isRefProp || this.isForwardRefProp) { 
            type =  `RefObject<${this.type}>`;
        }

        const questionOrExclamationToken = this.questionOrExclamationToken === SyntaxKind.ExclamationToken || type === "any"
            ? ""
            : this.questionOrExclamationToken;
       
        return `${this.name}${questionOrExclamationToken}:${type}`;
    }

    compileNestedPropGetter(componentContext: string, scope: string) {
        const propName = getPropName(this.name, componentContext, scope);
        const isArray = isTypeArray(this.type);
        const indexGetter = isArray ? "" : "?.[0]";
        let nestedName = capitalizeFirstLetter(this.name);
        if (isArray) {
            nestedName = removePlural(nestedName);
        }

        return `(${propName} || __getNestedFromChild("${nestedName}")${indexGetter})`
    }

    getter(componentContext?: string) {
        componentContext = this.processComponentContext(componentContext);
        const scope = this.processComponentContext(this.scope);
        if (this.isInternalState) {
            return getLocalStateName(this.name, componentContext);
        } else if (this.decorators.some(d => d.name === Decorators.OneWay || d.name === Decorators.Event || d.name === Decorators.Template || d.name === Decorators.Slot)) {
            return getPropName(this.name, componentContext, scope);
        } else if (this.decorators.some(d => d.name === Decorators.Ref || d.name === Decorators.ApiRef || d.name === Decorators.RefProp || d.name === Decorators.ForwardRefProp)) {
            return `${scope}${this.name}${scope ? this.questionOrExclamationToken : ""}.current!`;
        } else if (this.isState) {
            const propName = getPropName(this.name, componentContext, scope);
            return `(${propName}!==undefined?${propName}:${getLocalStateName(this.name, componentContext)})`;
        } else if (this.isNestedProp) {
            return this.compileNestedPropGetter(componentContext, scope);
        }
        throw `Can't parse property: ${this._name}`;
    }

    getDependency() {
        if (this.isInternalState) {
            return [getLocalStateName(this.name)];
        } else if (this.decorators.some(d => d.name === Decorators.OneWay || d.name === Decorators.Event || d.name === Decorators.Template || d.name === Decorators.Slot)) {
            return [getPropName(this.name)];
        } else if (this.decorators.some(d => d.name === Decorators.Ref || d.name === Decorators.ApiRef || d.name === Decorators.RefProp || d.name===Decorators.ForwardRefProp)) {
            const scope = this.processComponentContext(this.scope)
            return this.questionOrExclamationToken === "?" ? [`${scope}${this.name.toString()}${scope ? this.questionOrExclamationToken : ""}.current`] : [];
        } else if (this.isState) {
            return [getPropName(this.name), getLocalStateName(this.name), getPropName(`${this.name}Change`)];
        } else if (this.isNestedProp) {
            return [getPropName(this.name)];
        }
        throw `Can't parse property: ${this._name}`;
    }

    inherit() {
        return new Property(this.decorators, this.modifiers, this._name, this.questionOrExclamationToken, this.type, this.initializer, true);
    }

    toString() {
        if (this.isState) {
            const propName = getPropName(this.name);
            const defaultExclamationToken =
                this.initializer && this.questionOrExclamationToken !== SyntaxKind.QuestionToken
                    ? SyntaxKind.ExclamationToken
                    : "";
            
            return `const [${getLocalStateName(this.name)}, ${stateSetter(this.name)}] = useState(()=>${propName}!==undefined?${propName}:props.default${capitalizeFirstLetter(this.name)}${defaultExclamationToken})`;
        }
        return `const [${getLocalStateName(this.name)}, ${stateSetter(this.name)}] = useState(${this.initializer})`;
    }

    get canBeDestructured() {
        if (this.isState || this.isRefProp || this.isNestedProp) {
            return false;
        }
        return super.canBeDestructured;
    }
}

export class GetAccessor extends BaseGetAccessor {
    getter() {
        return `${super.getter()}()`;
    }
}

export class Method extends BaseMethod {
    filterDependencies(dependencies: string[]): string[] {
        return dependencies.filter(d => d !== "props");
    }
}

function getSubscriptions(methods: Method[]) {
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
    processMembers(members: Array<BaseProperty | Method>) {
        members.forEach(m => {
            const forwardRefIndex = m.decorators.findIndex(d => d.name === Decorators.ForwardRef);
            if (forwardRefIndex > -1) {
                m.decorators[forwardRefIndex] = new Decorator(new Call(new Identifier(Decorators.Ref), undefined, []), {});
            }
        });

        return super.processMembers(members).map(p => {
            if (p.inherited) {
                p.scope = "props"
            }
            return p;
        });
    }

    createRestPropsGetter(members: BaseClassMember[]) {
        const props = getProps(members);
        const bindingElements = props.reduce((bindingElements, p) => {
            bindingElements.push(
                new BindingElement(
                    undefined,
                    undefined,
                    p._name,
                )
            )
            return bindingElements;
        }, [] as BindingElement[]).concat([
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

        return new GetAccessor(undefined, undefined, new Identifier('restAttributes'), [], new SimpleTypeExpression('RestProps'), new Block(statements, true));
    }
    
    createNestedPropGetter(): Method | null {
        const statements = [new VariableStatement(
            undefined,
            new VariableDeclarationList([
                new VariableDeclaration(
                    new Identifier("children"),
                    undefined,
                    new PropertyAccess(
                        new PropertyAccess(
                            new SimpleExpression(SyntaxKind.ThisKeyword),
                            new Identifier("props")
                        ),
                        new Identifier("children")
                    )
                ),
                new VariableDeclaration(
                    new Identifier('nestedComponents'),
                    undefined,
                    new SimpleExpression(`React.Children.toArray(children)
                        .filter(child => React.isValidElement(child) && typeof child.type !== "string" && child.type.name === typeName) as React.ReactElement[]`
                    )
                ),

            ], SyntaxKind.ConstKeyword)
        ), new ReturnStatement(new SimpleExpression("nestedComponents.map(comp => comp.props)"))];

        return new Method(
            undefined,
            undefined,
            undefined,
            new Identifier('__getNestedFromChild'),
            undefined,
            [],
            [
                new Parameter([], [], "", new Identifier("typeName"), undefined, 'string', undefined),
            ],
            new SimpleTypeExpression("{ [name:string]: any }[]"),
            new Block(statements, true)
        )
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

        if (this.members.some(m=>m.isRefProp || m.isForwardRefProp)) {
            hooks.push("RefObject");
        }
        
        if (this.members.filter(a => a.isApiMethod).length) {
            hooks.push("useImperativeHandle");
            compats.push("forwardRef");
        }

        if (this.apiRefs.length) {
            imports.splice(-1, 0, ...this.apiRefs.reduce((imports: string[], ref) => {
                const baseComponent = this.context.components![ref.type!.toString()] as ReactComponent;
                if (this.context.dirname) {
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

    compileConvertRulesToOptions(rules: string | Expression) {
        return this.state.length
            ? `__processTwoWayProps(convertRulesToOptions(${rules}))`
            : `convertRulesToOptions(${rules})`;
    }

    compileDefaultProps() {
        const defaultProps = this.heritageClauses
            .filter(h => h.defaultProps.length).map(h => `...${h.defaultProps}`)
            .concat(
                this.props.filter(p => !p.inherited && p.initializer)
                    .map(p => (p as Property).defaultProps())
            );

        if (this.defaultOptionRules && this.needGenerateDefaultOptions) {
            defaultProps.push(`...${this.compileConvertRulesToOptions(this.defaultOptionRules)}`);
        }

        if (this.needGenerateDefaultOptions) {
            return `
                ${ this.state.length
                    ? `function __processTwoWayProps(defaultProps: ${this.compilePropsType()}){
                        const twoWayProps:string[] = [${this.state.map(s => `"${s.name}"`)}];
                        
                        return Object.keys(defaultProps).reduce((props, propName)=>{
                            const propValue = (defaultProps as any)[propName];
                            const defaultPropName = twoWayProps.some(p=>p===propName) ? "default"+propName.charAt(0).toUpperCase() + propName.slice(1): propName;
                            (props as any)[defaultPropName] = propValue;
                            return props;
                        }, {});
                    }`
                    : ""}
                
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
        return subscriptionsString + this.effects
            .map(e => `useEffect(${e.arrowDeclaration(this.getToStringOptions())}, [${e.getDependency(this.members)}])`)
            .join(";\n");
    }

    compileComponentRef() {
        const api = this.members.filter(a => a.isApiMethod);
        if (api.length) {
            return `export type ${this.name}Ref = {${api.map(a => a.typeDeclaration())}}`
        }
        return "";
    }

    compileUseImperativeHandle() {
        const api = this.members.reduce((r: { methods: string[], deps: string[] }, a) => {
            if(a.isApiMethod) {
                r.methods.push(`${a.name}: ${(a as Method).arrowDeclaration(this.getToStringOptions())}`);

                r.deps = [...new Set(r.deps
                    .concat(a.getDependency(
                        this.members
                    )))];
            }

            return r;
        }, { methods: [], deps: [] });

        return api.methods.length ? `useImperativeHandle(ref, () => ({${api.methods.join(",\n")}}), [${api.deps.join(",")}])` : "";
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
                .concat(this.internalState.concat(this.refs, this.apiRefs).concat(this.slots.filter(s => !s.inherited)).map(p => p.typeDeclaration()))
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

        const template = this.props
            .filter(p => p.isTemplate)
            .map(t => `${t.name}: getTemplate(props, "${t.name}", "${getTemplatePropName(t.name, "render")}", "${getTemplatePropName(t.name, "component")}")`);

        const props = this.isJSXComponent ?
            [`props:{${["...props"].concat(state).concat(template).join(",\n")}}`].concat(internalState) :
            ["...props"].concat(internalState).concat(state);

        return props
            .concat(this.listeners.map(l => l.name.toString()))
            .concat(this.refs.map(r => r.name.toString()))
            .concat(this.apiRefs.map(r => r.name.toString()))
            .concat(
                this.methods.map(m => m._name.toString() !== m.getter() ? `${m._name}:${m.getter()}` : m.getter())
            );
    }

    compileRestProps(): string {
        return "declare type RestProps = { className?: string; style?: React.CSSProperties; [x: string]: any }";
    }

    compilePropsType() {
        const restPropsType = " & RestProps";

        if (this.isJSXComponent) {
            const type = this.heritageClauses[0].types[0];
            if (type.expression instanceof Call && type.expression.typeArguments?.length) { 
                return type.expression.typeArguments[0].toString().concat(restPropsType);
            }
           
            return this.compileDefaultOptionsPropsType().concat(restPropsType);
        }
        return `{
            ${this.props
                .concat(this.state)
                .concat(this.slots)
                .map(p => p.typeDeclaration()).join(",\n")}
        }${restPropsType}`;
    }

    compileDefaultOptionsPropsType() {
        const heritageClause = this.heritageClauses[0];
        return `typeof ${heritageClause.propsType}`;
    }

    getToStringOptions() {
        return {
            members: this.members,
            componentContext: "this",
            newComponentContext: ""
        };
    }

    toString() {
        const viewFunction = this.context.viewFunctions?.[this.view];
        const getTemplateFunc = this.props.some(p => p.isTemplate) ? `
        function getTemplate(props: any, template: string, render: string, component: string) {
            const getRender = (render: any) => (props: any) => (("data" in props) ? render(props.data, props.index) : render(props));
            const Component = props[component];
            
            return props[template] ||
                        (props[render] && getRender(props[render])) ||
                        (Component && ((props: any) => <Component {...props} />));
        }
        ` : "";

        return `
            ${this.compileImports()}
            ${this.compileComponentRef()}
            ${this.compileRestProps()}
            ${this.compileComponentInterface()}
            ${getTemplateFunc}
            ${this.members.filter(m => m.isApiMethod).length === 0
                ? `${this.modifiers.join(" ")} function ${this.name}(props: ${this.compilePropsType()}){`
                : `const ${this.name} = forwardRef<${this.name}Ref, ${this.compilePropsType()}>((props: ${this.compilePropsType()}, ref) => {`}
                ${this.compileUseRef()}
                ${this.stateDeclaration()}
                ${this.compileUseImperativeHandle()}
                ${this.listeners.concat(this.methods)
                .map(m => {
                    return `const ${m.name}=useCallback(${m.declaration(this.getToStringOptions())}, [${
                        m.getDependency(this.members)
                        }]);`;
                }).join("\n")}
                ${this.compileUseEffect()}
                return ${this.view}(
                    ${viewFunction?.parameters.length
                ? `${this.viewModel}({
                            ${this.compileViewModelArguments().join(",\n")}
                        })`
                : ""}
                );
            ${this.members.filter(m => m.isApiMethod).length === 0 ? `}` : `});\n${this.modifiers.join(" ")} ${
                this.modifiers.join(" ") === "export" ? `{${this.name}}` : this.name
            };`}
            
            ${this.compileDefaultComponentExport()}

            ${this.compileDefaultProps()}
            ${this.compileDefaultOptionsMethod("[]", [
                    `${this.defaultPropsDest()} = {
                    ...__createDefaultProps(),
                    ...${this.compileConvertRulesToOptions("__defaultOptionRules")}
                };`
                ])}`;
    }
}

export class JsxAttribute extends BaseJsxAttribute {
    getTemplateContext(): PropertyAssignment | null {
        const expression = (this.initializer as JsxExpression).getExpression()!;
        return new PropertyAssignment(this.name, expression);
    }

    toString(options?: toStringOptions) {
        let name = this.name.toString(options);
        if (options?.jsxComponent) {
            const member = getProps(options.jsxComponent.members)
                .find(m => m._name.toString() === this.name.toString());
            if (member) {
                name = member.name;
            }
        }
        return `${(eventsDictionary as any)[name] || name}=${this.initializer.toString(options)}`;
    }
}

export class JsxElement extends BaseJsxElement {
    toString(options?: toStringOptions) {
        const children: string = this.children.map(c => {
            let str = ""
            if(c instanceof JsxElement && c.openingElement.getTemplateProperty(options)) {
                str = `{${c.openingElement.toString(options)}}`;
            } else if (c instanceof JsxOpeningElement && c.getTemplateProperty(options)) {
                str = `{${c.toString(options)}}`;
            } else {
                str = c.toString(options);
            }
            return str;
        }).join("\n");

        return `${this.openingElement.toString(options)}${children}${this.closingElement.toString(options)}`;
    }
}

export class JsxOpeningElement extends BaseJsxOpeningElement { 
    processTagName(tagName: Expression) { 
        return tagName.toString() === "Fragment" ? new Identifier("React.Fragment") : tagName;
    }

    toString(options?: toStringOptions) {
        const templateProperty = this.getTemplateProperty(options) as Property;
        if (!templateProperty) { 
            return super.toString(options);
        }

        const contextElements = this.attributes.map(a => a.getTemplateContext()).filter(p => p) as (PropertyAssignment | SpreadAssignment)[];
        const templateParams = contextElements.length ? (new ObjectLiteral(contextElements, false)).toString(options).replace(/"/gi, "'") : 
            ((templateProperty.type instanceof FunctionTypeNode && templateProperty.type.parameters.length) ? "{}" : "");

        return `${this.tagName.toString(options)}(${templateParams})`
    }
}

export class JsxSelfClosingElement extends JsxOpeningElement{
    toString(options?:toStringOptions) {
        if (this.getTemplateProperty(options)) { 
            return super.toString(options);
        }
        return `<${this.processTagName(this.tagName).toString(options)} ${this.attributesString(options)}/>`;
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
        super(tagName, [], [], {});
    }

    toString(options?:toStringOptions) { 
        return `</${this.processTagName(this.tagName).toString(options)}>`;
    }
}

export class Generator extends BaseGenerator {
    createHeritageClause(token: string, types: ExpressionWithTypeArguments[]) {
        return new HeritageClause(token, types, this.getContext());
    }

    createComponent(componentDecorator: Decorator, modifiers: string[] | undefined, name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) {
        return new ReactComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members, this.getContext());
    }

    createComponentBindings(decorators: Decorator[], modifiers: string[] | undefined, name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) {
        return new ComponentInput(decorators, modifiers, name, typeParameters, heritageClauses, members)
    }

    createJsxAttribute(name: Identifier, initializer: Expression) {
        return new JsxAttribute(name, initializer);
    }

    createJsxOpeningElement(tagName: Identifier, typeArguments: any[], attributes?: Array<JsxAttribute | JsxSpreadAttribute>) {
        return new JsxOpeningElement(tagName, typeArguments, attributes, this.getContext());
    }

    createJsxSelfClosingElement(tagName: Identifier, typeArguments: any[], attributes?: Array<JsxAttribute | JsxSpreadAttribute>) {
        return new JsxSelfClosingElement(tagName, typeArguments, attributes, this.getContext());
    }

    createJsxClosingElement(tagName: Identifier) {
        return new JsxClosingElement(tagName);
    }

    createJsxElement(openingElement: JsxOpeningElement, children: Array<JsxElement | string | JsxExpression | JsxSelfClosingElement>, closingElement: JsxClosingElement) {
        return new JsxElement(openingElement, children, closingElement);
    }

    createProperty(decorators: Decorator[], modifiers: string[] | undefined, name: Identifier, questionOrExclamationToken?: string, type?: TypeExpression, initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }

    createGetAccessor(decorators: Decorator[] | undefined, modifiers: string[] | undefined, name: Identifier, parameters: Parameter[], type?: TypeExpression, body?: Block) {
        return new GetAccessor(decorators, modifiers, name, parameters, type, body);
    }

    createPropertyAccess(expression: Expression, name: Identifier) {
        return new PropertyAccess(expression, name);
    }

    createTypeReferenceNode(typeName: Identifier, typeArguments?: TypeExpression[]) {
        return new TypeReferenceNode(typeName, typeArguments, this.getContext());
    }

    createMethod(decorators: Decorator[] = [], modifiers: string[] = [], asteriskToken: string | undefined, name: Identifier, questionToken: string | undefined, typeParameters: TypeParameterDeclaration[] | undefined, parameters: Parameter[], type: TypeExpression | undefined, body: Block) {
        return new Method(decorators, modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body);
    }
}

export default new Generator();
