import Generator from "./base-generator";
import {
    JsxExpression as BaseJsxExpression,
    JsxOpeningElement as BaseJsxOpeningElement,
    JsxAttribute as BaseJsxAttribute,
    JsxElement as BaseJsxElement,
    JsxClosingElement,
    getJsxExpression
} from "./base-generator/expressions/jsx";
import {  Call, AsExpression as BaseAsExpression } from "./base-generator/expressions/common";
import { Decorator as BaseDecorator } from "./base-generator/expressions/decorator";
import { VariableDeclaration as BaseVariableDeclaration } from "./base-generator/expressions/variables";
import {
    Property as BaseProperty, Method, GetAccessor as BaseGetAccessor
} from "./base-generator/expressions/class-members"
import {
    toStringOptions as BaseToStringOptions,
    GeneratorContext,
    isTypeArray,
    extractComplexType
} from "./base-generator/types";
import SyntaxKind from "./base-generator/syntaxKind";
import { Expression, SimpleExpression } from "./base-generator/expressions/base";
import { Identifier, Paren } from "./base-generator/expressions/common";
import { StringLiteral, ObjectLiteral, ArrayLiteral } from "./base-generator/expressions/literal";
import { PropertyAssignment } from "./base-generator/expressions/property-assignment";
import { Binary, Prefix } from "./base-generator/expressions/operators";
import { PropertyAccessChain } from "./base-generator/expressions/property-access";
import { Conditional } from "./base-generator/expressions/conditions";
import { Block, ReturnStatement } from "./base-generator/expressions/statements";
import {
    ArrowFunction as BaseArrowFunction,
    Function as BaseFunction,
    BaseFunction as BaseBaseFunction,
    Parameter,
    getTemplate,
    isFunction,
} from "./base-generator/expressions/functions";
import { TemplateExpression } from "./base-generator/expressions/template";
import { SimpleTypeExpression, TypeExpression, FunctionTypeNode, TypeLiteralNode, PropertySignature, isComplexType } from "./base-generator/expressions/type";
import { HeritageClause } from "./base-generator/expressions/class";
import { ImportClause } from "./base-generator/expressions/import";
import { ComponentInput as BaseComponentInput } from "./base-generator/expressions/component-input"
import { Component, getProps } from "./base-generator/expressions/component";
import { PropertyAccess as BasePropertyAccess } from "./base-generator/expressions/property-access";
import { BindingPattern, BindingElement } from "./base-generator/expressions/binding-pattern";
import { processComponentContext, capitalizeFirstLetter, removePlural } from "./base-generator/utils/string";
import { Decorators } from "./component_declaration/decorators";
import { warn } from "./utils/messages";

// https://html.spec.whatwg.org/multipage/syntax.html#void-elements
const VOID_ELEMENTS = 
    ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];

const ATTR_BINDING_ATTRIBUTES = ["aria-label"];

export const isElement = (e: any): e is JsxElement | JsxSelfClosingElement =>
    e instanceof JsxElement || e instanceof JsxSelfClosingElement || e instanceof BaseJsxOpeningElement;

export const counter = (function () {
    let i = 0;

    return {
        get() {
            return i++;
        },

        reset() {
            i = 0;
        }
    }
})();

const getAngularSelector = (name: string | Identifier, postfix: string = "") => {
    name = name.toString()
    const words = name.toString().split(/(?=[A-Z])/).map(w => w.toLowerCase());
    return [`dx${postfix}`].concat(words).join("-");
}

export interface toStringOptions extends  BaseToStringOptions {
    members: Array<Property | Method>;
    hasStyle?: boolean;
    keys?: Expression[];
    trackBy?: TrackByAttribute[];
}

function processTagName(tagName: Expression, context: GeneratorContext) { 
    const component = context.components?.[tagName.toString()];
        if (component) { 
            const selector = (component as AngularComponent).selector;
            return new Identifier(selector);
    }
    return tagName;
}

interface JsxSpreadAttributeMeta { 
    refExpression: Expression,
    expression: Expression
}

export class JsxOpeningElement extends BaseJsxOpeningElement { 
    attributes: Array<JsxAttribute | JsxSpreadAttribute>;
    constructor(tagName: Expression, typeArguments: any, attributes: Array<JsxAttribute | JsxSpreadAttribute> = [], context: GeneratorContext) { 
        super(tagName, typeArguments, attributes, context);
        this.attributes = attributes;
    }

    processTagName(tagName: Expression) { 
        if (this.component instanceof AngularComponent) {
            const selector = this.component.selector;
            return new Identifier(selector);
        }
        return super.processTagName(tagName);
    }

    getTemplateProperty(options?: toStringOptions) { 
        const tagName = this.tagName.toString(options);
        const contextExpr = processComponentContext(options?.newComponentContext);
        return options?.members
            .filter(m => m.isTemplate)
            .find(s => tagName.endsWith(`${contextExpr}${s.name.toString()}`));
    }

    getPropertyFromSpread(property: BaseProperty) { 
        return true;
    }

    spreadToArray(spreadAttribute: JsxSpreadAttribute, options?: toStringOptions) {
        const component = this.component;
        const properties = component && getProps(component.members).filter(this.getPropertyFromSpread) || [];

        const spreadAttributesExpression = getExpression(spreadAttribute.expression, options);
            

        if (spreadAttributesExpression instanceof BasePropertyAccess) { 
            const member = spreadAttributesExpression.getMember(options);
            if (member instanceof BaseGetAccessor && member._name.toString() === "restAttributes") { 
                return [];
            }
        }
        
        return properties.reduce((acc, prop: Method | BaseProperty) => {
            const propName = prop._name;
            const spreadValueExpression = new PropertyAccess(
                spreadAttributesExpression,
                propName
            );

            const isPropsScope = spreadValueExpression.isPropsScope(options);
            const members = spreadValueExpression.getMembers(options);
            const hasMember = members?.some(m => m._name.toString() === propName.toString())
            if (isPropsScope && !hasMember) {
                return acc;
            }
            
            const spreadValue = spreadValueExpression.toString(options);
            const attr = this.attributes.find(a => a instanceof JsxAttribute && a.name.toString() === propName.toString()) as JsxAttribute;
            const attrValue = attr?.initializer.toString();
            const value = attrValue
                ? `(${spreadValue}!==undefined?${spreadValue}:${attrValue})`
                : spreadValue;

            acc.push(this.createJsxAttribute(propName, new SimpleExpression(value)));
            return acc;
        }, [] as JsxAttribute[])
    }

