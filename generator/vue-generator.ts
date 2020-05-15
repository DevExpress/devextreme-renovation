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
    ParenthesizedType
} from "./base-generator/expressions/type";
import { capitalizeFirstLetter, variableDeclaration } from "./base-generator/utils/string";
import SyntaxKind from "./base-generator/syntaxKind";
import { Expression, SimpleExpression } from "./base-generator/expressions/base";
import { ObjectLiteral, StringLiteral, NumericLiteral } from "./base-generator/expressions/literal";
import { Parameter as BaseParameter } from "./base-generator/expressions/functions";
import { Block } from "./base-generator/expressions/statements";
import {
    Function,
    ArrowFunction,
    VariableDeclaration,
    JsxExpression as BaseJsxExpression,
    JsxElement as BaseJsxElement,
    JsxOpeningElement as BaseJsxOpeningElement,
    JsxSelfClosingElement as BaseJsxSelfClosingElement,
    JsxChildExpression as BaseJsxChildExpression,
    JsxAttribute as BaseJsxAttribute,
    JsxSpreadAttribute as BaseJsxSpeadAttribute,
    AngularDirective,
    createProcessBinary,
    toStringOptions
    
} from "./angular-generator";
import { Decorator } from "./base-generator/expressions/decorator";
import { BindingPattern } from "./base-generator/expressions/binding-pattern";
import { ComponentInput } from "./base-generator/expressions/component-input";
import { checkDependency } from "./base-generator/utils/dependency";
import { PropertyAccess as BasePropertyAccess } from "./base-generator/expressions/property-access"
import { Binary } from "./base-generator/expressions/operators";
import { PropertyAssignment } from "./base-generator/expressions/property-assignment";

