import Generator from "./base-generator";
import {
    JsxExpression as BaseJsxExpression,
    JsxOpeningElement as BaseJsxOpeningElement,
    JsxAttribute as BaseJsxAttribute,
    JsxElement as BaseJsxElement,
    JsxClosingElement,
    getJsxExpression
} from "./base-generator/expressions/jsx";
import {  Call } from "./base-generator/expressions/common";
import { Decorator as BaseDecorator } from "./base-generator/expressions/decorator";
import { VariableDeclaration as BaseVariableDeclaration } from "./base-generator/expressions/variables";
import {
    Property as BaseProperty, Method, GetAccessor
} from "./base-generator/expressions/class-members"
import {
    toStringOptions as BaseToStringOptions,
    GeneratorContext
} from "./base-generator/types";
import SyntaxKind from "./base-generator/syntaxKind";
import { Expression, SimpleExpression } from "./base-generator/expressions/base";
import { Identifier, Paren } from "./base-generator/expressions/common";
import { StringLiteral, ObjectLiteral, ArrayLiteral } from "./base-generator/expressions/literal";
import { PropertyAssignment } from "./base-generator/expressions/property-assignment";
import { Binary, Prefix } from "./base-generator/expressions/operators";
import { PropertyAccessChain } from "./base-generator/expressions/property-access";
import { Conditional } from "./base-generator/expressions/conditions";
import { Block } from "./base-generator/expressions/statements";
import {
    ArrowFunction as BaseArrowFunction,
    Function as BaseFunction,
    BaseFunction as BaseBaseFunction,
    Parameter,
    getTemplate 
} from "./base-generator/expressions/functions";
import { TemplateExpression } from "./base-generator/expressions/template";
import { SimpleTypeExpression, TypeExpression, FunctionTypeNode } from "./base-generator/expressions/type";
import { HeritageClause } from "./base-generator/expressions/class";
import { ImportClause } from "./base-generator/expressions/import";
import { ComponentInput as BaseComponentInput } from "./base-generator/expressions/component-input"
import { Component, getProps } from "./base-generator/expressions/component";
import { PropertyAccess as BasePropertyAccess } from "./base-generator/expressions/property-access";
import { BindingPattern } from "./base-generator/expressions/binding-pattern";
import { processComponentContext, capitalizeFirstLetter } from "./base-generator/utils/string";

// https://html.spec.whatwg.org/multipage/syntax.html#void-elements
const VOID_ELEMENTS = 
    ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];

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

