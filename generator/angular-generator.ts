import {
    Generator,
    Expression,
    Identifier,
    JsxOpeningElement as ReactJsxOpeningElement,
    JsxSelfClosingElement as ReactJsxSelfClosingElement,
    JsxAttribute as ReactJsxAttribute,
    JsxExpression as ReactJsxExpression,
    Decorator as BaseDecorator,
    Function,
    Parameter,
    Block,
    ReturnStatement,
    Binary,
    StringLiteral,
    Call,
    ComponentInput as BaseComponentInput,
    HeritageClause,
    Property as BaseProperty,
    Method as BaseMethod,
    GeneratorContex,
    ObjectLiteral,
    ReactComponent,
    ArrowFunction,
    ExpressionWithExpression,
    VariableDeclaration as BaseVariableDeclaration,
    TemplateExpression,
    PropertyAccess as BasePropertyAccess,
    toStringOptions as ReactToStringOptions,
    JsxElement as ReactJsxElement,
    VariableDeclarationList,
    VariableExpression,
    JsxClosingElement,
    GetAccessor as BaseGetAccessor
} from "./react-generator";

import SyntaxKind from "./syntaxKind";

interface toStringOptions extends  ReactToStringOptions {
    members: Array<Property | Method>
}

export class JsxOpeningElement extends ReactJsxOpeningElement { 

}

export class JsxSelfClosingElement extends ReactJsxSelfClosingElement{ 
    toString(options?: toStringOptions) {
        const tagName = this.tagName.toString(options);
        const contextExpr = options?.newComponentContext ? `${options.newComponentContext}.` : "";
        const template = options?.members
            .filter(m => m.decorators.find(d => d.name === "Template"))
            .find(s => tagName.endsWith(`${contextExpr}${s.name.toString()}`));
        
        if (template) { 
            const contextElements = this.attributes.map(a => { 
                return `${a.name.toString(options)}: ${(a as JsxAttribute).compileInitializer(options)}`;
            });
            const contextString = contextElements.length?`; context={${contextElements.join(",")}}`:""
            return `<ng-container *ngTemplateOutlet="${contextExpr}${template.name}${contextString}"></ng-container>`
        }
        
        return super.toString(options);
    }
}

export class JsxAttribute extends ReactJsxAttribute { 
    compileInitializer(options?: toStringOptions) { 
        return this.initializer.toString({
            members: [],
            props: [],
            internalState: [],
            state: [],
            disableTemplates: true,
            ...options
        }).replace(/"/gi, String.raw`\"`);
    }

    toString(options?:toStringOptions) { 
        if (this.name.toString() === "ref") { 
            return `#${this.initializer.toString()}`;
        }
        if (this.initializer instanceof StringLiteral) { 
            return `${this.name}=${this.initializer.toString()}`;
        }
        return `[${this.name}]="${this.compileInitializer(options)}"`;
    }
}

export class AngularDirective extends JsxAttribute { 
    toString(options?: toStringOptions) { 
        return `${this.name}="${this.compileInitializer(options)}"`;
    }
}

export class JsxExpression extends ReactJsxExpression {
    toString(options?: toStringOptions) {
        return this.expression.toString(options);
    }
}

export class JsxChildExpression extends JsxExpression { 
    constructor(expression: JsxExpression) { 
        super(expression.dotDotDotToken, expression.expression);
    }

