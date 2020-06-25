import BaseGenerator from "./base-generator";
import { Component, getProps } from "./base-generator/expressions/component";
import {
    Identifier,
    Call,
    AsExpression as BaseAsExpression,
    CallChain as BaseCallChain,
    NonNullExpression as BaseNonNullExpression
} from "./base-generator/expressions/common";
import { HeritageClause } from "./base-generator/expressions/class";
import {
    Property as BaseProperty,
    Method as BaseMethod,
    GetAccessor as BaseGetAccessor,
    BaseClassMember
} from "./base-generator/expressions/class-members";
import { GeneratorContext } from "./base-generator/types";
import {
    TypeExpression,
    SimpleTypeExpression,
    ArrayTypeNode,
    UnionTypeNode,
    FunctionTypeNode,
    LiteralTypeNode,
    TypeReferenceNode,
    IndexedAccessTypeNode,
    IntersectionTypeNode,
    ParenthesizedType,
    TypeAliasDeclaration,
    TypeOperatorNode,
    PropertySignature,
    MethodSignature,
} from "./base-generator/expressions/type";
import { capitalizeFirstLetter, variableDeclaration } from "./base-generator/utils/string";
import SyntaxKind from "./base-generator/syntaxKind";
import { Expression, SimpleExpression } from "./base-generator/expressions/base";
import { ObjectLiteral, StringLiteral, NumericLiteral } from "./base-generator/expressions/literal";
import { Parameter as BaseParameter, getTemplate, BaseFunction } from "./base-generator/expressions/functions";
import { Block, ReturnStatement } from "./base-generator/expressions/statements";
import {
    Function as AngularFunction,
    ArrowFunction as AngularArrowFunction,
    VariableDeclaration,
    JsxExpression as BaseJsxExpression,
    JsxElement as BaseJsxElement,
    JsxOpeningElement as BaseJsxOpeningElement,
    JsxChildExpression as BaseJsxChildExpression,
    JsxAttribute as BaseJsxAttribute,
    JsxSpreadAttribute as BaseJsxSpreadAttribute,
    AngularDirective,
    toStringOptions,
    isElement,
    getMember,
} from "./angular-generator";
import { Decorator } from "./base-generator/expressions/decorator";
import { BindingPattern } from "./base-generator/expressions/binding-pattern";
import { ComponentInput } from "./base-generator/expressions/component-input";
import { checkDependency } from "./base-generator/utils/dependency";
import { PropertyAccess as BasePropertyAccess } from "./base-generator/expressions/property-access";
import { PropertyAssignment, SpreadAssignment } from "./base-generator/expressions/property-assignment";
import { getModuleRelativePath } from "./base-generator/utils/path-utils";
import { Interface } from "./base-generator/expressions/interface";

function calculatePropertyType(type: TypeExpression | string): string {
    if (type instanceof SimpleTypeExpression) {
        const typeString = type.type.toString();
        if (typeString !== SyntaxKind.AnyKeyword && typeString !== SyntaxKind.UndefinedKeyword) {
            return capitalizeFirstLetter(typeString);
        }
    }
    if (type instanceof ArrayTypeNode) {
        return "Array";
    }
    if (type instanceof UnionTypeNode) {
        const types = ([] as string[])
            .concat(type.types.map(t => calculatePropertyType(t)));
        const typesWithoutDuplicates = [...new Set(types)];
        return typesWithoutDuplicates.length === 1 ? typesWithoutDuplicates[0] : `[${typesWithoutDuplicates.join(",")}]`;
    }
    if (type instanceof FunctionTypeNode) {
        return "Function";
    }
    if (type instanceof LiteralTypeNode) {
        if (type.expression instanceof ObjectLiteral) {
            return "Object";
        }
        if (type.expression instanceof StringLiteral) {
            return "String";
        }
        if (type.expression instanceof NumericLiteral) {
            return "Number";
        }
    }

    if (type instanceof TypeReferenceNode) {
        return type.typeName.toString();
    }
    return "";
}

export class Property extends BaseProperty { 
    get name() { 
        if (this.isTemplate) { 
            return this._name.toString();
        }
        return this._name.toString();
    } 

    toString(options?: toStringOptions) {
        if (this.isInternalState) { 
            return `${this.name}: ${this.initializer}`;
        } 

        if (this.isEvent || this.isRef && !this.inherited || this.isSlot || this.isTemplate) { 
            return "";
        }
    
        const type = this.isRefProp || this.isForwardRefProp ? "Function" : calculatePropertyType(this.type);
        const parts = [];
        if (type) { 
            parts.push(`type: ${type}`)
        }

        if (this.questionOrExclamationToken === SyntaxKind.ExclamationToken) { 
            parts.push("required: true")
        }
        const isState = this.isState;
        if (this.initializer && !isState) { 
            parts.push(`default(){
                return ${this.initializer}
            }`)
        }

        if (this.isState) { 
            parts.push("default: undefined");
        }

        return `${this.name}: {
            ${parts.join(",\n")}
        }`;
    }

