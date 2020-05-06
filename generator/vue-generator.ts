import BaseGenerator from "./base-generator";
import { Component } from "./base-generator/expressions/component";
import {
    Identifier,
    Call as BaseCall,
    AsExpression as BaseAsExpression
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
    TypeReferenceNode
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

function calculatePropertyType(type: TypeExpression): string { 
    if (type instanceof SimpleTypeExpression) {
        return capitalizeFirstLetter(type.toString());
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

        if (this.initializer && !this.isState) { 
            parts.push(`default(){
                return ${this.initializer}
            }`)
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
    buildDefaultStateProperty() { 
        return null;
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
            .concat(this.members.map(m => m.toString()))
            .filter(m => m);
        const modifiers = this.modifiers.indexOf(SyntaxKind.DefaultKeyword) === -1 ? this.modifiers : [];
        return `${modifiers.join(" ")} const ${this.name} = {
            ${members.join(",")}
        };
        ${modifiers !== this.modifiers ? `${this.modifiers.join(" ")} ${this.name}`: ""}`;
    }
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
                        base.initializer && new SimpleExpression(
                            `this.${base.name}!==undefined?this.${base.name}:${base.initializer}`
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

    generateMethods() { 
        const statements: string[] = [];

        statements.push.apply(statements, this.methods.map(m => m.toString({
            members: this.members,
            componentContext: "this",
            newComponentContext: "this"
        })));

        return `methods: {
                ${statements.join(",\n")}
         }`;
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
    
    toString() { 
        this.compileTemplate();

        const statements = [
            this.generateComponents(),
            this.generateProps(),
            this.generateData(),
            this.generateMethods()
        ].filter(s => s);
        return `${this.modifiers.join(" ")} {
            ${statements.join(",\n")}
        }`;
    }
}

function getEventName(name: Identifier, suffix="") { 
    const words = name.toString().split(/(?=[A-Z])/).map(w => w.toLowerCase());
    if (suffix) { 
        words.push(suffix);
    }
    return `"${words.join("-")}"`;
}

export class Call extends BaseCall { 
    toString(options?: toStringOptions) { 
        let expression: Expression = this.expression;
        if (this.expression instanceof Identifier && options?.variables?.[expression.toString()]) { 
            expression = options.variables[expression.toString()];
        }
        const eventMember = checkDependency(expression, options?.members.filter(m => m.isEvent));
        if (eventMember) { 
            return `this.$emit(${getEventName(eventMember._name)}, ${this.argumentsArray.map(a => a.toString(options)).join(",")})`;
        }
        return super.toString(options);
    }
}

export class PropertyAccess extends BasePropertyAccess { 
    compileStateSetting(state: string, property: Property, options?: toStringOptions) {
        const isState = property.isState;
        const propertyName = isState ? `${property.name}_state` : property.name;
        const stateSetting = `this.${propertyName}=${state}`;
        if (isState) { 
            return `${stateSetting},\nthis.emit(${getEventName(property._name, "change")}, this.${propertyName})`;
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
        return `:v-bind:${this.name}="${this.compileInitializer(options)}"`;
    }

    compileName(options?: toStringOptions) { 
        const name = this.name.toString();
        if (!(options?.eventProperties)) {
            if (name === "class") { 
                return "v-bind:class";
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
        return `@${this.name}="${this.compileInitializer(options)}"`;
    }

    compileBase(name: string, value: string) { 
        const prefix = name.startsWith("v-bind") ? "" : ":";
        return `${prefix}${name}="${value}"`;
    }
}

export class JsxSpreadAttribute extends BaseJsxSpeadAttribute { 
    getTemplateProp(options?: toStringOptions) { 
        return `:v-bind="${this.expression.toString(options)}"`;
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

    compileTemplate(templateProperty: Property, options?: toStringOptions) {
        const attributes = this.attributes.map(a => a.getTemplateProp(options));
        return `<slot name="${templateProperty.name}" ${attributes.join(" ")}></slot>`;
    }
}

export class JsxClosingElement extends JsxOpeningElement { 
    constructor(tagName: Expression, context: GeneratorContext) { 
        super(tagName, [], [], context);
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
}

export class JsxElement extends BaseJsxElement { 
    createChildJsxExpression(expression: BaseJsxExpression) { 
        return new JsxChildExpression(expression);
    }

}
export class JsxExpression extends BaseJsxExpression {
   
}

export class VueDirective extends AngularDirective { }

const processBinary = createProcessBinary((conditionExpression: Expression) => { 
    return new VueDirective(new Identifier("v-if"), conditionExpression);
})

export class JsxChildExpression extends BaseJsxChildExpression { 

    createJsxExpression(statement: Expression) { 
        return new JsxExpression(undefined, statement);
    }

    createContainer(atributes: JsxAttribute[], children: Array<JsxExpression | JsxElement | JsxSelfClosingElement>) { 
        const containerIdentifer = new Identifier("template")
        return new JsxElement(
            new JsxOpeningElement(
                containerIdentifer,
                undefined,
                atributes,
                {}
            ),
            children,
            new JsxClosingElement(containerIdentifer, {})
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

    createCall(expression: Expression, typeArguments: any, argumentsArray?: Expression[]) {
        return new Call(expression, typeArguments, argumentsArray);
    }

    createParameter(decorators: Decorator[] = [], modifiers: string[] = [], dotDotDotToken: any, name: Identifier|BindingPattern, questionToken?: string, type?: TypeExpression, initializer?: Expression) {
        return new Parameter(decorators, modifiers, dotDotDotToken, name, questionToken, type, initializer);
    }

    processCodeFactoryResult(codeFactoryResult: Array<any>) { 
        const code = codeFactoryResult.join("\n");
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
}


export default new VueGenerator();
