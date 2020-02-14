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
    Method,
    GeneratorContex,
    ObjectLiteral,
    ReactComponent,
    ArrowFunction,
    ExpressionWithExpression,
    VariableDeclaration as BaseVariableDeclaration
} from "./react-generator";

export class JsxOpeningElement extends ReactJsxOpeningElement { 

}

export class JsxSelfClosingElement extends ReactJsxSelfClosingElement{ 

}

export class JsxAttribute extends ReactJsxAttribute { 
    toString() { 
        if (this.name.toString() === "ref") { 
            return `#${this.initializer.toString()}`;
        }
        if (this.initializer instanceof StringLiteral) { 
            return `${this.name}=${this.initializer}`;
        }
        return `[${this.name}]="${this.initializer}"`;
    }
}

export class AngularDirective extends JsxAttribute { 
    toString() { 
        return `${this.name}="${this.initializer}"`;
    }
}

export class JsxExpression extends ReactJsxExpression {
    toString() {
        return this.expression.toString();
    }
}

export class JsxChildExpression extends JsxExpression { 
    constructor(expression: JsxExpression) { 
        super(expression.dotDotDotToken, expression.expression);
    }

    toString() {
        const stringValue = super.toString();
        if (this.expression.isJsx()) { 
            return stringValue;
        }
        if (this.expression instanceof StringLiteral) { 
            return this.expression.expression;
        }
        return `{{${stringValue}}}`;
    }
}

export class JsxElement extends Expression { 
    openingElement: JsxOpeningElement;
    children: Array<JsxElement | string | JsxChildExpression|JsxSelfClosingElement>;
    closingElement: string;
    constructor(openingElement: JsxOpeningElement, children: Array<JsxElement|string|JsxExpression|JsxSelfClosingElement>, closingElement: string) { 
        super();
        this.openingElement = openingElement;
        this.children = children.map(c => c instanceof JsxExpression ? new JsxChildExpression(c) : c);
        this.closingElement = closingElement;
    }

    toString() { 
        return `${this.openingElement}${this.children.join("\n")}${this.closingElement}`;
    }

    addAttribute(attribute: JsxAttribute) { 
        this.openingElement.addAttribute(attribute);
    }

    isJsx() { 
        return true;
    }
}