    getter(componentContext?: string) { 
        const baseValue = super.getter(componentContext);
        componentContext = this.processComponentContext(componentContext);
        if (this.isState) {
            return `(${componentContext}${this.name} !== undefined ? ${componentContext}${this.name} : ${componentContext}${this.name}_state)`;
        }
        if ((this.isForwardRefProp || this.isRef || this.isForwardRef) && componentContext.length) {
            return `${componentContext}$refs.${this.name}`;
        }
        if(this.isRefProp)  {
            return `${componentContext}${this.name}()`;
        }
        if (this.isTemplate) { 
            return `${componentContext}$scopedSlots.${this.name}`;
        }
        if (this.isSlot) { 
            const name = this.name === "children" ? "default" : this.name;
            return `${componentContext}$slots.${name}`;
        }
        return baseValue
    }

    inherit() { 
        return new Property(this.decorators, this.modifiers, this._name, this.questionOrExclamationToken, this.type, this.initializer, true);
    }

    get canBeDestructured() { 
        if (this.isEvent || this.isState || this.isRefProp) {
            return false;
        }
        return super.canBeDestructured;
    }

    getDependency() {
        if (this.isState) { 
            return super.getDependency().concat([`${this.name}_state`]);
        }
        return super.getDependency();
    }
}

function compileMethod(expression: Method | GetAccessor, options?: toStringOptions): string { 
    return `${expression.name}(${expression.parameters})${expression.body.toString(options)}`
}

export class Parameter extends BaseParameter {
    toString() {
        return variableDeclaration(this.name, undefined, this.initializer, undefined);
    }
}

export class Method extends BaseMethod { 
    toString(options?: toStringOptions) { 
        return compileMethod(this, options)
    }
}

export class GetAccessor extends BaseGetAccessor { 
    toString(options?: toStringOptions): string { 
        return compileMethod(this, options)
    }

    getter(componentContext?: string) { 
        return `${this.processComponentContext(componentContext)}${super.getter()}()`;
    }
}

export class Function extends AngularFunction { 
    constructor(decorators: Decorator[] | undefined, modifiers: string[] | undefined, asteriskToken: string, name: Identifier, typeParameters: any, parameters: Parameter[], type: TypeExpression | undefined, body: Block, context: GeneratorContext) { 
        super(decorators, modifiers, asteriskToken, name, typeParameters, parameters, new SimpleTypeExpression(""), body, context)
    }
}

export class ArrowFunction extends AngularArrowFunction { 
    constructor(modifiers: string[]|undefined, typeParameters: any, parameters: Parameter[], type: TypeExpression | string |undefined, equalsGreaterThanToken: string, body: Block | Expression, context: GeneratorContext) {
        super(modifiers, typeParameters, parameters, new SimpleTypeExpression(""), equalsGreaterThanToken, body, context);
    }
}

export class VueComponentInput extends ComponentInput { 
    createProperty(decorators: Decorator[], modifiers: string[] | undefined, name: Identifier, questionOrExclamationToken?: string, type?: string | TypeExpression, initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }

    createDecorator(expression: Call, context: GeneratorContext) {
        return new Decorator(expression, context);
    }
    
    toString() { 
        const members = this.baseTypes.map(t => `...${t}`)
            .concat(
                this.members
                    .filter(m => !m.inherited)
                    .map(m => m instanceof Property ? m.inherit() : m)
                    .map(m => m.toString())
            )
            .filter(m => m);
        const modifiers = this.modifiers.indexOf(SyntaxKind.DefaultKeyword) === -1 ?
            this.modifiers :
            [];
        return `${modifiers.join(" ")} const ${this.name} = {
            ${members.join(",")}
        };
        ${modifiers !== this.modifiers ? `${this.modifiers.join(" ")} ${this.name}`: ""}`;
    }
}

function getComponentListFromContext(context: GeneratorContext) { 
    return Object.keys(context.components || {})
        .filter((k) => {
            const component = context.components?.[k];
            return component instanceof VueComponent;
        }).map(k => context.components![k]) as VueComponent[];
}

export class VueComponent extends Component { 
    template?: string;

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

    createPropsGetter(members: Array<Property | Method>) { 
        const defaultStatePropsName = members.filter(p => p.isState).map(m => `default${capitalizeFirstLetter(m.name)}`);
        const props = getProps(members).filter(m => !defaultStatePropsName.some(s => s === m.name));
        const expression = new ObjectLiteral(
            props.map(p => new PropertyAssignment(
                p._name,
                new PropertyAccess(
                    new PropertyAccess(
                        new Identifier(SyntaxKind.ThisKeyword),
                        new Identifier("props")
                    ),
                    p._name
                )
            )),
            true
        );

        return new GetAccessor(
            [],
            [],
            new Identifier("props"),
            [],
            undefined,
            new Block([
                new ReturnStatement(expression)
            ], true)
        );
    }

    addPrefixToMembers(members: Array<Property | Method>) { 
        members.filter(m => !m.isApiMethod).forEach(m => {
            m.prefix = "__";
        });
        return members;
    }