    toString(options?: toStringOptions) {
        const stringValue = super.toString(options);
        if (this.expression.isJsx()) { 
            return stringValue;
        }
        if (this.expression instanceof StringLiteral) { 
            return this.expression.expression;
        }
        const contextExpr = options?.newComponentContext ? `${options.newComponentContext}.` : "";
        const slot = options?.members
            .filter(m => m.decorators.find(d => d.name === "Slot"))
            .find(s => stringValue.endsWith(`${contextExpr}${s.name.toString()}`)
                || s.name.toString() === "children" && (stringValue.endsWith(".default") || stringValue.endsWith(".children")));
        if (slot) { 
            if (slot.name.toString() === "default" || slot.name.toString() === "children") { 
                return `<ng-content></ng-content>`;
            }
            return `<ng-content select="[${slot.name}]"></ng-content>`;
        }

        return `{{${stringValue}}}`;
    }
}

export class JsxElement extends ReactJsxElement { 
    children: Array<JsxElement | string | JsxChildExpression | JsxSelfClosingElement>;
    constructor(openingElement: JsxOpeningElement, children: Array<JsxElement|string|JsxExpression|JsxSelfClosingElement>, closingElement: JsxClosingElement) { 
        super(openingElement, children, closingElement);
        this.openingElement = openingElement;
        this.children = children.map(c => c instanceof JsxExpression ? new JsxChildExpression(c) : c);
        this.closingElement = closingElement;
    }

    toString(options?: toStringOptions) { 
        const children: string = this.children.map(c => c.toString(options)).join("\n");
        if (this.openingElement.tagName.toString() === "Fragment") {
            return children;
        }
        return `${this.openingElement.toString(options)}${children}${this.closingElement.toString(options)}`;
    }
}

function getJsxExpression(e: ExpressionWithExpression | Expression): JsxExpression | undefined {
    if (e instanceof JsxExpression || e instanceof JsxElement || e instanceof ReactJsxOpeningElement) {
        return e as JsxExpression;
    }
    else if (e instanceof ExpressionWithExpression) { 
        return getJsxExpression(e.expression);
    }
}

function getAngularTemplate(functionWithTemplate: AngularFunction | ArrowFunctionWithTemplate, options?: toStringOptions) {
    if (!functionWithTemplate.isJsx()) {
        return "";
    }

    const statements = functionWithTemplate.body instanceof Block ?
        functionWithTemplate.body.statements :
        [functionWithTemplate.body];
    
    const returnStatement = functionWithTemplate.body instanceof Block ?
        statements.find(s => s instanceof ReturnStatement) :
        statements[0];

    if (returnStatement) { 
        const componentParamenter = functionWithTemplate.parameters[0];
        if (options) { 
            if (componentParamenter && componentParamenter.name instanceof Identifier) { 
                options.componentContext = componentParamenter.toString();
            }

            options.variables = statements.reduce((v: VariableExpression, statement) => {
                if (statement instanceof VariableDeclarationList) { 
                    return {
                        ...statement.getVariableExpressions(),
                        ...v
                    }
                }
                return v;
            }, {});
        }
        
        const expression = getJsxExpression(returnStatement)?.toString(options);
        
        if (expression && componentParamenter) { 
            return expression
                //.replace(new RegExp(functionWithTemplate.parameters[0].name.toString(), "g"), "_viewModel");
        }
        return expression;
    }
}
export class AngularFunction extends Function { 
    isJsx() { 
        return this.body.isJsx();
    }
    toString() { 
        if (this.isJsx()) { 
            return "";
        }
        return super.toString();
    }

    getTemplate(options?: toStringOptions) {
        return getAngularTemplate(this, options);
    }
}

export class ArrowFunctionWithTemplate extends ArrowFunction { 
    isJsx() { 
        return this.body.isJsx();
    }
    toString() { 
        if (this.isJsx()) { 
            return "";
        }
        return super.toString();
    }
    
    getTemplate(options?: toStringOptions) {
        return getAngularTemplate(this, options);
    }
}

class Decorator extends BaseDecorator { 
    context: AngularGeneratorContext;
    constructor(expression: Call, context: AngularGeneratorContext) { 
        super(expression);
        this.context = context;
    }

    addParameter(name: string, value: Expression) {
        if (this.name !== "Component") { 
            return;
        }
        const parameters = (this.expression.arguments[0] as ObjectLiteral);
        parameters.setProperty(name, value);
    }