export interface toStringOptions extends  BaseToStringOptions {
    members: Array<Property | Method>;
    hasStyle?: boolean
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
            .filter(m => m.decorators.find(d => d.name === "Template"))
            .find(s => tagName.endsWith(`${contextExpr}${s.name.toString()}`));
    }

    getPropertyFromSpread(property: BaseProperty) { 
        return true;
    }

    spreadToArray(spreadAttribute: JsxSpreadAttribute, options?: toStringOptions) {
        const component = this.component;
        const properties = component && getProps(component.members).filter(this.getPropertyFromSpread) || [];

        const spreadAttributesExpression = spreadAttribute.expression instanceof Identifier &&
            options?.variables?.[spreadAttribute.expression.toString()] ||
            spreadAttribute.expression;

        if (spreadAttributesExpression instanceof BasePropertyAccess) { 
            const member = spreadAttributesExpression.getMember(options);
            if (member instanceof GetAccessor && member._name.toString() === "restAttributes") { 
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
        const contextElements = this.attributes.map(a => a.getTemplateContext()).filter(p => p) as PropertyAssignment[];
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

    getSpreadAttributes() { 
        if(this.component) {
            return [];
        }
        const result = this.attributes.filter(a => a instanceof JsxSpreadAttribute).map(a => {
            const ref = this.attributes.find(a => (a instanceof JsxAttribute) && a.name.toString() === "ref")! as JsxAttribute;
            return {
                refExpression: ref.initializer,
                expression: (a as JsxSpreadAttribute).expression
            } as JsxSpreadAttributeMeta;
        });

        return result;
    }

    trackBy() { 
        return this.attributes.filter(a => a instanceof TrackByAttribute) as TrackByAttribute[];
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
        const children: Expression[] = this.getSlotsFromAttributes(options);
        
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
    compileInitializer(options?: toStringOptions) { 
        return this.initializer.toString({
            members: [],
            disableTemplates: true,
            ...options
        }).replace(/"/gi, "'");
    }

    getTemplateContext(): PropertyAssignment | null { 
        return new PropertyAssignment(this.name, this.initializer);
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
        }

        return name;
    }

    compileKey(): string|null { 
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

    toString(options?:toStringOptions) { 
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
            return this.compileKey() as string;
        }

        if (this.isStringLiteralValue()) { 
            return `${name}=${this.initializer.toString()}`;
        }

        return this.compileBase(name, this.compileValue(name, this.compileInitializer(options)));
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

    if (expression instanceof Paren) { 
        return expression.expression;
    }

    return expression;
 }

export class JsxExpression extends BaseJsxExpression {
    getExpression(options?: toStringOptions): Expression {
        let variableExpression;
        if (this.expression instanceof Identifier && options?.variables?.[this.expression.toString()]) { 
            variableExpression = options.variables[this.expression.toString()];
        }

        if (variableExpression instanceof Paren) {
            return variableExpression.expression;
        }

        return variableExpression || this.expression;
    }

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
        return expression.toString(options);
    }

    trackBy(options?:toStringOptions): TrackByAttribute[] { 
        return [];
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
        const slotValue = slot.name.toString() === "default" || slot.name.toString() === "children"
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

    createContainer(attributes: JsxAttribute[], children: Array<JsxExpression | JsxElement | JsxSelfClosingElement>) { 
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
            .filter(m => m.decorators.find(d => d.name === "Slot"))
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
        const templateOptions = options ? { ...options } : { members: [] };
        const templateExpression = getTemplate(iterator, templateOptions, true);
        const itemsExpression = (expression.expression as PropertyAccess).expression;
        const itemName = this.getIteratorItemName(iterator.parameters[0].name, templateOptions).toString();
        const itemsExpressionString = itemsExpression.toString(options);
        let template: string = templateExpression ? templateExpression.toString(templateOptions) : "";
        const item = `let ${itemName} of ${itemsExpressionString}`;
        const ngForValue = [item];
        if (iterator.parameters[1]) {
            ngForValue.push(`index as ${iterator.parameters[1]}`);
        }

        if (isElement(templateExpression)) {
            const keyAttribute = templateExpression.attributes
                .find(a => a instanceof JsxAttribute && a.name.toString() === "key") as JsxAttribute;
            if (keyAttribute) {
                const trackByName = new Identifier(`_trackBy_${itemsExpressionString.replace(".", "_")}_${counter.get()}`);
                ngForValue.push(`trackBy: ${trackByName}`);
                templateExpression.addAttribute(
                    new TrackByAttribute(
                        trackByName,
                        keyAttribute.initializer.toString(templateOptions),
                        iterator.parameters[1]?.name.toString() || "",
                        itemName
                    )
                );
            }
            if (options) {
                options.hasStyle = options.hasStyle || templateOptions.hasStyle;
            }
        }

        if (templateExpression instanceof BaseJsxExpression) { 
            const expression = new JsxChildExpression(templateExpression as JsxExpression);
            template = expression.toString(templateOptions);
        }
                
        return `<ng-container *ngFor="${ngForValue.join(";")}">${
            template
        }</ng-container>`;
    }

    toString(options?: toStringOptions) {
        const expression = this.getExpression(options);
        
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

        if (this.expression instanceof StringLiteral) { 
            return this.expression.expression;
        }
        const stringValue = super.toString(options);

        if (this.expression.isJsx() || stringValue.startsWith("<") || stringValue.startsWith("(<")) { 
            return stringValue;
        }

        const slot = this.getSlot(stringValue, options);
        if (slot) { 
            return this.compileSlot(slot as Property);
        }

        return `{{${stringValue}}}`;
    }

    trackBy(options?:toStringOptions): TrackByAttribute[] { 
        const iterator = this.getIterator(this.getExpression(options));

        if (iterator) {
            const templateOptions = options ? { ...options } : options;
            const templateExpression = getTemplate(iterator, templateOptions, true);
            if (isElement(templateExpression)) {
                return templateExpression.trackBy(options);
            }       
        }

        return [];
    }
}

export class JsxSpreadAttribute extends JsxExpression{
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
        const children = this.children.concat(this.openingElement.getSlotsFromAttributes(options));
        
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

    trackBy(options?: toStringOptions): Array<TrackByAttribute> { 
        return this.openingElement.trackBy().concat(this.children.reduce((trackBy: Array<TrackByAttribute>, c) => {
            if (c instanceof JsxExpression || c instanceof JsxElement) {
                return trackBy.concat(c.trackBy(options));
            }

            return trackBy;
         }, []));
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
        if (this.name === "OneWay") {
            return "@Input()";
        } else if (this.name === "TwoWay" || this.name === "Template") {
            return "@Input()";
        } else if (this.name === "Effect" || this.name === "Ref" || this.name === "ApiRef" || this.name === "InternalState" || this.name === "Method") {
            return "";
        } else if (this.name === "Component") {
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
        } else if (this.name === "Event") { 
            return "@Output()";
        }
        return super.toString();
    }
}

function compileCoreImports(members: Array<Property|Method>, context: AngularGeneratorContext, imports:string[] = []) { 
    if (members.filter(m => m.decorators.find(d => d.name === "OneWay")).length) {
        imports.push("Input");
    }
    if (members.filter(m => m.decorators.find(d => d.name === "TwoWay")).length) { 
        imports.push("Input", "Output", "EventEmitter");
    }
    if (members.filter(m => m.isTemplate).length) { 
        imports.push("Input", "TemplateRef");
    }
    if (members.filter(m => m.isEvent).length) { 
        imports.push("Output", "EventEmitter");
    }

    if (members.filter(m => m.isSlot).length) {
        imports.push("ViewChild", "ElementRef");
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
        return `
        ${compileCoreImports(this.members.filter(m => !m.inherited), this.context)}
        ${this.modifiers.join(" ")} class ${this.name} ${this.heritageClauses.map(h => h.toString())} {
            ${this.members.filter(p => p instanceof Property && !p.inherited).map(m => m.toString()).filter(m => m).concat("").join(";\n")}
        }`;
    }
}

function parseEventType(type: TypeExpression|string) { 
    if(type instanceof FunctionTypeNode){
        return type.parameters.map(p => {
            const type = p.type?.toString() || "any";
            if (p.questionToken === SyntaxKind.QuestionToken && type !== "any") { 
                return `${type}|${SyntaxKind.UndefinedKeyword}`;
            }
            return type;
        }).join(",");
    }
    return "any";
}

export class Property extends BaseProperty { 
    get name() { 
        return this._name.toString();
    } 
    constructor(decorators: Decorator[] = [], modifiers: string[] = [], name: Identifier, questionOrExclamationToken: string = "", type?: TypeExpression | string, initializer?: Expression, inherited: boolean = false) {
        if (decorators.find(d => d.name === "Template")) {
            type = new SimpleTypeExpression(`TemplateRef<any>`);
        }
        super(decorators, modifiers, name, questionOrExclamationToken, type, initializer, inherited);
    }
    typeDeclaration() { 
        return `${this.name}${this.questionOrExclamationToken}:${this.type}`;
    }
    toString() { 
        const eventDecorator = this.decorators.find(d => d.name === "Event");
        const defaultValue = super.toString();
        if (eventDecorator) { 
            return `${eventDecorator} ${this.name}${this.questionOrExclamationToken}:EventEmitter<${parseEventType(this.type)}> = new EventEmitter()`
        }
        if (this.decorators.find(d => d.name === "Ref")) {
            return `@ViewChild("${this.name}", {static: false}) ${this.name}:ElementRef<${this.type}>`;
        }
        if (this.decorators.find(d => d.name === "ApiRef")) {
            return `@ViewChild("${this.name}", {static: false}) ${this.name}${this.questionOrExclamationToken}:${this.type}`;
        }
        if (this.decorators.find(d => d.name === "Slot")) { 
            const selector = `slot${capitalizeFirstLetter(this.name)}`
            return `@ViewChild("${selector}") ${selector}?: ElementRef<HTMLDivElement>;

            get ${this.name}(){
                return this.${selector}?.nativeElement?.innerHTML.trim();
            }`;
    }
        
        return defaultValue;
    }

    getter(componentContext?: string) { 
        const suffix = this.required ? "!" : "";
        componentContext = this.processComponentContext(componentContext);
        if (this.decorators.find(d => d.name === "Event")) { 
            return `${componentContext}${this.name}!.emit`;
        }
        if (this.decorators.find(d => d.name === "Ref")) { 
            return `${componentContext}${this.name}${this.questionOrExclamationToken}.nativeElement`
        }
        if (this.decorators.find(d => d.name === "ApiRef")) { 
            return `${componentContext}${this.name}${suffix}`
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
        if (this.isEvent) { 
            return false;
        }
        return super.canBeDestructured;
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

export class AngularComponent extends Component {
    decorator: Decorator;
    constructor(componentDecorator: Decorator, modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>, context: GeneratorContext) {
        super(componentDecorator, modifiers, name, typeParameters, heritageClauses, members, context);
        componentDecorator.addParameter("selector", new StringLiteral(this.selector));
        this.decorator = componentDecorator;
    }

    processMembers(members: Array<Property | Method>, heritageClauses: HeritageClause[]) { 
        heritageClauses.forEach(h => { 
            if (h.isRequired) { 
                h.members.forEach(m => { 
                    (m as Property).required = true;
                })
            }
        });
        return super.processMembers(members, heritageClauses);
    }

    addPrefixToMembers(members: Array<Property | Method>, heritageClauses: HeritageClause[]) { 
        members.filter(m => !m.decorators.find(d => d.name === "Method")).forEach(m => {
            m.prefix = "__";
        });
        members = members.reduce((members, member) => {
            if (member.decorators.find(d => d.name === "InternalState") || (member instanceof Property && member.decorators.length===0)) { 
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
        const words = this._name.toString().split(/(?=[A-Z])/).map(w => w.toLowerCase());
        return ["dx"].concat(words).join("-");
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

    compileEffects(ngAfterViewInitStatements: string[], ngOnDestroyStatements: string[], ngOnChanges:string[], ngAfterViewCheckedStatements: string[]) { 
        const effects = this.members.filter(m => m.decorators.find(d => d.name === "Effect")) as Method[];
        let hasInternalStateDependency = false;
        
        if (effects.length) { 
            const statements = [
                "__destroyEffects: Array<() => any> = [];",
                "__viewCheckedSubscribeEvent: Array<()=>void> = [];"
            ];

            const subscribe = (e: Method) => `this.${e.getter()}()`;
            effects.map((e, i) => { 
                const propsDependency = e.getDependency(
                    this.members.filter(m => m.decorators.find(d => d.name === "OneWay" || d.name === "TwoWay")) as Property[]
                );
                const internalStateDependency = e.getDependency(
                    this.members.filter(m => m.decorators.length === 0 || m.decorators.find(d => d.name === "InternalState")) as Property[]
                );
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
                        conditionArray.push(`[${propsDependency.map(d => `"${d}"`).join(",")}].some(d=>${ngOnChangesParameters[0]}[d]`)
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

    compileViewModelArguments() { 
        const args = [
            `props: {${
            this.members
                .filter(m => m.decorators.find(d => d.name === "OneWay"||d.name === "Event"))
                .map(m => `${m.name}: this.${m.name}`)
                .concat(this.members.filter(m=>m.decorators.find(d=>d.name==="TwoWay")).map(m=>`${m.name}:this.${m.name},\n${m.name}Change:this.${m.name}Change`))
                .join(",\n")
            }}`,
            this.members
                .filter(m => m.decorators.length === 0 && !(m instanceof SetAccessor))
                .map(m => `${m._name}: this.${m.name}`)
                .join(",\n")
        ]
        return args;
    }

    compileViewModel() { 
        if (!this.viewModel) { 
            return "";
        }

        return `
        _viewModel: any;

        ngDoCheck(){
            this._viewModel = ${this.viewModel}({${this.compileViewModelArguments().join(",\n")}});
        }
        `;
    }

    compileTrackBy():string {
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
                return expression.trackBy(options).map(a => a.getTrackByDeclaration()).join("\n");
            }
        }

        return "";
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
                        members.push(`@ViewChild("${o.refExpression.toString()}", { static: false }) ${o.refExpression.toString()}: ElementRef<HTMLDivElement>`)
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

    compileDefaultOptions(constructorStatements: string[]): string { 
        if (this.needGenerateDefaultOptions) { 
            constructorStatements.push(`
            const defaultOptions = convertRulesToOptions(__defaultOptionRules);
            for(let option in defaultOptions) {
                this[option] = defaultOptions[option];
            }`);

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
        @HostListener('${this.modelProp.name}Change', ['$event']) change(_) { }
        @HostListener('onBlur', ['$event']) touched = (_) => {};
        
        writeValue(value: any): void {
            this.${this.modelProp.name} = value;
        }
    
        ${disabledProp ? `setDisabledState(isDisabled: boolean): void {
            this.disabled = isDisabled;
        }` : ""}
    
        registerOnChange(fn: (_: any) => void): void { this.change = fn; }
        registerOnTouched(fn: () => void): void { this.touched = fn; }
        `;
    }

    toString() { 
        const extendTypes = this.heritageClauses.reduce((t: string[], h) => t.concat(h.types.map(t => t.type.toString())), []);

        const modules = Object.keys(this.context.components || {})
            .map((k) => this.context.components?.[k])
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

        return `
        ${this.compileImports(coreImports)}
        ${this.compileDefaultOptions(constructorStatements)}
        ${valueAccessor}
        ${componentDecorator}
        ${this.modifiers.join(" ")} class ${this.name} ${extendTypes.length? `extends ${extendTypes.join(" ")}`:""} ${implementedInterfaces.length ? `implements ${implementedInterfaces.join(",")}`:""} {
            ${this.members
                .filter(m => !m.inherited && !(m instanceof SetAccessor))
                .map(m => m.toString({
                    members: this.members,
                    componentContext: SyntaxKind.ThisKeyword,
                    newComponentContext: SyntaxKind.ThisKeyword
                }))
            .filter(m => m).join("\n")}
            ${spreadAttributes}
            ${this.compileTrackBy()}
            ${this.compileViewModel()}
            ${this.compileEffects(ngAfterViewInitStatements, ngOnDestroyStatements, ngOnChangesStatements, ngAfterViewCheckedStatements)}
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
            ${this.members.filter(m=>m instanceof SetAccessor)}
            ${this.compileNgStyleProcessor(decoratorToStringOptions)}
        }
        @NgModule({
            declarations: [${this.name}],
            imports: [
                ${modules.join(",\n")}
            ],
            exports: [${this.name}]
        })
        export class ${this.module} {}
        `;
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

    compileStateSetting(value: string, property: Property, toStringOptions?: toStringOptions) {
        if (property.decorators.find(d => d.name === "TwoWay")) {
            return `this.${this.name}Change!.emit(${this.toString(toStringOptions)}=${value})`;
        }
        return `this._${property.name}=${value}`;
    }
}

export class VariableDeclaration extends BaseVariableDeclaration { 
    processProps(result: string, options:toStringOptions) { 
        return options.newComponentContext!
    }

    toString(options?:toStringOptions) { 
        if (this.isJsx()) { 
            return "";
        }
        return super.toString(options);
    }
}

type AngularGeneratorContext = GeneratorContext & {
    angularCoreImports?: string[];
}

export class AngularGenerator extends Generator {
    createJsxExpression(dotDotDotToken: string = "", expression: Expression) {
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

    createComponent(componentDecorator: Decorator, modifiers: string[], name: Identifier, typeParameters: any, heritageClauses: HeritageClause[], members: Array<Property | Method>) {
        return new AngularComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members, this.getContext());
    }

    createPropertyAccess(expression: Expression, name: Identifier) {
        return new PropertyAccess(expression, name);
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