    createJsxAttribute(name: Identifier, value: Expression) { 
        return new JsxAttribute(name, value)
    }

    processSpreadAttributesOnNativeElement() {
        const ref = this.attributes.find(a => a instanceof JsxAttribute && a.name.toString() === "ref");
        if (!ref && !this.component) {
            this.attributes.push(
                new JsxAttribute(new Identifier("ref"), new SimpleExpression(`_auto_ref_${counter.get()}`))
            );
        }
    }

    updateSpreadAttribute(spreadAttribute: JsxSpreadAttribute, attributes: JsxAttribute[]) { 
        return spreadAttribute;
    }

    processSpreadAttributes(options?: toStringOptions) { 
        const spreadAttributes = this.attributes.filter(a => a instanceof JsxSpreadAttribute) as JsxSpreadAttribute[];
        if (spreadAttributes.length) { 
            spreadAttributes.forEach(spreadAttr => {
                const attributes = this.spreadToArray(spreadAttr, options);

                const updatedSpreadAttribute = this.updateSpreadAttribute(spreadAttr, attributes);

                if (updatedSpreadAttribute !== spreadAttr) { 
                    const oldAttrIndex = this.attributes.findIndex(a => a === spreadAttr);
                    if (oldAttrIndex > -1) {
                        this.attributes.splice(oldAttrIndex, 1);
                     }
                    this.attributes.push(updatedSpreadAttribute);
                }

                attributes.forEach(attr => {
                    const oldAttrIndex = this.attributes.findIndex(
                        (a) => a instanceof JsxAttribute && a.name.toString() === attr.name.toString()
                    );
                    if (oldAttrIndex > -1) {
                        this.attributes.splice(oldAttrIndex, 1);
                     }
                    this.attributes.push(attr);
                });
            });

            this.processSpreadAttributesOnNativeElement();
        }
    }

    attributesString(options?: toStringOptions) {
        this.processSpreadAttributes(options);
        return super.attributesString(options);
    }

    compileTemplate(templateProperty: Property, options?: toStringOptions) {
        const contextExpr = processComponentContext(options?.newComponentContext);
        const contextElements = this.attributes.map(a => a.getTemplateContext(options)).filter(p => p) as PropertyAssignment[];
        const contextString = contextElements.length ? `; context:${(new ObjectLiteral(contextElements, false)).toString(options).replace(/"/gi, "'")}` : "";
        const attributes = this.attributes
            .filter(a => a instanceof AngularDirective)
            .map(a => a.toString(options))
            .join("\n");
            
        const elementString = `<ng-container *ngTemplateOutlet="${contextExpr}${templateProperty.name}${contextString}"></ng-container>`;
            
        if (attributes.length) {
            return `<ng-container ${attributes}>
                    ${elementString}
                </ng-container>`;
        }

        return elementString
    }

    toString(options?: toStringOptions) {
        const templateProperty = this.getTemplateProperty(options) as Property;
        if (templateProperty) { 
            return this.compileTemplate(templateProperty, options);
        }

        return super.toString(options);
    }

    clone() { 
        return new JsxOpeningElement(
            this.tagName,
            this.typeArguments,
            (this.attributes as JsxAttribute[]).slice(),
            this.context
        )
    }

    createJsxExpression(statement: Expression) { 
        return new JsxExpression(undefined, statement);
    }

    createJsxChildExpression(statement: JsxExpression) { 
        return new JsxChildExpression(statement);
    }

    getSlotsFromAttributes(options?: toStringOptions) { 
        if (this.component){
            const slots = this.attributes.filter(a => a instanceof JsxAttribute && a.isSlotAttribute({
                members: [],
                ...options,
                jsxComponent: this.component
            })) as JsxAttribute[];

            return slots.map(s => this.createJsxChildExpression(
                this.createJsxExpression(s.initializer)
            ));
        }
        return [];
    }

    getTemplateName(attribute: JsxAttribute) {
        return attribute.initializer.toString();
    }

    componentToJsxElement(name: string, component: Component) {
        const attributes = getProps(component.members).map(prop => new JsxAttribute(prop._name, prop._name));
        const element = new JsxSelfClosingElement(component._name, undefined, attributes, component.context);
        const templateAttr = getProps(component.members).map(prop => `let-${prop._name}="${prop._name}"`).join(" ");

        return new JsxElement(
            new JsxOpeningElement(new Identifier(`ng-template #${name.toString()} ${templateAttr}`), undefined, [], this.context),
            [element],
            new JsxClosingElement(new Identifier('ng-template')),
        );
    }

    functionToJsxElement(name: string, func: BaseFunction | BaseArrowFunction, options?: toStringOptions) {      
        const element = func.getTemplate(options);
        const paramType = func.parameters[0].type;
        const templateAttr = paramType instanceof TypeLiteralNode
            ? paramType.members.map((param: BaseProperty | PropertySignature) => {
                    const name = param.name.toString(options);
                    return `let-${name}="${name}"`
                }).join(' ')
            : '';

        return new JsxElement(
          new JsxOpeningElement(new Identifier(`ng-template #${name} ${templateAttr}`), undefined, [], this.context),
          [element],
          new JsxClosingElement(new Identifier('ng-template'))
        );
    }