    toString(options?: toStringOptions) { 
        if (this.name === "OneWay" || this.name === "Event") {
            return "@Input()";
        } else if (this.name === "TwoWay" || this.name === "Template") {
            return "@Input()";
        } else if (this.name === "Effect" || this.name === "Ref") {
            return "";
        } else if (this.name === "Component") { 
            const parameters = (this.expression.arguments[0] as ObjectLiteral);
            const viewFunctionValue = parameters.getProperty("view");
            let viewFunction: ArrowFunctionWithTemplate | AngularFunction | null = null;
            if (viewFunctionValue instanceof Identifier) { 
                viewFunction = this.context.viewFunctions ? this.context.viewFunctions[viewFunctionValue.toString()] : null;
            }

            if (viewFunction) { 
                const template = viewFunction.getTemplate(options);
                if (template) { 
                    parameters.setProperty("template", new TemplateExpression(template, []));
                }
            }

            parameters.removeProperty("view");
            parameters.removeProperty("viewModel");
        }
        return super.toString();
    }
}

class ComponentInput extends BaseComponentInput { 
    toString() {
        return `${this.modifiers.join(" ")} class ${this.name} ${this.heritageClauses.map(h => h.toString())} {
            ${this.members.filter(p => p instanceof Property && !p.inherited).map(m => m.toString()).filter(m => m).concat("").join(";\n")}
        }`;
    }
}

export class Property extends BaseProperty { 
    get name() { 
        if (this.decorators.find(d => d.name === "Slot")) { 
            return super.name;
        }
        return this._name.toString();
    }
    constructor(decorators: Decorator[], modifiers: string[] = [], name: Identifier, questionOrExclamationToken: string = "", type: string = "any", initializer?: Expression, inherited: boolean=false) { 
        if (decorators.find(d => d.name === "Template")) { 
            type = `TemplateRef<any>`;
        }
        super(decorators, modifiers, name, questionOrExclamationToken, type, initializer, inherited);
    }
    toString() { 
        const eventDecorator = this.decorators.find(d => d.name === "Event");
        const defaultValue = `${this.modifiers.join(" ")} ${this.decorators.map(d => d.toString()).join(" ")} ${this.typeDeclaration()} ${this.initializer && this.initializer.toString() ? `= ${this.initializer.toString()}` : ""}`;
        if (eventDecorator) { 
            return `${eventDecorator} ${this.name}:EventEmitter<any> = new EventEmitter()`
        }
        if (this.decorators.find(d => d.name === "Ref")) {
            return `@ViewChild("_widgetModel.${this.name}", {static: false}) ${this.name}:ElementRef<${this.type}>`;
        }
        if (this.decorators.find(d => d.name.toString() === "TwoWay")) { 
            return `${defaultValue};
            @Output() ${this.name}Change: EventEmitter<${this.type}> = new EventEmitter()`
        }
        if (this.decorators.find(d => d.name === "Slot")) { 
            return "";
        }
        
        return defaultValue;
    }

    getter() { 
        if (this.decorators.find(d => d.name === "Event")) { 
            return `${this.name}.emit`;
        }
        if (this.decorators.find(d => d.name === "Ref")) { 
            return `${this.name}.nativeElement`
        }
        return this.name.toString();
    }

    inherit() { 
        return new Property(this.decorators as Decorator[], this.modifiers, this._name, this.questionOrExclamationToken, this.type, this.initializer, true);
    }
}

class Method extends BaseMethod { 
    toString(options: toStringOptions) { 
        return `${this.modifiers.join(" ")} ${this.name}(${
            this.parameters.map(p => p.declaration()).join(",")
            })${this.type ? `:${this.type}` : ""}${this.body.toString(options)}`;
    }

    getter() { 
        return this.name.toString();
    }
}

class GetAccessor extends BaseGetAccessor { 
    toString(options?: toStringOptions) { 
        return `get ${this.name}()${this.body.toString(options)}`;
    }