function calculatePropertyType(type: TypeExpression): string { 
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
        const typesWithoutDuplcates = [...new Set(types)];
        return typesWithoutDuplcates.length === 1 ? typesWithoutDuplcates[0] : `[${typesWithoutDuplcates.join(",")}]`;
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

        if (this.isEvent || this.isRef || this.isSlot || this.isTemplate) { 
            return "";
        }
    
        const type = calculatePropertyType(this.type);
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
        if (this.isRef && componentContext.length) { 
            return `${componentContext}$refs.${this.name}`;
        }
        if (this.isTemplate) { 
            return `${componentContext}$scopedSlots.${this.name}`;
        }
        return baseValue
    }

    inherit() { 
        return new Property(this.decorators, this.modifiers, this._name, this.questionOrExclamationToken, this.type, this.initializer, true);
    }

    get canBeDestructured() { 
        if (this.isEvent || this.isState) {
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

export class VueComponentInput extends ComponentInput { 
    buildDefaultStateProperty(stateMember: Property): Property|null { 
        return new Property(
            [new Decorator(new Call(new Identifier("OneWay"), undefined, []), {})],
            [],
            new Identifier(`default${capitalizeFirstLetter(stateMember._name)}`),
            undefined,
            stateMember.type,
            stateMember.initializer
        )
    }
    
    buildChangeState(stateMember: Property, stateName: Identifier) { 
        return  new Property(
            [new Decorator(new Call(new Identifier("Event"), undefined, []), {})],
            [],
            stateName,
            undefined,
            this.buildChangeStateType(stateMember)
        );
    }
    
    toString() { 
        const members = this.baseTypes.map(t => `...${t}`)
            .concat(
                this.members
                    .filter(m => !m.inherited)
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

    processMembers(members: Array<Property | Method>, heritageClauses: HeritageClause[]) { 
        members = super.processMembers(members, heritageClauses);
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
            return members;
        }, members);
        return members;
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
            return `props: ${this.heritageClauses[0].propsType.type}`;
        }
        return "";
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

        return `methods: {
            ${statements.concat(externalStatements).join(",\n")}
         }`;
    }

    generateWatch(methods: string[]) { 
        const watches: { [name: string]: string[] } = {};

        this.effects.forEach((effect, index) => { 
            const props: Array<BaseProperty | BaseMethod> = getProps(this.members);
            const dependency = effect.getDependency(
                props.concat((this.members.filter(m=>m.isInternalState)))
            );

            const scheduleEffectName = `__schedule_${effect.name}`;

            if (dependency.length) { 
                methods.push(` ${scheduleEffectName}() {
                        this.__scheduleEffects[${index}]=()=>{
                            this.__destroyEffects[${index}]&&this.__destroyEffects[${index}]();
                            this.__destroyEffects[${index}]=this.${effect.name}();
                        }
                    }`);
            }

            const watchDependency = (dependency: string[]) => { 
                dependency.forEach(d => { 
                    watches[d] = watches[d] || [];
                    watches[d].push(`"${scheduleEffectName}"`);
                });
            }

            if (dependency.indexOf("props") !== -1) { 
                watchDependency(props.map(p => p.name));
            }

            watchDependency(dependency.filter(d => d !== "props"));
        });

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
        const statements: string[] = this.effects.map((e, i) => { 
            return `this.__destroyEffects[${i}]=this.${e.name}()`;
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

    generateUpdated() { 
        const statements: string[] = [];

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

    generateBeforeDestroyed() { 
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
            return `beforeDestoyed(){
                ${statements.join("\n")}
            }`;
        }

        return "";
    }
    
    toString() { 
        this.compileTemplate();

        const methods: string[] = [];

        const statements = [
            this.generateComponents(),
            this.generateProps(),
            this.generateData(),
            this.generateWatch(methods),
            this.generateMethods(methods),
            this.generateCreated(),
            this.generateMounted(),
            this.generateUpdated(),
            this.generateBeforeDestroyed()
        ].filter(s => s);

        return `${this.modifiers.join(" ")} {
            ${statements.join(",\n")}
        }`;
    }
}

function getEventName(defaultName: Identifier, stateMembers?: Array<Property | Method>) {
    const state = stateMembers?.find(s => `${s._name}Change` === defaultName.toString());
    const eventName = state ? `update:${state._name}` : defaultName;
    const words = eventName.toString().split(/(?=[A-Z])/).map(w => w.toLowerCase());
    return `${words.join("-")}`;
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

    processProps(result: string, options: toStringOptions) {
        const props = getProps(options.members);
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
        return expression.toString(options);
    }

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
        if (!(options?.eventProperties)) {
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

    compileRef(options?: toStringOptions) { 
        return `ref="${this.compileInitializer(options)}"`;
    }

    compileValue(name: string, value: string) {
        if (name === "v-bind:style") {
            return `__processStyle(${value})`;
        }

        return value;
    }

    compileEvent(options?: toStringOptions) {
        return `@${getEventName(this.name, options?.stateProperties)}="${this.compileInitializer(options)}"`;
    }

    compileBase(name: string, value: string) { 
        const prefix = name.startsWith("v-bind") ? "" : ":";
        return `${prefix}${name}="${value}"`;
    }
}

export class JsxSpreadAttribute extends BaseJsxSpeadAttribute { 
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
            const name = (Object.keys(components).find(k => components[k] === this.component) || "");
    
            this.tagName = new SimpleExpression(name);
        }
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

    processSpreadAttributes() { 

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
        return `</${this.tagName.toString(options)}>`;
     }
}

export class JsxSelfClosingElement extends JsxOpeningElement { 
    toString(options?: toStringOptions) {
        if (this.getTemplateProperty(options)) { 
            return super.toString(options);
        }
        
        return super.toString(options).replace(/>$/, "/>");
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

const processBinary = createProcessBinary((conditionExpression: Expression) => {
    return new VueDirective(new Identifier("v-if"), conditionExpression);
});

export class TemplateWrapperElement extends JsxOpeningElement { 
    getTemplateProperty(options?: toStringOptions) { 
        return undefined;
    }

    constructor(attributes: Array<JsxAttribute | JsxSpreadAttribute> = []) { 
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

    createContainer(atributes: JsxAttribute[], children: Array<JsxExpression | JsxElement | JsxSelfClosingElement>) { 
        const containerIdentifer = new Identifier("template")
        return new JsxElement(
            new TemplateWrapperElement(atributes),
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

    processBinary(expression: Binary, options?: toStringOptions, condition?: Expression[]) { 
        return processBinary(expression, options, condition)
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

    createArrowFunction(modifiers: string[] | undefined, typeParameters: any, parameters: Parameter[], type: TypeExpression | undefined, equalsGreaterThanToken: string, body: Block | Expression) {
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

    createJsxExpression(dotDotDotToken: string = "", expression: Expression) {
        return new JsxExpression(dotDotDotToken, expression);
    }

    createJsxOpeningElement(tagName: Expression, typeArguments?: any, attributes?: Array<JsxAttribute | JsxSpreadAttribute>) {
        return new JsxOpeningElement(tagName, typeArguments, attributes, this.getContext());
    }

    createJsxSelfClosingElement(tagName: Expression, typeArguments?: any, attributes?: Array<JsxAttribute | JsxSpreadAttribute>) {
        return new JsxSelfClosingElement(tagName, typeArguments, attributes, this.getContext());
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

}


export default new VueGenerator();