    processMembers(members: Array<Property | Method>) { 
        members = super.processMembers(members);
        members = members.reduce((members, m) => { 
            if (m.isState) { 
                const base = (m as Property);
                members.push(
                    new Property(
                        [new Decorator(
                            new Call(new Identifier("InternalState"), undefined, []),
                            {}
                        )],
                        [],
                        new Identifier(`${m._name}_state`),
                        "",
                        m.type,
                        new SimpleExpression(
                            `this.default${capitalizeFirstLetter(base.name)}`
                        )
                    )
                )
            }
            if (m.isForwardRef || m.isForwardRefProp) { 
                members.push(
                    new Method(
                        [],
                        [],
                        undefined,
                        new Identifier(`forwardRef_${m.name}`),
                        undefined,
                        [],
                        [new Parameter(
                            [],
                            [],
                            undefined,
                            new Identifier("ref")
                        )],
                        undefined,
                        new Block([
                            new SimpleExpression(`this.$refs.${m.name}=ref`)
                        ], true)
                    )
                );
            }
            return members;
        }, members);

        members.push(this.createPropsGetter(members));

        return members;
    }

    compileDefaultOptionsImport(imports: string[]): void { 
        if (!this.context.defaultOptionsImport && this.needGenerateDefaultOptions && this.context.defaultOptionsModule && this.context.dirname) {
            const relativePath = getModuleRelativePath(this.context.dirname, this.context.defaultOptionsModule);
            imports.push(`import {convertRulesToOptions} from "${relativePath}"`);
        }
    }

    compileTemplate() {
        const viewFunction = this.decorators[0].getViewFunction();
        if (viewFunction) {
            const options: toStringOptions = {
                members: this.members,
                newComponentContext: ""
            };
            this.template = viewFunction.getTemplate(options);

            if (options.hasStyle) { 
                this.methods.push(new Method(
                    [],
                    [],
                    undefined,
                    new Identifier("__processStyle"),
                    undefined,
                    [],
                    [
                        new Parameter(
                            [],
                            [],
                            undefined,
                            new Identifier("value"),
                            undefined,
                            undefined,
                            undefined
                        )
                    ],
                    undefined,
                    new Block([
                        new SimpleExpression(`
                            if (typeof value === "object") {
                                return Object.keys(value).reduce((v, k) => {
                                    if (typeof value[k] === "number") {
                                        v[k] = value[k] + "px";
                                    } else {
                                        v[k] = value[k];
                                    }
                                    return v;
                                }, {});
                            }
                            return value;`
                        )
                    ], true)
                ));
            }
        }
    }

    generateProps() {
        if (this.isJSXComponent) { 
            let props = this.heritageClauses[0].propsType.toString();
            if (this.needGenerateDefaultOptions) { 
                props = `(()=>{
                    const twoWayProps = [${this.state.map(s=>`"${s.name}"`)}];
                    return Object.keys(${props}).reduce((props, propName)=>{
                        const prop = {...${props}[propName]};
                        
                        const twoWayPropName = propName.indexOf("default") === 0 &&
                                twoWayProps.find(p=>"default"+p.charAt(0).toUpperCase() + p.slice(1)===propName);
                        const defaultPropName = twoWayPropName? twoWayPropName: propName;

                        if(typeof prop.default === "function"){
                            const defaultValue = prop.default;
                            prop.default = function() {
                                return this._defaultOptions[defaultPropName] !== undefined
                                    ? this._defaultOptions[defaultPropName] 
                                    : defaultValue();
                            }
                        } else if(!twoWayProps.some(p=>p===propName)){
                            const defaultValue = prop.default;
                            prop.default = function() {
                                return this._defaultOptions[defaultPropName] !== undefined
                                    ? this._defaultOptions[defaultPropName] 
                                    : defaultValue;
                            }
                        }

                        props[propName] = prop;
                        return props;
                    }, {});
                })()`;
            }
            return `props: ${props}`;
        }
        return "";
    }

    generateModel() {
        if(!this.modelProp) {
            return "";
        }
        return `model: {
            prop: "${this.modelProp._name}",
            event: "${getEventName(`${this.modelProp._name}Change`, [this.modelProp])}"
        }`;
    }

    generateData() { 
        const statements: string[] = [];
        if (this.internalState.length) { 
            statements.push.apply(statements, this.internalState.map(i=>i.toString()))
        }

        if (statements.length) { 
            return `data() {
                return {
                    ${statements.join(",\n")}
                };
            }`;
        }
        return "";
    }

    generateMethods(externalStatements: string[]) { 
        const statements: string[] = [];

        statements.push.apply(statements, this.methods
            .concat(this.effects)
            .concat(this.members.filter(m => m.isApiMethod) as Method[])
            .map(m => m.toString({
                members: this.members,
                componentContext: "this",
                newComponentContext: "this"
            })));

        this.members.filter(m => m.isEvent).forEach(m => {
            statements.push(`${m._name}(...args){
                this.$emit("${getEventName(m._name, this.members.filter(m => m.isState))}", ...args);
            }`);
        });

        const forwardRefs = this.members.filter(m=>m.isForwardRefProp);

        if(forwardRefs.length){
            statements.push(`__forwardRef(){
                ${forwardRefs.map(m => `this.${m._name}(this.$refs.${m._name});`).join("\n")}
            }`);
        }

        return `methods: {
            ${statements.concat(externalStatements).join(",\n")}
         }`;
    }

