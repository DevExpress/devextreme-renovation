import { Identifier } from "./common";
import { Expression, ExpressionWithExpression, SimpleExpression } from "./base";
import { toStringOptions } from "../types";
import SyntaxKind from "../syntaxKind";
import { Conditional } from "./conditions";

export function getJsxExpression(e: ExpressionWithExpression | Expression | undefined): JsxExpression | undefined {
    if (e instanceof Conditional && e.isJsx()) {
        return new JsxExpression(undefined, e);
    } else if (e instanceof JsxExpression || e instanceof JsxElement || e instanceof JsxOpeningElement) {
        return e as JsxExpression;
    }
    else if (e instanceof ExpressionWithExpression) {
        return getJsxExpression(e.expression);
    }
    else if (e instanceof Expression) { 
        return new JsxExpression(undefined, e);
    }
}

export class JsxAttribute { 
    name: Identifier;
    initializer: Expression;
    constructor(name: Identifier, initializer?: Expression) { 
        this.name = name;
        this.initializer = initializer || new JsxExpression(undefined, new SimpleExpression("true"));
    }

    toString(options?:toStringOptions) { 
        const name = this.name.toString(options);
        return `${name}=${this.initializer.toString(options)}`;
    }
}

export class JsxOpeningElement extends Expression { 
    tagName: Expression;
    typeArguments: any[];
    attributes: Array<JsxAttribute | JsxSpreadAttribute>;
    
    processTagName(tagName: Expression) { 
        return tagName;
    }

    constructor(tagName: Expression, typeArguments: any, attributes: Array<JsxAttribute|JsxSpreadAttribute>=[]) { 
        super();
        this.tagName = this.processTagName(tagName);
        this.typeArguments = typeArguments;
        this.attributes = attributes;
    }

    attributesString(options?:toStringOptions) { 

        return this.attributes.map(a => a.toString(options))
            .filter(s => s)
            .join("\n");
    }

    toString(options?:toStringOptions) { 
        return `<${this.tagName.toString(options)} ${this.attributesString(options)}>`;
    }

    addAttribute(attribute: JsxAttribute) { 
        this.attributes.push(attribute);
    }

    isJsx() { 
        return true
    }
}

export class JsxElement extends Expression { 
    openingElement: JsxOpeningElement;
    children: Array<JsxElement | string | JsxExpression | JsxSelfClosingElement>;
    closingElement: JsxClosingElement;
    constructor(openingElement: JsxOpeningElement, children: Array<JsxElement | string | JsxExpression | JsxSelfClosingElement>, closingElement: JsxClosingElement) { 
        super();
        this.openingElement = openingElement;
        this.children = children;
        this.closingElement = closingElement;
    }

    get attributes() { 
        return this.openingElement.attributes;
    }

    toString(options?: toStringOptions) {
        const children: string = this.children.map(c => c.toString(options)).join("\n");
        return `${this.openingElement.toString(options)}${children}${this.closingElement.toString(options)}`;
    }

    addAttribute(attribute: JsxAttribute) { 
        this.openingElement.addAttribute(attribute);
    }

    isJsx() { 
        return true;
    }
}

export class JsxSelfClosingElement extends JsxOpeningElement{
    toString(options?:toStringOptions) { 
        return `<${this.tagName.toString(options)} ${this.attributesString(options)}/>`;
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

export class JsxExpression extends ExpressionWithExpression { 
    dotDotDotToken: string;
    constructor(dotDotDotToken: string="", expression: Expression) {
        super(expression);
        this.dotDotDotToken = dotDotDotToken;
    }

    toString(options?:toStringOptions) { 
        return `{${this.dotDotDotToken}${this.expression.toString(options)}}`;
    }

    isJsx() { 
        return true;
    }
}

export class JsxSpreadAttribute extends JsxExpression {
    constructor(expression: Expression) { 
        super(SyntaxKind.DotDotDotToken, expression)
    }
}
