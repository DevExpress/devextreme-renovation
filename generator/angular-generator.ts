import {
    Generator,
    Expression,
    Identifier,
    JsxOpeningElement as ReactJsxOpeningElement,
    JsxSelfClosingElement as ReactJsxSelfClosingElement,
    JsxAttribute as ReactJsxAttribute,
    JsxExpression as ReactJsxExpression,
    Decorator,
    Function,
    Parameter,
    Block,
    ReturnStatement,
    Binary,
    StringLiteral
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

export class AngularFunction extends Function { 
    toString() { 
        if (this.body.isJsx()) { 
            return "";
        }
        return super.toString();
    }

    getTemplate() {
        if (!this.body.isJsx()) {
            return "";
        }
        const returnStatement = this.body.statements.find(s => s instanceof ReturnStatement);

        if (returnStatement) { 
            return (returnStatement as ReturnStatement).expression.toString();
        }
    }
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
        return new AngularFunction(decorators, modifiers, asteriskToken, name, typeParameters, parameters, type, body);
    }
}

export default new AngularGenerator();