    getTemplatesFromAttributes(options?: toStringOptions) {
        if (this.component){
            const templates = this.attributes.filter(a => a instanceof JsxAttribute && a.isTemplateAttribute({
                members: [],
                ...options,
                jsxComponent: this.component,
            })) as JsxAttribute[];

            const components = templates.reduce((acc, template) => {
                const name = template.initializer.toString();
                const result = this.context.components?.[name]
                if (result) {
                    acc.push({
                        name: this.getTemplateName(template),
                        component: result as Component,
                    });
                }
                return acc
            }, [] as ({name: string, component: Component})[]);

            const functions = templates.reduce((acc, template) => {
                const result = this.context.viewFunctions?.[template.initializer.toString()]
                if (result && isFunction(result)) {
                    acc.push({
                        name: this.getTemplateName(template),
                        func: result,
                    });
                }
                return acc
            }, [] as ({name: string,  func: BaseFunction | BaseArrowFunction})[]);

            const result = [
                ...components.map(({ name, component }) =>  this.componentToJsxElement(name, component)),
                ...functions.map(({name, func}) => this.functionToJsxElement(name, func, options)),
            ];

            return result;
        }

        return [];
    }

    getSpreadAttributes() { 
        if(this.component) {
            return [];
        }
        const result = this.attributes.filter(a => a instanceof JsxSpreadAttribute).map(a => {
            const ref = this.attributes.find(a => (a instanceof JsxAttribute) && a.name.toString() === "ref") as JsxAttribute|undefined;
            if(ref){
                return {
                    refExpression: ref.initializer,
                    expression: (a as JsxSpreadAttribute).expression
                } as JsxSpreadAttributeMeta;
            }
        });

        return result.filter(a=>a) as JsxSpreadAttributeMeta[];
    }

}

export class JsxSelfClosingElement extends JsxOpeningElement{ 
    toString(options?: toStringOptions) {
        if (VOID_ELEMENTS.indexOf(this.tagName.toString(options))!==-1) { 
            return `${super.toString(options).replace(">", "/>")}`;
        }

        if (this.getTemplateProperty(options)) { 
            return super.toString(options);
        }

        const openingElement = super.toString(options);
        const children: Expression[] = [
            ...this.getSlotsFromAttributes(options),
            ...this.getTemplatesFromAttributes(options),
        ];
        
        return `${openingElement}${
            children.map(c => c.toString(options)).join("")
        }</${this.processTagName(this.tagName)}>`
    }

    clone() { 
        return new JsxSelfClosingElement(
            this.tagName,
            this.typeArguments,
            (this.attributes as JsxAttribute[]).slice(),
            this.context
        )
    }
}

export class JsxAttribute extends BaseJsxAttribute { 
    getRefValue(options?: toStringOptions) { 
        return this.compileRef(options).replace("#", "");
    }

    getForwardRefValue(options?: toStringOptions): string {
        const member = getMember(this.initializer, options)!;
        return `forwardRef_${member.name.toString()}`;
    }

    compileInitializer(options?: toStringOptions) { 
        if (this.isRefAttribute(options)) { 
            return this.getRefValue(options);
        }
        
        if (options?.members.some(m => m.isForwardRef || m.isForwardRefProp && m._name.toString() === getMember(this.initializer, options)?._name.toString())) {
            return this.getForwardRefValue(options);
        }

        return this.initializer.toString({
            members: [],
            disableTemplates: true,
            ...options
        }).replace(/"/gi, "'");
    }

    compileRef(options?: toStringOptions) { 
        const refString = this.initializer.toString(options);
        const componentContext = options?.newComponentContext ? `${options.newComponentContext}.` : '';
        const match = refString.replace(/[\?!]/, "").match(new RegExp(`${componentContext}(\\w+).nativeElement`));
        if (match && match[1]) { 
            return `#${match[1]}`;
        }

        return `#${refString}`;
    }

    compileEvent(options?: toStringOptions) { 
        return `(${this.name})="${this.compileInitializer(options)}($event)"`;
    }

    compileName(options?: toStringOptions) { 
        const name = this.name.toString();
        if (!(options?.jsxComponent)) {
            if (name === "className") { 
                return "class";
            }
            if (name === "style") { 
                if (options) { 
                    options.hasStyle = true;
                }
                return "ngStyle";
            }

            if (ATTR_BINDING_ATTRIBUTES.indexOf(name)>-1) { 
                return `attr.${name}`;
            }
        }

        return name;
    }

    compileKey(options?: toStringOptions): string | null { 
        if (options) { 
            options.keys = options.keys || [];
            options.keys.push(this.initializer);
        }
        return "";
    }

    compileValue(name: string, value: string) {
        
        if (name === "title") {
            return `${value}!==undefined?${value}:''`;
        }

        if (name === "ngStyle") {
            return `__processNgStyle(${value})`;
        }

        return value;
    }

    compileBase(name: string, value: string) { 
        return `[${name}]="${value}"`;
    }

    isStringLiteralValue() { 
        return this.initializer instanceof StringLiteral ||
            this.initializer instanceof JsxExpression && this.initializer.expression instanceof StringLiteral;
    }

    isSlotAttribute(options?: toStringOptions) { 
        const slotProps = options?.jsxComponent?.members.filter(p => p.isSlot);
        return slotProps?.some(p => p.name === this.name.toString())
    }

    isRefAttribute(options?: toStringOptions) { 
        return options?.jsxComponent?.members
            .filter(p => p.isRefProp)?.some(p => p.name === this.name.toString());
    }

    isTemplateAttribute(options?: toStringOptions) {
        const templateProps = options?.jsxComponent?.members.filter(p => p.isTemplate);
        return templateProps?.some(p => p.name === this.name.toString()) || false;
    }

    skipValue(options?: toStringOptions) { 
        return false;
    }

    toString(options?: toStringOptions) { 
        if (this.skipValue(options)) { 
            return "";
        }

        if (this.name.toString() === "ref") { 
            return this.compileRef(options);
        }

        if (
            options?.jsxComponent?.members
                .filter(m => m.isEvent)
                .find(p => p.name === this.name.toString())
        ) {
            return this.compileEvent(options);
        }

        if (this.isSlotAttribute(options)) { 
            return "";
        }

        const name = this.compileName(options);

        if (name === "key" && this.compileKey() !== null) {
            return this.compileKey(options) as string;
        }

        if (this.isStringLiteralValue()) { 
            return `${name.replace("attr.", "")}=${this.initializer.toString()}`;
        }

        if (this.initializer instanceof JsxExpression) {
            const funcName = this.initializer.toString();
            const template = this.initializer.getExpression(options)!;
            if(isFunction(template)) {
                return this.compileBase(name, funcName);
            }
        }

        return this.compileBase(name, this.compileValue(name, this.compileInitializer(options)));
    }

    getTemplateContext(options?: toStringOptions): PropertyAssignment | null { 
        return new PropertyAssignment(this.name, new SimpleExpression(this.compileInitializer(options)));
    }
}

export class AngularDirective extends JsxAttribute { 
    getTemplateContext() { 
        return null;
    }
    toString(options?: toStringOptions) { 
        const initializer = this.compileInitializer(options);
        const value = initializer ? `="${initializer}"` : "";
        return `${this.name}${value}`;
    }
}

export class TrackByAttribute extends JsxAttribute {
    indexName: string;
    itemName: string;
    trackByExpressionString: string;
    constructor(name: Identifier, trackByExpressionString: string, indexName: string, itemName: string) { 
        super(name, new SimpleExpression(SyntaxKind.NullKeyword));
        this.indexName = indexName;
        this.itemName = itemName;
        this.trackByExpressionString = trackByExpressionString;
    }