    getter() { 
        return this.name;
    }
}

class AngularComponent extends ReactComponent {
    decorator: Decorator;
    constructor(componentDecorator: Decorator, modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>, context: GeneratorContex) { 
        super(componentDecorator, modifiers, name, typeParameters, heritageClauses, members, context);
        componentDecorator.addParameter("selector", new StringLiteral(this.selector));
        this.decorator = componentDecorator;
    }

    get name() { 
        return `Dx${this._name}Component`;
    }

    get selector() {
        const words = this._name.toString().split(/(?=[A-Z])/).map(w => w.toLowerCase());
        return ["dx"].concat(words).join("-");
    }

    compileImports() { 
        const core = ["Component", "NgModule"];
        if (this.props.filter(p => p.property.decorators.find(d => d.name === "OneWay")).length) {
            core.push("Input");
        }
        if (this.state.length) { 
            core.push("Input", "Output", "EventEmitter");
        }
        if (this.members.filter(m => m.decorators.find(d=>d.name==="Template")).length) { 
            core.push("Input", "TemplateRef");
        }
        if (this.props.filter(p => p.property.decorators.find(d => d.name === "Event")).length) { 
            core.push("EventEmitter");
        }
        if (this.refs.length) {
            core.push("ViewChild, ElementRef");
        }

        return [
            `import {${core.join(",")}} from "@angular/core"`,
            'import {CommonModule} from "@angular/common"'
        ].join(";\n");
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
                .filter(m => m.decorators.length === 0)
                .map(m => `${m.name}: this.${m.name}`)
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

    toString() { 
        const extendTypes = this.heritageClauses.reduce((t: string[], h) => t.concat(h.types.map(t => t.type)), []);
        return `
        ${this.compileImports()}
        ${this.decorator.toString({
            members: this.members,
            state: [],
            internalState: [],
            props: [],
            newComponentContext: this.viewModel ? "_viewModel" : ""
        })}
        ${this.modifiers.join(" ")} class ${this.name} ${extendTypes.length? `extends ${extendTypes.join(" ")}`:""} {
            ${this.members.map(m => m.toString({
                internalState: [],
                state: [],
                props: [],
                members: this.members
            })).filter(m=>m).join(";\n")}
            ${this.compileViewModel()}
        }
        @NgModule({
            declarations: [${this.name}],
            imports: [
                CommonModule
            ],
            exports: [${this.name}]
        })
        export class ${this.name.replace(/(.+)(Component)/, "$1Module")} {}
        `;
    }
}

export class PropertyAccess extends BasePropertyAccess {
    toString(options?: toStringOptions) {

        if (options && !("newComponentContext" in options)) { 
            options.newComponentContext = SyntaxKind.ThisKeyword;
        }

        const result = super.toString(options);
        if (options && result === `${options.newComponentContext}.props`) { 
            return options.newComponentContext!;
        }

        return result;
    }

    compileStateSetting(value: string) {
        return `this.${this.name}Change.emit(${this.toString()}=${value})`;
    }

    compileStateChangeRising() {
        return "";
    }
}

export class VariableDeclaration extends BaseVariableDeclaration { 
    isJsx() { 
        return this.initializer instanceof Expression && this.initializer.isJsx()
    }
    toString(options?:toStringOptions) { 
        if (this.isJsx()) { 
            return "";
        }
        return super.toString(options);
    }
}

type AngularGeneratorContext = GeneratorContex & {
    viewFunctions?: { [name: string]: AngularFunction | ArrowFunctionWithTemplate };
}

export class AngularGenerator extends Generator { 
    createJsxExpression(dotDotDotToken: string = "", expression: Expression) {
        if (expression instanceof Binary &&
            expression.operator === this.SyntaxKind.AmpersandAmpersandToken &&
            !expression.left.isJsx() &&
            (expression.right instanceof JsxElement || expression.right instanceof JsxSelfClosingElement)
        ) {
            expression.right.addAttribute(new AngularDirective(new Identifier("*ngIf"), expression.left));
            expression = expression.right;
        }
        return new JsxExpression(dotDotDotToken, expression);
    }