    generateWatch(methods: string[]) { 
        const watches: { [name: string]: string[] } = {};

        const startMethodsLength = methods.length;

        this.effects.forEach((effect, index) => { 
            const dependency = effect.getDependency(this.members);

            const scheduleEffectName = `__schedule_${effect._name}`;

            if (dependency.length) { 
                methods.push(`${scheduleEffectName}() {
                    this.__scheduleEffect(${index}, "${effect.name}");
                }`);
            }

            dependency.filter(d => d !== "props").forEach(d => { 
                watches[d] = watches[d] || [];
                watches[d].push(`"${scheduleEffectName}"`);
            });
        });

        if (methods.length !== startMethodsLength) {
            methods.push(`__scheduleEffect(index, name) {
                if(!this.__scheduleEffects[index]){
                    this.__scheduleEffects[index]=()=>{
                        this.__destroyEffects[index]&&this.__destroyEffects[index]();
                        this.__destroyEffects[index]=this[name]();
                        this.__scheduleEffects[index] = null;
                    }
                    this.$nextTick(()=>this.__scheduleEffects[index]&&this.__scheduleEffects[index]());
                }
            }`);
        }

        const watchStatements = Object.keys(watches).map(k => { 
            return `${k}: [
                ${watches[k].join(",\n")}
            ]`
        });

        if (watchStatements.length) { 
            return `
                watch: {
                    ${watchStatements.join(",\n")}
                }
            `;
        }

        return "";
    }

    generateComponents() { 
        const components = Object.keys(this.context.components || {})
        .filter((k) => {
            const component = this.context.components?.[k];
            return component instanceof VueComponent && component !== this
        });
        
        if (components.length) { 
            return `components: {
                ${components.join(",\n")}
            }`;
        }

        return "";
    }

    generateMounted() { 
        const statements: string[] = [];

        if(this.members.filter(m=>m.isForwardRefProp).length){
            statements.push(`this.__forwardRef()`);
        }

        this.effects.forEach((e, i) => { 
            statements.push(`this.__destroyEffects[${i}]=this.${e.name}()`);
        });

        if (statements.length) { 
            return `mounted(){
                ${statements.join(";\n")}
            }`;
        }

        return "";
    }

    generateCreated() { 
        const statements: string[] = [];

        if (this.effects.length) { 
            statements.push("this.__destroyEffects=[]");
            statements.push("this.__scheduleEffects=[]");
        }

        if (statements.length) { 
            return `created(){
                ${statements.join(";\n")}
            }`;
        }

        return "";
    }

    generateBeforeCreate() { 
        const statements: string[] = [];

        if (this.needGenerateDefaultOptions) { 
            statements.push("this._defaultOptions = convertRulesToOptions(__defaultOptionRules);");
        }

        if (statements.length) { 
            return `beforeCreate(){
                ${statements.join(";\n")}
            }`;
        }

        return "";
    }

    generateUpdated() { 
        const statements: string[] = [];

        if(this.members.filter(m=>m.isForwardRefProp).length){
            statements.push(`this.__forwardRef()`);
        }

        if (this.effects.length) { 
            statements.push(`
                this.__scheduleEffects.forEach((_,i)=>{
                    this.__scheduleEffects[i]&&this.__scheduleEffects[i]()
                });
            `);
        }

        if (statements.length) { 
            return `updated(){
                ${statements.join(";\n")}
            }`;
        }

        return "";
    }

    generateDestroyed() { 
        const statements: string[] = [];

        if (this.effects.length) { 
            statements.push(`
                this.__destroyEffects.forEach((_,i)=>{
                    this.__destroyEffects[i]&&this.__destroyEffects[i]()
                });
                this.__destroyEffects = null;
            `);
        }

        if (statements.length) { 
            return `destroyed(){
                ${statements.join("\n")}
            }`;
        }

        return "";
    }

    compileDefaultOptionsRuleTypeName() { 
        return "";
    }

    compileDefaultOptionRulesType() { 
        return "";
    }

    compileImports() { 
        const imports: string[] = [];
        this.compileDefaultOptionsImport(imports);

        return imports.join(";\n");
    }
    
    toString() { 
        this.compileTemplate();

        const methods: string[] = [];

        const statements = [
            this.generateComponents(),
            this.generateProps(),
            this.generateModel(),
            this.generateData(),
            this.generateWatch(methods),
            this.generateMethods(methods),
            this.generateBeforeCreate(),
            this.generateCreated(),
            this.generateMounted(),
            this.generateUpdated(),
            this.generateDestroyed()
        ].filter(s => s);

        return `
        ${this.compileImports()}
        ${this.compileDefaultOptionsMethod(this.defaultOptionRules ? this.defaultOptionRules.toString() : "[]", [])}
        ${this.compileDefaultProps()}
        ${this.modifiers.join(" ")} {
            ${statements.join(",\n")}
        }`;
    }
}