function getAngularTemplate(functionWithTemplate: AngularFunction | ArrowFunctionWithTemplate) {
    if (!functionWithTemplate.isJsx()) {
        return "";
    }

    const returnStatement = functionWithTemplate.body instanceof Block ?
        functionWithTemplate.body.statements.find(s => s instanceof ReturnStatement) :
        functionWithTemplate.body;

    if (returnStatement) { 
        functionWithTemplate.parameters[0];

        const result = (returnStatement instanceof ExpressionWithExpression) ?
            returnStatement.expression.toString() :
            returnStatement.toString();
        
        if (functionWithTemplate.parameters[0]) { 
            return result.replace(new RegExp(functionWithTemplate.parameters[0].name.toString(), "g"), "_viewModel");
        }
        return result;
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

    getTemplate() {
        return getAngularTemplate(this);
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
    
    getTemplate() {
        return getAngularTemplate(this);
    }
}

class Decorator extends BaseDecorator { 
    viewFunctions: { [name: string]: AngularFunction | ArrowFunctionWithTemplate };
    constructor(expression: Call, viewFunctions: { [name: string]: AngularFunction | ArrowFunctionWithTemplate }) { 
        super(expression);
        this.viewFunctions = viewFunctions;
    }

    addParameter(name: string, value: Expression) {
        if (this.name !== "Component") { 
            return;
        }
        const parameters = (this.expression.arguments[0] as ObjectLiteral);
        parameters.setProperty(name, value);
    }

    toString() { 
        if (this.name === "OneWay" || this.name === "Event") {
            return "@Input()";
        } else if (this.name === "TwoWay") {
            return "@Output()";
        } else if (this.name === "Effect" || this.name === "Ref") {
            return "";
        } else if (this.name === "Component") { 
            const parameters = (this.expression.arguments[0] as ObjectLiteral);
            const viewFunctionValue = parameters.getProperty("view");
            let viewFunction: ArrowFunctionWithTemplate | AngularFunction | null = null;
            if (viewFunctionValue instanceof Identifier) { 
                viewFunction = this.viewFunctions[viewFunctionValue.toString()];
            }

            if (viewFunction) { 
                const template = viewFunction.getTemplate();
                if (template) { 
                    parameters.setProperty("template", new StringLiteral(template));
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
            ${this.members.map(m => m.toString()).concat("").join(";\n")}
        }`;
    }
}

class Property extends BaseProperty { 
    toString() { 
        const eventDecorator = this.decorators.find(d => d.name === "Event");
        if (eventDecorator) { 
            return `${eventDecorator} ${this.name}:EventEmitter<any> = new EventEmitter()`
        }
        if (this.decorators.find(d => d.name === "Ref")) {
            return `@ViewChild("_widgetModel.${this.name}", {static: false}) ${this.name}:ElementRef<${this.type}>`;
        }
        return `${this.modifiers.join(" ")} ${this.decorators.map(d => d.toString()).join(" ")} ${this.typeDeclaration()} ${this.initializer ? `= ${this.initializer.toString()}` : ""}`;
    }
}

class AngularComponent extends ReactComponent {
    constructor(componentDecorator: Decorator, modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) { 
        super(componentDecorator, modifiers, name, typeParameters, heritageClauses, members);
        componentDecorator.addParameter("selector", new StringLiteral(this.selector));
    }

    get selector() {
        const words = this.name.toString().split(/(?=[A-Z])/).map(w => w.toLowerCase());
        return ["dx"].concat(words).join("-");
    }

    compileImports() { 
        const core = ["Component", "NgModule"];
        if (this.props.filter(p => p.property.decorators.find(d => d.name === "OneWay")).length) {
            core.push("Input");
        }
        if (this.state.length) { 
            core.push("Output");
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

    toString() { 
        return "";
    }
}

export class VariableDeclaration extends BaseVariableDeclaration { 
    isJsx() { 
        return this.initializer instanceof Expression && this.initializer.isJsx()
    }
    toString() { 
        if (this.isJsx()) { 
            return "";
        }
        return super.toString();
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

    createJsxOpeningElement(tagName: Identifier, typeArguments: any[]=[], attributes: JsxAttribute[]=[]) {
        return new JsxOpeningElement(tagName, typeArguments, attributes);
    }

    createJsxSelfClosingElement(tagName: Identifier, typeArguments: any[]=[], attributes:  JsxAttribute[]=[]) {
        return new JsxSelfClosingElement(tagName, typeArguments, attributes);
    }

    createJsxClosingElement(tagName: Identifier) {
        return `</${tagName}>`;
    }

    createJsxElement(openingElement: JsxOpeningElement, children: Array<JsxElement|string|JsxExpression|JsxSelfClosingElement>, closingElement: string) {
        return new JsxElement(openingElement, children, closingElement);
    }

    createJsxText(text: string, containsOnlyTriviaWhiteSpaces: string) {
        return containsOnlyTriviaWhiteSpaces ? "" : text;
    }

    createFunctionDeclaration(decorators: Decorator[] = [], modifiers: string[] = [], asteriskToken: string, name: Identifier, typeParameters: string[], parameters: Parameter[], type: string, body: Block) {
        const functionDeclaration = new AngularFunction(decorators, modifiers, asteriskToken, name, typeParameters, parameters, type, body);
        if (functionDeclaration.name) { 
            this.addViewFunction(functionDeclaration.name.toString(), functionDeclaration);
        }
        return functionDeclaration;
    }

    createArrowFunction(modifiers: string[] = [], typeParameters: string[] = [], parameters: Parameter[], type: string = "", equalsGreaterThanToken: string, body: Block | Expression) { 
        return new ArrowFunctionWithTemplate(modifiers, typeParameters, parameters, type, equalsGreaterThanToken, body);
    }

    createVariableDeclaration(name: Identifier, type: string = "", initializer?: Expression | string) {
        if (initializer) { 
            this.addViewFunction(name.toString(), initializer);
        }
        return new VariableDeclaration(name, type, initializer);
    }

    createDecorator(expression: Call) {
        return new Decorator(expression, this.getContext().viewFunctions || {});
    }

    createComponentBindings(decorators: Decorator[], modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) { 
        return new ComponentInput(decorators, modifiers, name, typeParameters, heritageClauses, members);
    }

    createProperty(decorators: Decorator[], modifiers: string[] = [], name: Identifier, questionOrExclamationToken: string = "", type: string = "", initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }

    createComponent(componentDecorator: Decorator, modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) { 
        return new AngularComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members);
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