    toString(options?: toStringOptions) { 
        return "";
    }

    getTrackByDeclaration(): string {
        return `${this.name}(${this.indexName||"_index"}: number, ${this.itemName}: any){
            return ${this.trackByExpressionString};
        }`;
    }
}

function getExpression(expression: Expression, options?: toStringOptions): Expression {
    if (expression instanceof Identifier && options?.variables?.[expression.toString()]) { 
        expression = options.variables[expression.toString()];
    }

    if (
        expression instanceof Paren || 
        expression instanceof BaseAsExpression
    ) {
        return getExpression(expression.expression, options)
    } else if (expression instanceof BaseJsxExpression && expression.expression) { 
        return getExpression(expression.expression, options);
    }

    return expression;
 }

export function getMember(expression: Expression, options?: toStringOptions): BaseProperty | Method | undefined {
    expression = getExpression(expression, options);
        
    if (expression instanceof BasePropertyAccess) {
        return expression.getMember(options);
    }
}

export class JsxExpression extends BaseJsxExpression {
    getIterator(expression: Expression): BaseBaseFunction| undefined {
        if (expression instanceof Call &&
            (expression.expression instanceof BasePropertyAccess ||
                expression.expression instanceof PropertyAccessChain) &&
            expression.expression.name.toString() === "map") {
            const iterator = expression.arguments[0];
            if (iterator instanceof BaseBaseFunction) {
                return iterator;
            }
        }
        return;
    }

    toString(options?: toStringOptions) {
        const expression = this.getExpression(options);
        return expression ? expression.toString(options) : "";
    }

}

export class JsxChildExpression extends JsxExpression {
    constructor(expression: JsxExpression) {
        super(expression.dotDotDotToken, expression.expression);
    }

    processBinary(expression: Binary, options?: toStringOptions, condition: Expression[]=[]): string | null { 
        const left = getExpression(expression.left, options);
        const right = getExpression(expression.right, options);
        
        if ((isElement(left) || isElement(right)) && expression.operator !== SyntaxKind.AmpersandAmpersandToken) { 
            throw `Operator ${expression.operator} is not supported: ${expression.toString()}`;
        }
        if (expression.operator === SyntaxKind.AmpersandAmpersandToken && !left.isJsx()) { 
            if (right instanceof Binary) {
                return this.processBinary(right, options, condition.concat(expression.left));
            }
            
            const conditionExpression = condition.reduce((c: Expression, e) => {
                return new Binary(
                    new Paren(c),
                    SyntaxKind.AmpersandAmpersandToken,
                    e
                );
            }, expression.left);
                
            return this.compileStatement(right, conditionExpression, options);
            
        }
        return null;
    }

    compileSlot(slot: Property) {
        const slotValue = slot.name.toString() === "children"
            ? "<ng-content></ng-content>"
            : `<ng-content select="[${slot.name}]"></ng-content>`;
        
        return `<div #slot${capitalizeFirstLetter(slot.name)} style="display: contents">${slotValue}</div>`;
    }

    createIfAttribute(condition: Expression): JsxAttribute { 
        return new AngularDirective(
            new Identifier("*ngIf"),
            condition
        );
    }

    createJsxExpression(statement: Expression) { 
        return new JsxExpression(undefined, statement);
    }

    createContainer(attributes: JsxAttribute[], children: Array<JsxExpression | JsxElement | JsxSelfClosingElement | string>) { 
        const containerIdentifer = new Identifier("ng-container")
        return new JsxElement(
            new JsxOpeningElement(
                containerIdentifer,
                undefined,
                attributes,
                {}
            ),
            children,
            new JsxClosingElement(containerIdentifer)
        );
    }

    processSlotInConditional(statement: Expression, options?: toStringOptions) { 
        const slot = this.getSlot(statement.toString(options), options);
        if (slot && slot.getter(options?.newComponentContext)===statement.toString(options)) { 
            return new JsxChildExpression(this.createJsxExpression(statement)).toString(options);
        }
    }

    compileStatement(statement: Expression, condition?: Expression, options?: toStringOptions): string {
        const slot = this.processSlotInConditional(statement, options);
        if (slot) { 
            return slot;
        }
       
        const conditionAttribute = this.createIfAttribute(condition!);

        const expression = getJsxExpression(statement);
        if (isElement(expression)) {
            const element = expression.clone();
            element.addAttribute(conditionAttribute);
            return element.toString(options);
        }
        return this.createContainer(
            [conditionAttribute],
            [this.createJsxExpression(statement)]
        ).toString(options);
    }