function getEventName(defaultName: Identifier | string, stateMembers?: Array<Property | Method>) {
    const state = stateMembers?.find(s => `${s._name}Change` === defaultName.toString());
    const eventName = state ? `update:${state._name}` : defaultName;

    let eventParts = eventName.toString().split(/(?=[A-Z])/).map(w => w.toLowerCase());
    if (eventParts[0] === "on") {
       eventParts = eventParts.slice(1);
    }

    return eventParts.join("-");
}

export class CallChain extends BaseCallChain { 
    toString(options?: toStringOptions): string { 
        let expression: Expression = this.expression;
       
        if (expression instanceof Identifier && options?.variables?.[expression.toString()]) { 
            expression = options.variables[expression.toString()];
        }
        const eventMember = checkDependency(expression, options?.members.filter(m => m.isEvent));
        if (eventMember) { 
            return `${expression.toString(options)}(${this.argumentsArray.map(a => a.toString(options)).join(",")})`;
        }
        return super.toString(options);
    }
}

export class NonNullExpression extends BaseNonNullExpression { 
    toString(options?: toStringOptions) { 
        return this.expression.toString(options);
    }
}

export class PropertyAccess extends BasePropertyAccess { 
    compileStateSetting(state: string, property: Property, options?: toStringOptions) {
        const isState = property.isState;
        const propertyName = isState ? `${property.name}_state` : property.name;
        const stateSetting = `this.${propertyName}=${state}`;
        if (isState) { 
            return `${stateSetting},\nthis.${property._name}Change(this.${propertyName})`;
        }
        return stateSetting;
    }
}

export class AsExpression extends BaseAsExpression { 
    toString(options?: toStringOptions) { 
        return `${this.expression.toString(options)}`;
    }
}

export class JsxAttribute extends BaseJsxAttribute { 
    getTemplateProp(options?: toStringOptions) {
        return `v-bind:${this.name}="${this.compileInitializer(options)}"`;
    }

    compileName(options?: toStringOptions) { 
        const name = this.name.toString();
        if (!(options?.jsxComponent)) {
            if (name === "className") { 
                return this.isStringLiteralValue() ? "class" : "v-bind:class";
            }
            if (name === "style") { 
                if (options) { 
                    options.hasStyle = true;
                }
                return "v-bind:style";
            }
        }

        return name;
    }

    compileKey() { 
        return null;
    }

    getRefValue(options?: toStringOptions) { 
        const name = this.initializer.toString(options);
        const refProp = options?.members.find(m => m._name.toString() === name);
        if (refProp?.isRef) { 
            return `()=>this.$refs.${name}`;
        }
        return `()=>${name}`;
    }

    getForwardRefValue(options?: toStringOptions) {
        const member = getMember(this.initializer, options)!;
        if (this.name.toString() === "ref") { 
            return member.name;
        }
        return `forwardRef_${member.name}`;
    }

    compileRef(options?: toStringOptions) { 
        return `ref="${this.compileInitializer(options)}"`;
    }

    compileValue(name: string, value: string) {
        if (name === "v-bind:style") {
            return `__processStyle(${value})`;
        }

        return value;
    }

    skipValue(options?: toStringOptions) { 
        return this.isTemplateAttribute(options);
    }

    compileEvent(options?: toStringOptions) {
        return `@${getEventName(this.name, options?.jsxComponent?.state)}="${this.compileInitializer(options)}"`;
    }

    compileBase(name: string, value: string) { 
        const prefix = name.startsWith("v-bind") ? "" : ":";
        return `${prefix}${name}="${value}"`;
    }
}

export class JsxSpreadAttribute extends BaseJsxSpreadAttribute { 
    getTemplateProp(options?: toStringOptions) { 
        return this.toString(options)
    }

    toString(options?: toStringOptions) { 
        const expression = this.getExpression(options);
        if (expression instanceof BasePropertyAccess) { 
            const member = expression.getMember(options);
            if (member instanceof GetAccessor && member._name.toString() === "restAttributes") { 
                return "";
            }
        }
        return `v-bind="${expression.toString(options).replace(/"/gi, "'")}"`;
    }
}

export class JsxOpeningElement extends BaseJsxOpeningElement { 
    attributes: Array<JsxAttribute | JsxSpreadAttribute>;
    constructor(tagName: Expression, typeArguments: any, attributes: Array<JsxAttribute | JsxSpreadAttribute> = [], context: GeneratorContext) { 
        super(tagName, typeArguments, attributes, context);
        this.attributes = attributes;
        if (this.component) { 
            const components = this.context.components!;
            const name = Object.keys(components).find(k => components[k] === this.component)!;
    
            this.tagName = new SimpleExpression(name);
        }
    }

    createJsxExpression(statement: Expression) { 
        return new JsxExpression(undefined, statement);
    }

    createJsxChildExpression(statement: JsxExpression) { 
        return new JsxChildExpression(statement);
    }

    processTagName(tagName: Expression) { 
        if (tagName.toString() === "Fragment") { 
            return new SimpleExpression('div style="display: contents"');
        }

        return tagName;
    }