    createJsxAttribute(name: Identifier, initializer: Expression) {
        if (name.toString() === "className") { 
            name.expression = "class";
        }
        return new JsxAttribute(name, initializer);
    }

    // createJsxSpreadAttribute(expression: Expression) {
    //     return `{...${expression.toString()}}`;
    // }

    createJsxAttributes(properties: JsxAttribute[]) {
        return properties;
    }

    createJsxOpeningElement(tagName: Expression, typeArguments: any[]=[], attributes: JsxAttribute[]=[]) {
        return new JsxOpeningElement(tagName, typeArguments, attributes);
    }

    createJsxSelfClosingElement(tagName: Expression, typeArguments: any[]=[], attributes:  JsxAttribute[]=[]) {
        return new JsxSelfClosingElement(tagName, typeArguments, attributes);
    }

    createJsxClosingElement(tagName: Identifier) {
        return new JsxClosingElement(tagName);
    }

    createJsxElement(openingElement: JsxOpeningElement, children: Array<JsxElement|string|JsxExpression|JsxSelfClosingElement>, closingElement: JsxClosingElement) {
        return new JsxElement(openingElement, children, closingElement);
    }

    createJsxText(text: string, containsOnlyTriviaWhiteSpaces: string) {
        return containsOnlyTriviaWhiteSpaces ? "" : text;
    }

    createFunctionDeclaration(decorators: Decorator[] = [], modifiers: string[] = [], asteriskToken: string, name: Identifier, typeParameters: string[], parameters: Parameter[], type: string, body: Block) {
        const functionDeclaration = new AngularFunction(decorators, modifiers, asteriskToken, name, typeParameters, parameters, type, body, this.getContext());
        if (functionDeclaration.name) { 
            this.addViewFunction(functionDeclaration.name.toString(), functionDeclaration);
        }
        return functionDeclaration;
    }

    createArrowFunction(modifiers: string[] = [], typeParameters: string[] = [], parameters: Parameter[], type: string = "", equalsGreaterThanToken: string, body: Block | Expression) { 
        return new ArrowFunctionWithTemplate(modifiers, typeParameters, parameters, type, equalsGreaterThanToken, body, this.getContext());
    }

    createVariableDeclaration(name: Identifier, type: string = "", initializer?: Expression | string) {
        if (initializer) { 
            this.addViewFunction(name.toString(), initializer);
        }
        return new VariableDeclaration(name, type, initializer);
    }

    createDecorator(expression: Call) {
        return new Decorator(expression, this.getContext());
    }

    createComponentBindings(decorators: Decorator[], modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) { 
        return new ComponentInput(decorators, modifiers, name, typeParameters, heritageClauses, members);
    }

    createProperty(decorators: Decorator[], modifiers: string[] = [], name: Identifier, questionOrExclamationToken: string = "", type: string = "any", initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }

    createMethod(decorators: Decorator[], modifiers: string[], asteriskToken: string, name: Identifier, questionToken: string, typeParameters: any, parameters: Parameter[], type: string, body: Block) {
        return new Method(decorators, modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body);
    }

    createGetAccessor(decorators: Decorator[] = [], modifiers: string[] = [], name: Identifier, parameters: Parameter[], type?: string, body?: Block) {
        return new GetAccessor(decorators, modifiers, name, parameters, type, body);
    }

    createComponent(componentDecorator: Decorator, modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) { 
        return new AngularComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members, this.getContext());
    }

    createPropertyAccess(expression: Expression, name: Identifier) {
        return new PropertyAccess(expression, name);
    }

    context: AngularGeneratorContext[] = [];

    getContext() { 
        return super.getContext() as AngularGeneratorContext;
    }

    addViewFunction(name: string, f: any) {
        if ((f instanceof AngularFunction || f instanceof ArrowFunctionWithTemplate) && f.isJsx()) {
            const context = this.getContext();
            context.viewFunctions = context.viewFunctions || {};
            context.viewFunctions[name] = f;
        }
    }
}

export default new AngularGenerator();