    compileConditionStatement(condition: Expression, thenStatement: Expression, elseStatement: Expression, options?: toStringOptions) { 
        const result: string[] = [];
        result.push(this.compileStatement(thenStatement, condition, options));
        result.push(this.compileStatement(
            elseStatement,
            new Prefix(SyntaxKind.ExclamationToken,
                new Paren(condition)
            ),
            options)
        );

        return result.join("\n");
    }

    getIteratorItemName(parameter: Identifier | BindingPattern, options: toStringOptions) {
        if (parameter instanceof BindingPattern) { 
            const identifier = new Identifier(`item_${counter.get()}`);
            
            options.variables = {
                ...options.variables,
                ...parameter.getVariableExpressions(identifier)
            }
            return identifier;
        }
        return parameter;
    }
    
    getSlot(stringValue: string, options?: toStringOptions) { 
        return options?.members
            .filter(m => m.isSlot)
            .find(s => stringValue.indexOf(s.getter(options.newComponentContext)) !== -1) as Property | undefined;
     }
     
    addCallParameters(parameters: Parameter[], args: Expression[], options?: toStringOptions) {
        const templateOptions = options ? { disableTemplates: true, ...options } : { members: [] };

        return parameters.reduce((acc: toStringOptions, param: Parameter, index) => {
            const initializer = args[index];
            const name = param.name;

            if (name instanceof BindingPattern) { 
                const identifier = new Identifier(initializer.toString(options));
                
                acc.variables = {
                    ...acc.variables,
                    ...name.getVariableExpressions(identifier)
                }
            } else {
                acc.variables = {
                    ...acc.variables,
                    ...{[name.toString()]: initializer}
                }
            }
            
            return acc;
        }, templateOptions)
    }

    compileIterator(iterator: BaseBaseFunction, expression: Call, options?: toStringOptions): string {
        const templateOptions: toStringOptions = options ? { ...options, ...{ keys: [] } } : { members: [] };
        const templateExpression = getTemplate(iterator, templateOptions, true);
        const itemsExpression = (expression.expression as PropertyAccess).expression;
        const itemName = this.getIteratorItemName(iterator.parameters[0].name, templateOptions).toString();
        const itemsExpressionString = itemsExpression.toString(options);
        
        let template = "";

        if (isElement(templateExpression)) {
            template = templateExpression.toString(templateOptions);
        } else { 
            const expression = new JsxChildExpression(templateExpression as JsxExpression);
            template = expression.toString(templateOptions);
        }

        const item = `let ${itemName} of ${itemsExpressionString}`;
        const ngForValue = [item];
        if (iterator.parameters[1]) {
            ngForValue.push(`index as ${iterator.parameters[1]}`);
        }

        const keyAttribute = templateOptions.keys?.[0];

        if (keyAttribute) {
            const trackByName = new Identifier(`_trackBy_${itemsExpressionString.replace(".", "_")}_${counter.get()}`);
            ngForValue.push(`trackBy: ${trackByName}`);
            if (options) {
                options.trackBy = (options.trackBy || []).concat(templateOptions.trackBy || []);
                options.trackBy.push(
                    new TrackByAttribute(
                        trackByName,
                        keyAttribute.toString(templateOptions),
                        iterator.parameters[1]?.name.toString() || "",
                        itemName
                    )
                );
            }
        }

        if (options) {
            options.hasStyle = options.hasStyle || templateOptions.hasStyle;
        }
                
        return `<ng-container *ngFor="${ngForValue.join(";")}">${
            template
        }</ng-container>`;
    }

    toString(options?: toStringOptions) {
        const expression = this.getExpression(options);

        if (!expression) {
           return "";
        }
        
        if (expression instanceof Binary) { 
            const parsedBinary = this.processBinary(expression, options);
            if (parsedBinary) {
                return parsedBinary;
            }
        }

        const iterator = this.getIterator(expression);
       
        if (iterator) {
            return this.compileIterator(iterator, expression as Call, options);
        }

        if (expression instanceof Call) {
            const funcName = expression.expression.toString();
            const template = options?.variables?.[funcName];
            if (template instanceof BaseArrowFunction || template instanceof BaseFunction) {
                const templateOptions = this.addCallParameters(template.parameters, expression.arguments, options);
                const templateExpression = template.getTemplate(templateOptions, true);

                return templateExpression;
            }
        }

        if (expression instanceof Conditional) {
            return this.compileConditionStatement(
                expression.expression,
                expression.thenStatement,
                expression.elseStatement,
                options);
        }

        if (expression instanceof StringLiteral) { 
            return expression.expression;
        }
        const stringValue = super.toString(options);

        if (expression.isJsx() || stringValue.startsWith("<") || stringValue.startsWith("(<")) { 
            return stringValue;
        }

        const slot = this.getSlot(stringValue, options);
        if (slot) { 
            return this.compileSlot(slot as Property);
        }

        return `{{${stringValue}}}`;
    }
}

export class JsxSpreadAttribute extends JsxExpression{
    expression: Expression;
    constructor(dotDotDotToken: string="", expression: Expression) {
        super(dotDotDotToken, expression)
        this.expression = expression;
    }

    getExpression(options?:toStringOptions) {
        return super.getExpression(options) || this.expression;
    }

    getTemplateContext() {
        // TODO: Support spread attributes in template context
        console.warn("Angular generator doesn't support spread attributes in template");
        return null;
    }

    toString(options?:toStringOptions) { 
        return "";
    }
}

export class JsxElement extends BaseJsxElement {

    createChildJsxExpression(expression: JsxExpression) { 
        return new JsxChildExpression(expression);
    }

    openingElement: JsxOpeningElement
    children: Array<JsxElement | string | JsxChildExpression | JsxSelfClosingElement>;
    constructor(openingElement: JsxOpeningElement, children: Array<JsxElement | string | JsxExpression | JsxSelfClosingElement>, closingElement: JsxClosingElement) {
        super(openingElement, children, closingElement);
        this.openingElement = openingElement;
        this.children = children.map(c => c instanceof JsxExpression
                ? this.createChildJsxExpression(c)
                : typeof c === "string" ? c.trim() : c
        );
        this.closingElement = closingElement;
    }