    compileTemplate(templateProperty: Property, options?: toStringOptions) {
        const attributes = this.attributes.map(a => a.getTemplateProp(options));
        return `<slot name="${templateProperty.name}" ${attributes.join(" ")}></slot>`;
    }

    createJsxAttribute(name: Identifier, value: Expression) { 
        return new JsxAttribute(name, value)
    }

    getPropertyFromSpread(property: BaseProperty) { 
        return property.isEvent || property.isSlot;
    }

    updateSpreadAttribute(spreadAttribute: JsxSpreadAttribute, attributes: JsxAttribute[]) { 
        if (attributes.length) { 
            const propertyAssignments = attributes.map(p => { 
                return new PropertyAssignment(
                    p.name,
                    new SimpleExpression(SyntaxKind.UndefinedKeyword)
                )
            });

            return new JsxSpreadAttribute(
                undefined,
                new ObjectLiteral(
                    [
                        new SpreadAssignment(spreadAttribute.expression),
                        new SpreadAssignment(
                            new ObjectLiteral(propertyAssignments, false)
                        )
                    ],
                    false
                )
            );
        }

        return spreadAttribute;
    }

    processSpreadAttributesOnNativeElement() { 

    }

    getTemplateName(attribute: JsxAttribute) {
        return attribute.name.toString();
    }

    functionToJsxElement(name: string, func: BaseFunction, options?: toStringOptions):JsxElement {      
        const element = func.getTemplate(options, true);
        const paramName = func.parameters[0].name.toString(options);

        return new JsxElement(
            new JsxOpeningElement(new Identifier(`template v-slot:${name}="${paramName}"`), undefined, [], this.context),
            [element],
            new JsxClosingElement(new Identifier('template'), this.context),
        );
    }

    componentToJsxElement(name: string, component: Component): JsxElement {
        const paramName = 'slotProps';
        const attributes = getProps(component.members)
            .map(prop => new JsxAttribute(prop._name, new PropertyAccess(new Identifier(paramName), prop._name)));
        
        const componentName = Object.keys(this.context.components!).find(k => this.context.components![k] === component)!;
        const element = new JsxSelfClosingElement(new Identifier(componentName), undefined, attributes, component.context);

        return new JsxElement(
            new JsxOpeningElement(new Identifier(`template v-slot:${name}="${paramName}"`), undefined, [], this.context),
            [element],
            new JsxClosingElement(new Identifier('template'), this.context),
        );
    }

    clone() { 
        return new JsxOpeningElement(
            this.tagName,
            this.typeArguments,
            this.attributes.slice(),
            this.context
        );
    }
}

export class JsxClosingElement extends JsxOpeningElement { 
    constructor(tagName: Expression, context: GeneratorContext) { 
        super(tagName, [], [], context);
    }

    processTagName(tagName: Expression) { 
        if (tagName.toString() === "Fragment") { 
            return new SimpleExpression('div');
        }

        return tagName;
    }

    toString(options: toStringOptions) {
        return `</${this.processTagName(this.tagName).toString(options)}>`;
     }
}

export class JsxSelfClosingElement extends JsxOpeningElement { 
    toString(options?: toStringOptions) {
        if (this.getTemplateProperty(options)) { 
            return super.toString(options);
        }

        const baseValue = super.toString(options);

        const children = [
            ...this.getSlotsFromAttributes(options),
            ...this.getTemplatesFromAttributes(options),
        ];

        if (children.length) { 
            return `${baseValue}${
                children.map(c => c.toString(options)).join("")
            }</${this.processTagName(this.tagName)}>`
        }
        
        return baseValue.replace(/>$/, "/>");
    }

    clone() { 
        return new JsxSelfClosingElement(
            this.tagName,
            this.typeArguments,
            this.attributes.slice(),
            this.context
        );
    }
}

export class JsxElement extends BaseJsxElement { 
    createChildJsxExpression(expression: BaseJsxExpression) { 
        return new JsxChildExpression(expression);
    }

    compileOnlyChildren() { 
        return false;
    }

    clone() {
        return new JsxElement(
            this.openingElement.clone(),
            this.children.slice(),
            this.closingElement
        );
    }
}
export class JsxExpression extends BaseJsxExpression {
   
}

export class VueDirective extends AngularDirective {
    getTemplateProp(options?: toStringOptions) { 
        return this.toString(options)
    }
 }

export class TemplateWrapperElement extends JsxOpeningElement { 
    getTemplateProperty(options?: toStringOptions) { 
        return undefined;
    }

    constructor(attributes: Array<JsxAttribute | JsxSpreadAttribute>) { 
        super(
            new Identifier("template"),
            undefined,
            attributes,
            {}
        );
    }
}

export class ClosingTemplateWrapperElement extends JsxClosingElement { 
    constructor() { 
        super(
            new Identifier("template"),
            {}
        );
    }
}

export class JsxChildExpression extends BaseJsxChildExpression { 

    createJsxExpression(statement: Expression) { 
        return new JsxExpression(undefined, statement);
    }