    compileOnlyChildren() { 
        return this.openingElement.tagName.toString() === "Fragment";
    }

    toString(options?: toStringOptions) {
        const openingElementString = this.openingElement.toString(options);
        const children = this.children.concat([
            ...this.openingElement.getSlotsFromAttributes(options),
            ...this.openingElement.getTemplatesFromAttributes(options),
        ]);
        
        const childrenString: string = children.map(c => c.toString(options)).join("");

        if (this.compileOnlyChildren()) {
            return childrenString;
        }
        const closingElementString = !this.openingElement.getTemplateProperty(options)
            ? this.closingElement.toString(options)
            : "";
        
        return `${openingElementString}${childrenString}${closingElementString}`;
    }

    clone() {
        return new JsxElement(
            this.openingElement.clone(),
            this.children.slice(),
            this.closingElement
        );
    }

    getSpreadAttributes() {
        const result = this.openingElement.getSpreadAttributes();
        const allAttributes: JsxSpreadAttributeMeta[] = this.children.reduce((result: JsxSpreadAttributeMeta[], c) => {
            if (isElement(c)) {
                return result.concat(c.getSpreadAttributes());
            }
            return result;
        }, result)
        return allAttributes;
    }

}

export class AngularBaseFunction extends BaseFunction { 
    processTemplateExpression(expression?: JsxExpression) { 
        if (expression && !isElement(expression)) { 
            return new JsxChildExpression(expression);
        }
        return super.processTemplateExpression(expression);
    }
}

export class Function extends AngularBaseFunction { 
    toString(options?:toStringOptions) { 
        if (this.isJsx()) { 
            return "";
        }
        return super.toString(options);
    }
}

export class ArrowFunction extends BaseArrowFunction { 
    processTemplateExpression(expression?: JsxExpression) { 
        if (expression && !isElement(expression)) { 
            return new JsxChildExpression(expression);
        }
        return super.processTemplateExpression(expression);
    }
    toString(options?:toStringOptions) { 
        if (this.isJsx()) { 
            return "";
        }
        return super.toString(options);
    }
}

class Decorator extends BaseDecorator { 
    toString(options?: toStringOptions) { 
        if (this.name === Decorators.OneWay || 
            this.name === Decorators.TwoWay || 
            this.name === Decorators.Template || 
            this.name===Decorators.RefProp ||
            this.name === Decorators.Nested ||
            this.name ===Decorators.ForwardRefProp
            ) {
            return "@Input()";
        } else if (
            this.name === Decorators.Effect ||
            this.name === Decorators.Ref ||
            this.name === Decorators.ApiRef ||
            this.name === Decorators.InternalState ||
            this.name === Decorators.Method ||
            this.name === Decorators.ForwardRef
        ) {
            return "";
        } else if (this.name === Decorators.Component) {
            const parameters = (this.expression.arguments[0] as ObjectLiteral);
            const viewFunction = this.getViewFunction();
            if (viewFunction) {
                const template = viewFunction.getTemplate(options);
                if (template) {
                    parameters.setProperty("template", new TemplateExpression(template, []));
                }
            }

            parameters.removeProperty("view");
            parameters.removeProperty("viewModel");
            parameters.removeProperty("defaultOptionRules");
            parameters.removeProperty("jQuery");
        } else if (this.name === Decorators.Event) { 
            return "@Output()";
        }
        return super.toString();
    }
}

function compileCoreImports(members: Array<Property|Method>, context: AngularGeneratorContext, imports:string[] = []) { 
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

class ComponentInput extends BaseComponentInput { 
    context: AngularGeneratorContext;
    constructor(decorators: Decorator[], modifiers: string[]=[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>, context: AngularGeneratorContext) { 
        super(decorators, modifiers, name, typeParameters, heritageClauses, members);
        this.context = context;
    }

    createProperty(decorators: Decorator[], modifiers: string[] | undefined, name: Identifier, questionOrExclamationToken?: string, type?: TypeExpression | string, initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }

    createDecorator(expression: Call, context: AngularGeneratorContext) {
        return new Decorator(expression, context);
    }

    buildDefaultStateProperty() { 
        return null;
    }

    createNestedComponent(property: Property) {
        const { modifiers, questionOrExclamationToken, initializer, type, _name } = property;
        const name = _name.toString();
        
        const decorator = this.createDecorator(new Call(new Identifier(Decorators.NestedComp), undefined, []), {});
        const nestedType = extractComplexType(type);
        if (nestedType === "any") {
            warn(`One of "${name}" Nested property's types should be complex type`)
        }
        return this.createProperty([decorator], modifiers, new Identifier(`${name.toString()}Nested`), questionOrExclamationToken, `Dx${nestedType}`, initializer);
    }

    compileNestedComponents() {
        const nestedProps = this.members.filter(m => m.isNested);
        const nestedComponents = this.members.filter(m => m.isNestedComp);

        const components = this.context.components;
        const types = this.context.types;

        const parentName = components && Object.keys(components).find(key => components[key] instanceof AngularComponent)
        const parentSelector = components && parentName && (components[parentName] as AngularComponent).selector;
        
        if (parentSelector && types) {
            const result = nestedComponents.map(component => {
                const relatedProp = nestedProps.find(prop => component.name.replace("Nested", "") === prop.name);
                const nestedTypeName = component.type.toString();
                const typeName = nestedTypeName.replace("Dx", "");
                const type = types[typeName];

                if (relatedProp && type instanceof TypeLiteralNode) {
                    const fields = [...type.members].map(m => {
                        const prop = this.createProperty(
                            [this.createDecorator(new Call(new SimpleExpression("OneWay"), undefined, undefined), {})],
                            undefined,
                            m.name,
                            m.questionToken,
                            m.type,
                            undefined,
                        )
                        const result = prop.toString();
                        if (m.questionToken !== "?") {
                            return result.replace(":", "!:");
                        }
                        return result;
                    }).join(';\n');
                    const isArray = isTypeArray(relatedProp.type);
                    const postfix = isArray ? "i" : "o";
                    let selectorName = isArray ? removePlural(relatedProp.name) : relatedProp.name;
                    const selector = getAngularSelector(selectorName, postfix);
        
                    return `@Directive({
                        selector: "${parentSelector} ${selector}"
                    })
                    class ${nestedTypeName} implements ${typeName} {
                        ${fields}
                    }`;
                }
            }).join('\n')
            return result;
        }
        return "";
    }

    toString() {
        return `
        ${compileCoreImports(this.members.filter(m => !m.inherited), this.context)}
        ${this.compileNestedComponents()}
        ${this.modifiers.join(" ")} class ${this.name} ${this.heritageClauses.map(h => h.toString()).join(" ")} {
            ${this.members.filter(p => p instanceof Property && !p.inherited).map(m => m.toString()).filter(m => m).concat("").join(";\n")}
        }`;
    }
}

function parseEventType(type: TypeExpression|string) { 
    if(type instanceof FunctionTypeNode){
        const typeList = type.parameters.map(p => {
            const type = p.type?.toString() || "any";
            if (p.questionToken === SyntaxKind.QuestionToken && type !== "any") {
                return `${type}|${SyntaxKind.UndefinedKeyword}`;
            }
            return type;
        });
        return typeList.length ? `<${typeList}>` : "";
    }
    return "<any>";
}

export class Property extends BaseProperty { 
    get name() { 
        return this._name.toString();
    } 
    constructor(decorators: Decorator[] = [], modifiers: string[] = [], name: Identifier, questionOrExclamationToken: string = "", type?: TypeExpression | string, initializer?: Expression, inherited: boolean = false) {
        if (decorators.find(d => d.name === Decorators.Template)) {
            type = new SimpleTypeExpression(`TemplateRef<any>`);
            if (questionOrExclamationToken !== SyntaxKind.QuestionToken) { 
                questionOrExclamationToken = SyntaxKind.ExclamationToken;
            }
        }
        super(decorators, modifiers, name, questionOrExclamationToken, type, initializer, inherited);
    }
    typeDeclaration() { 
        return `${this.name}${this.questionOrExclamationToken}:${this.type}`;
    }
    toString() { 
        const eventDecorator = this.decorators.find(d => d.name === Decorators.Event);
        const defaultValue = super.toString();
        if (eventDecorator) { 
            return `${eventDecorator} ${this.name}:EventEmitter${parseEventType(this.type)} = new EventEmitter()`
        }
        if (this.isRef) {
            return `@ViewChild("${this.name}", {static: false}) ${this.name}${this.questionOrExclamationToken}:ElementRef<${this.type}>`;
        }
        if (this._hasDecorator(Decorators.ApiRef)) {
            return `@ViewChild("${this.name}", {static: false}) ${this.name}${this.questionOrExclamationToken}:${this.type}`;
        }
        if (this.isSlot) { 
            const selector = `slot${capitalizeFirstLetter(this.name)}`
            return `@ViewChild("${selector}") ${selector}?: ElementRef<HTMLDivElement>;

            get ${this.name}(){
                return this.${selector}?.nativeElement?.innerHTML.trim();
            }`;
        }
        if (this.isNestedComp) { 
            return `@ContentChildren(${this.type}) ${this.name}!: QueryList<${this.type}>`;
        }

        if (this.isForwardRefProp) { 
            return `${this.modifiers.join(" ")} ${this.decorators.map(d => d.toString()).join(" ")} ${this.name}:(ref:any)=>void=()=>{}`;
        }

        if (this.isForwardRef) { 
            return `${this.modifiers.join(" ")} ${this.decorators.map(d => d.toString()).join(" ")} ${this.name}${this.questionOrExclamationToken}:ElementRef<${this.type}>`;
        }
        
        return defaultValue;
    }

    getter(componentContext?: string) { 
        const suffix = this.required ? "!" : "";
        componentContext = this.processComponentContext(componentContext);
        if (this.isEvent) { 
            return `${componentContext}${this.name}.emit`;
        }
        if (this.isRef || this.isForwardRef || this.isForwardRefProp) { 
            const postfix = this.isForwardRefProp ? "Ref" : "";
            return `${componentContext}${this.name}${postfix}${
                this.questionOrExclamationToken === SyntaxKind.ExclamationToken ? "" : this.questionOrExclamationToken
            }.nativeElement`
        }
        if (this.isRefProp) { 
            return `${componentContext}${this.name}`;
        }
        if (this.isNested) {
            const indexGetter = isTypeArray(this.type) ?  "" : "?.[0]" ;
            return `(${componentContext}${this.name} || ${componentContext}${this.name}Nested.toArray()${indexGetter})`;
        }
        if (this._hasDecorator(Decorators.ApiRef)) { 
            return `${componentContext}${this.name}${suffix}`;
        }
        return `${componentContext}${this.name}${suffix}`;
    }

    getDependency() { 
        return [this.name];
    }

    inherit() { 
        return new Property(this.decorators as Decorator[], this.modifiers, this._name, this.questionOrExclamationToken, this.type, this.initializer, true);
    }

    get canBeDestructured() { 
        if (this.isEvent || this.isNested) { 
            return false;
        }
        return super.canBeDestructured;
    }
}

export class GetAccessor extends BaseGetAccessor{
    constructor(decorators: Decorator[]|undefined, modifiers: string[]|undefined, name: Identifier, parameters: Parameter[], type?: TypeExpression, body?: Block) { 
        if (type && body && isComplexType(type) ) { 
            const cacheAccess = `this.__getterCache["${name.toString()}"]`;
            body.statements = [
                new SimpleExpression(`
                    if(${cacheAccess}!==undefined){
                        return ${cacheAccess};
                    }`
                ),
                new ReturnStatement(
                    new Binary(
                        new SimpleExpression(cacheAccess),
                        SyntaxKind.EqualsToken,
                        new Call(
                            new Paren(
                                new ArrowFunction(
                                    [],
                                    undefined,
                                    [],
                                    type,
                                    SyntaxKind.EqualsGreaterThanToken,
                                    new Block(
                                        body.statements,
                                        false
                                    ),
                                    {}
                                )
                            ), undefined
                        )
                    )
                )
            ]
        }
        super(decorators, modifiers, name, parameters, type, body);
    }

    isMemorized(): boolean{
        return isComplexType(this.type);
    }
}

class SetAccessor extends Method { 
    constructor(decorators: Decorator[] | undefined, modifiers: string[] | undefined, name: Identifier, parameters: Parameter[], body: Block) {
        super(decorators, modifiers, "", name, "", [], parameters, new SimpleTypeExpression(""), body);
    }
    toString(options?: toStringOptions) { 
        return `set ${super.toString(options)}`;
    }
}

const ngOnChangesParameters = ["changes"];

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

export class PropertyAccess extends BasePropertyAccess {
    processProps(result: string, options: toStringOptions, elements: BindingElement[] = []) {
        const props = getProps(options.members).filter(p => elements.length === 0 || elements.some(e => (e.propertyName || e.name).toString() === p._name.toString()));
        if (props.some(p => !p.canBeDestructured) || props.length === 0) {
            const expression = new ObjectLiteral(
                props.map(p => new PropertyAssignment(
                    p._name,
                    new PropertyAccess(
                        new PropertyAccess(
                            new Identifier(this.calculateComponentContext(options)),
                            new Identifier("props")
                        ),
                        p._name
                    )
                )),
                true
            );
            return expression.toString(options);
        }
        return options.newComponentContext!;
    }

    compileStateSetting(value: string, property: Property, toStringOptions?: toStringOptions) {
        if (property.isState) {
            return `this.${this.name}Change.emit(${this.toString(toStringOptions)}=${value})`;
        }
        return `this._${property.name}=${value}`;
    }
}

export class VariableDeclaration extends BaseVariableDeclaration { 
    toString(options?:toStringOptions) { 
        if (this.isJsx()) { 
            return "";
        }
        return super.toString(options);
    }
}

export class AsExpression extends BaseAsExpression { 
    toString(options?: toStringOptions) {
        if (options?.disableTemplates) { 
            return this.expression.toString(options);
        }
        return super.toString(options);
    }
}

type AngularGeneratorContext = GeneratorContext & {
    angularCoreImports?: string[];
}

export class AngularGenerator extends Generator {
    createJsxExpression(dotDotDotToken: string = "", expression?: Expression) {
        return new JsxExpression(dotDotDotToken, expression);
    }

    createJsxAttribute(name: Identifier, initializer: Expression) {
        return new JsxAttribute(name, initializer);
    }

    createJsxSpreadAttribute(expression: Expression) {
        return new JsxSpreadAttribute(undefined, expression);
    }

    createJsxAttributes(properties: JsxAttribute[]) {
        return properties;
    }

    createJsxOpeningElement(tagName: Expression, typeArguments?: any, attributes?: Array<JsxAttribute | JsxSpreadAttribute>) {
        return new JsxOpeningElement(tagName, typeArguments, attributes, this.getContext());
    }

    createJsxSelfClosingElement(tagName: Expression, typeArguments?: any, attributes?: Array<JsxAttribute | JsxSpreadAttribute>) {
        return new JsxSelfClosingElement(tagName, typeArguments, attributes, this.getContext());
    }

    createJsxClosingElement(tagName: Expression) {
        return new JsxClosingElement(processTagName(tagName as Expression, this.getContext()));
    }

    createJsxElement(openingElement: JsxOpeningElement, children: Array<JsxElement | string | JsxExpression | JsxSelfClosingElement>, closingElement: JsxClosingElement) {
        return new JsxElement(openingElement, children, closingElement);
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

    createDecorator(expression: Call) {
        return new Decorator(expression, this.getContext());
    }

    createComponentBindings(decorators: Decorator[], modifiers: string[] | undefined, name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) {
        return new ComponentInput(decorators, modifiers, name, typeParameters, heritageClauses, members, this.getContext());
    }

    createProperty(decorators: Decorator[], modifiers: string[] | undefined, name: Identifier, questionOrExclamationToken?: string, type?: TypeExpression, initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }

    createMethod(decorators: Decorator[], modifiers: string[] | undefined, asteriskToken: string | undefined, name: Identifier, questionToken: string | undefined, typeParameters: any, parameters: Parameter[], type: TypeExpression | undefined, body: Block) {
        return new Method(decorators, modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body);
    }

    createGetAccessor(decorators: Decorator[]|undefined, modifiers: string[]|undefined, name: Identifier, parameters: Parameter[], type?: TypeExpression, body?: Block) {
        return new GetAccessor(decorators, modifiers, name, parameters, type, body);
    }

    createComponent(componentDecorator: Decorator, modifiers: string[], name: Identifier, typeParameters: any, heritageClauses: HeritageClause[], members: Array<Property | Method>) {
        return new AngularComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members, this.getContext());
    }

    createPropertyAccess(expression: Expression, name: Identifier) {
        return new PropertyAccess(expression, name);
    }

    createAsExpression(expression: Expression, type: TypeExpression) { 
        return new AsExpression(expression, type);
    }

    context: AngularGeneratorContext[] = [];

    getContext() {
        return super.getContext() as AngularGeneratorContext;
    }

    setContext(context: GeneratorContext | null) {
        !context && counter.reset();
        return super.setContext(context);
    }

    addComponent(name: string, component: BaseComponentInput| BaseComponentInput, importClause?: ImportClause) { 
        if (component instanceof AngularComponent) { 
            importClause?.add(component.module);
        }
        super.addComponent(name, component, importClause);
    }
}

export default new AngularGenerator();