    createContainer(attributes: JsxAttribute[], children: Array<JsxExpression | JsxElement | JsxSelfClosingElement>) {
        return new JsxElement(
            new TemplateWrapperElement(attributes),
            children,
            new ClosingTemplateWrapperElement()
        );
    }

    createIfAttribute(condition?: Expression) {
        return new VueDirective(
            new Identifier(condition ? "v-if" : "v-else"),
            condition || new SimpleExpression("")
        );
    }

    processSlotInConditional(statement: Expression, options?: toStringOptions) { 
        return undefined;
    }
    
    compileConditionStatement(condition: Expression, thenStatement: Expression, elseStatement: Expression, options?: toStringOptions) { 
        const result: string[] = [];
        result.push(this.compileStatement(thenStatement, condition, options));
        result.push(this.compileStatement(
            elseStatement,
            undefined,
            options)
        );

        return result.join("\n");
    }

    compileSlot(slot: Property) {
        if (slot.name.toString() === "default" || slot.name.toString() === "children") {
            return `<slot></slot>`;
        }
        return `<slot name="${slot.name}"></slot>`;
    }

    compileIterator(iterator: ArrowFunction | Function, expression: Call, options?: toStringOptions): string {
        const templateOptions = options ? { ...options } : { members: [] };
        const templateExpression = getTemplate(iterator, templateOptions, true);
        const itemsExpression = (expression.expression as PropertyAccess).expression;
        const vForValue = [iterator.parameters[0].name.toString()];

        if (iterator.parameters[1]) {
            vForValue.push(iterator.parameters[1].toString());
        }

        const vForAttribute = new VueDirective(
            new Identifier("v-for"),
            new SimpleExpression(`${
                vForValue.length > 1
                    ? `(${vForValue})` :
                    vForValue[0].toString()
                } of ${itemsExpression.toString(options)}`)
        );

        if (isElement(templateExpression)) {
            const element = templateExpression.clone();
            element.addAttribute(vForAttribute);

            const elementString = element.toString(templateOptions);
            if (options) {
                options.hasStyle = options.hasStyle || templateOptions.hasStyle;
            }
            return elementString;
        }

        if (templateExpression) {
            const expression:JsxChildExpression = new JsxChildExpression(templateExpression as JsxExpression);
            return this.createContainer(
                [vForAttribute as JsxAttribute],
                [expression]
            )
                .toString(templateOptions);
        }

        return "";
    }
}

const emptyToString = () => "";

const addEmptyToString  = <T>(e: T): T => { 
    (e as any).toString = emptyToString;
    return e as typeof e;
};
class VueGenerator extends BaseGenerator { 
    
    createComponentBindings(decorators: Decorator[], modifiers: string[] | undefined, name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) {
        return new VueComponentInput(decorators, modifiers, name, typeParameters, heritageClauses, members)
    }

    createComponent(componentDecorator: Decorator, modifiers: string[], name: Identifier, typeParameters: any, heritageClauses: HeritageClause[], members: Array<Property | Method>) {
        return new VueComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members, this.getContext());
    }

    createProperty(decorators: Decorator[], modifiers: string[] | undefined, name: Identifier, questionOrExclamationToken?: string, type?: TypeExpression, initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }

    createGetAccessor(decorators: Decorator[]|undefined, modifiers: string[]|undefined, name: Identifier, parameters: Parameter[], type?: TypeExpression, body?: Block) {
        return new GetAccessor(decorators, modifiers, name, parameters, type, body);
    }

    createMethod(decorators: Decorator[]| undefined, modifiers: string[]|undefined, asteriskToken: string|undefined, name: Identifier, questionToken: string | undefined, typeParameters: any, parameters: Parameter[], type: TypeExpression | undefined, body: Block) {
        return new Method(decorators, modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body);
    }

    createFunctionDeclarationCore(decorators: Decorator[] | undefined, modifiers: string[] | undefined, asteriskToken: string, name: Identifier, typeParameters: any, parameters: Parameter[], type: TypeExpression | undefined, body: Block) {
        return new Function(decorators, modifiers, asteriskToken, name, typeParameters, parameters, type, body, this.getContext());
    }

    createArrowFunction(modifiers: string[] | undefined, typeParameters: any, parameters: Parameter[], type: TypeExpression | string | undefined, equalsGreaterThanToken: string, body: Block | Expression) {
        return new ArrowFunction(modifiers, typeParameters, parameters, type, equalsGreaterThanToken, body, this.getContext());
    }

    createVariableDeclarationCore(name: Identifier | BindingPattern, type?: TypeExpression, initializer?: Expression) {
        return new VariableDeclaration(name, type, initializer);
    }

    createCallChain(expression: Expression, questionDotToken: string | undefined, typeArguments: any, argumentsArray: Expression[] | undefined) {
        return new CallChain(expression, questionDotToken, typeArguments, argumentsArray);
    }

    createParameter(decorators: Decorator[] = [], modifiers: string[] = [], dotDotDotToken: any, name: Identifier|BindingPattern, questionToken?: string, type?: TypeExpression, initializer?: Expression) {
        return new Parameter(decorators, modifiers, dotDotDotToken, name, questionToken, type, initializer);
    }

    processSourceFileName(name: string) {
        const ext = getComponentListFromContext(this.getContext()).length ? ".vue" : ".js";
        return name.replace(/\.tsx$/, ext);
    }

    processCodeFactoryResult(codeFactoryResult: Array<any>) { 
        const code = super.processCodeFactoryResult(codeFactoryResult);
        if (getComponentListFromContext(this.getContext()).length === 0) {
            return code;
        }
        const template = codeFactoryResult.find(r => r instanceof VueComponent)?.template;
        return `
            ${template ? `
            <template>
            ${template}
            </template>`
            : ""}
            ${"<script>"}
            ${code}
            ${"</script>"}
        `;
    }

    createPropertyAccess(expression: Expression, name: Identifier) {
        return new PropertyAccess(expression, name);
    }

    createJsxExpression(dotDotDotToken: string = "", expression?: Expression) {
        return new JsxExpression(dotDotDotToken, expression);
    }

    createJsxOpeningElement(tagName: Expression, typeArguments?: any, attributes?: Array<JsxAttribute | JsxSpreadAttribute>) {
        return new JsxOpeningElement(tagName, typeArguments, attributes, this.getContext());
    }

    createJsxSelfClosingElement(tagName: Expression, typeArguments?: any, attributes?: Array<JsxAttribute | JsxSpreadAttribute>) {
        return new JsxSelfClosingElement(tagName, typeArguments, attributes, this.getContext());
    }

    createJsxAttributes(properties: Array<JsxAttribute|JsxSpreadAttribute>) {
        return properties;
    }

    createJsxClosingElement(tagName: Expression) {
        return new JsxClosingElement(tagName, this.getContext());
    }

    createJsxElement(openingElement: JsxOpeningElement, children: Array<JsxElement | string | JsxExpression | JsxSelfClosingElement>, closingElement: JsxClosingElement) {
        return new JsxElement(openingElement, children, closingElement);
    }

    createJsxAttribute(name: Identifier, initializer: Expression) {
        return new JsxAttribute(name, initializer);
    }

    createAsExpression(expression: Expression, type: TypeExpression) { 
        return new AsExpression(expression, type);
    }

    createJsxSpreadAttribute(expression: Expression) {
        return new JsxSpreadAttribute(undefined, expression);
    }

    createNonNullExpression(expression: Expression) {
        return new NonNullExpression(expression);
    }

    createKeywordTypeNode(kind: string) {
        return addEmptyToString<SimpleTypeExpression>(super.createKeywordTypeNode(kind));
    }

    createArrayTypeNode(elementType: TypeExpression) {
        return addEmptyToString<ArrayTypeNode>(super.createArrayTypeNode(elementType));
    }

    createLiteralTypeNode(literal: Expression) { 
        return addEmptyToString<LiteralTypeNode>(super.createLiteralTypeNode(literal));
    }

    createIndexedAccessTypeNode(objectType: TypeExpression, indexType: TypeExpression) { 
        return  addEmptyToString<IndexedAccessTypeNode>(super.createIndexedAccessTypeNode(objectType, indexType));
    }

    createIntersectionTypeNode(types: TypeExpression[]) {
        return addEmptyToString<IntersectionTypeNode>(super.createIntersectionTypeNode(types));
    }

    createUnionTypeNode(types: TypeExpression[]) {
        return addEmptyToString<UnionTypeNode>(super.createUnionTypeNode(types));
    }

    createParenthesizedType(expression: TypeExpression) { 
        return addEmptyToString<ParenthesizedType>(super.createParenthesizedType(expression));
    }

    createFunctionTypeNode(typeParameters: any, parameters: Parameter[], type: TypeExpression) {
        return addEmptyToString<FunctionTypeNode>(super.createFunctionTypeNode(typeParameters, parameters, type)); 
    }

    createTypeAliasDeclaration(decorators: Decorator[]|undefined, modifiers: string[]|undefined, name: Identifier, typeParameters: any, type: TypeExpression) { 
        return addEmptyToString<TypeAliasDeclaration>(super.createTypeAliasDeclaration(decorators, modifiers, name, typeParameters, type)); 
    }

    createTypeOperatorNode(type: TypeExpression) { 
        return addEmptyToString<TypeOperatorNode>(super.createTypeOperatorNode(type)); 
    }

    createTypeReferenceNode(typeName: Identifier, typeArguments?: TypeExpression[]) {
        return addEmptyToString<TypeReferenceNode>(super.createTypeReferenceNode(typeName, typeArguments)); 
    }

    createInterfaceDeclaration(decorators: Decorator[]|undefined, modifiers: string[] | undefined, name: Identifier, typeParameters: any[] | undefined, heritageClauses: HeritageClause[] | undefined, members: Array<PropertySignature|MethodSignature>) { 
        return addEmptyToString<Interface>(super.createInterfaceDeclaration(decorators, modifiers, name, typeParameters, heritageClauses, members)); 
    }
}


export default new VueGenerator();
