const SyntaxKind = {
    ExportKeyword: "export",
    FalseKeyword: "false",
    TrueKeyword: "true",
    AnyKeyword: "any",
    PlusToken: "+",
    MinusToken: "-",
    AsteriskToken: "*",
    SlashToken: "/",
    EqualsToken: "=",
    PlusEqualsToken: "+=",
    MinusEqualsToken: "-=",
    PlusPlusToken: "++",
    MinusMinusToken: "--",
    NumberKeyword: "number",
    EqualsGreaterThanToken: "=>",
    GreaterThanToken: ">",
    GreaterThanEqualsToken: ">=",
    LessThanToken: "<",
    LessThanEqualsToken: "<=",
    NullKeyword: "null",
    DefaultKeyword: "default",
    ThisKeyword: "this",
    VoidKeyword: "void",
    StringKeyword: "string",
    BooleanKeyword: "boolean",
    ExclamationToken: "!",
    EqualsEqualsEqualsToken: "===",
    EqualsEqualsToken: "==",
    BarBarToken: "||",
    BarToken: "|",
    BarEqualsToken: "|=",
    QuestionToken: "?",
    TildeToken: "~",
    ExclamationEqualsEqualsToken: "!==",
   
    AmpersandAmpersandToken: "&&",
    AmpersandToken: "&",
    AmpersandEqualsToken: "&=",
    PercentToken: "%",
    CaretToken: "^"
};

const eventsDictionary = {
    pointerover: "onPointerOver",
    pointerout: "onPointerOut",
    pointerdown: "onPointerDown",
    click: "onClick"
}

function compileType(type: string = "", questionToken: string = "") {
    return type ? `${questionToken}:${type}` : "";
}

function variableDeclaration(name: Identifier, type: string = "", initializer?: Expression, questionToken: string = "") {
    const initilizerDeclaration = initializer ? `=${initializer}` : "";
    return `${name}${compileType(type, questionToken)}${initilizerDeclaration}`;
}

function stateGetter(stateName: Identifier | string, addParen = true) {
    const expr = `${stateName}!==undefined?${stateName}:_${stateName}`;
    return addParen ? `(${expr})` : expr;
}

function getLocalStateName(name: Identifier | string) {
    return `__state_${name}`;
}

function getPropName(name: Identifier | string) {
    return `props.${name}`;
}

class Expression {
    getDependency(): string[] {
        return [];
    }

    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) {
        return "";
    }
}

class SimpleExpression extends Expression {
    expression: string;
    constructor(expression: string) {
        super();
        this.expression = expression;
    }

    toString() {
        return this.expression;
    }
}

class StringLiteral extends SimpleExpression {
    constructor(value: string) {
        super(value);
    }
    toString() {
        return `"${this.expression}"`;
    }
}

export class Identifier extends SimpleExpression {
    constructor(name: string) {
        super(name);
    }

    valueOf() {
        return this.expression;
    }
}


class ExpressionWithExpression extends Expression {
    expression: Expression;

    constructor(expression: Expression) {
        super();
        this.expression = expression;
    }

    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) {
        return this.expression.toString(internalState, state, props);
    }

    getDependency() {
        return this.expression.getDependency();
    }
}

class ExpressionWithOptionalExpression extends Expression {
    expression?: Expression;

    constructor(expression?: Expression) {
        super();
        this.expression = expression;
    }

    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) {
        return this.expression ? this.expression.toString(internalState, state, props) : "";
    }

    getDependency() {
        return this.expression && this.expression.getDependency() || [];
    }
}

class BindingElement {
    dotDotDotToken?: any;
    propertyName?: string;
    name?: string;
    initializer?: Expression;
    constructor(dotDotDotToken: any, propertyName?: string, name?: string, initializer?: Expression) {
        this.dotDotDotToken = dotDotDotToken;
        this.propertyName = propertyName;
        this.name = name;
        this.initializer = initializer;
    }

    toString() {
        const key = this.propertyName ? `${this.propertyName}:` : "";
        return `${key}${this.name}`;
    }
}

class BindingPattern {

    elements: Array<BindingElement>
    type: 'array' | 'object'

    constructor(elements: Array<BindingElement>, type: 'object' | 'array') {
        this.elements = elements;
        this.type = type;
    }

    toString() {
        const elements = this.elements.join(",");
        return this.type === "array" ? `[${elements}]` : `{${elements}}`;
    }
}

class ArrayLiteral extends Expression {
    elements: Expression[];
    multiLine: boolean;
    constructor(elements: Expression[], multiLine: boolean) {
        super();
        this.elements = elements;
        this.multiLine = multiLine;
    }

    toString() {
        return `[${this.elements.join(",")}]`;
    }
}

class PropertyAssignment extends Expression {
    key: string;
    value: Expression;
    constructor(key: string, value: Expression) {
        super();
        this.key = key;
        this.value = value;
    }
    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) {
        return `${this.key}:${this.value.toString(internalState, state, props)}`;
    }

    getDependency() {
        return this.value.getDependency();
    }

}

class ShorthandPropertyAssignment extends ExpressionWithOptionalExpression {
    name: Identifier;

    constructor(name: Identifier, expression?: Expression) {
        super(expression);
        this.name = name;
    }

    get key() {
        return this.name;
    }

    get value() {
        return this.expression ? this.expression : this.name;
    }

    toString() {
        return `${this.name}${this.expression ? `:${this.expression}` : ""}`;
    }

}

class SpreadAssignment extends ExpressionWithExpression {
    key: null = null;
    value: null = null;

    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) {
        return `...${this.expression.toString(internalState, state, props)}`;
    }
}

class ObjectLiteral extends Expression {
    properties: Array<PropertyAssignment | ShorthandPropertyAssignment | SpreadAssignment>;
    multiLine: boolean;
    constructor(properties: Array<PropertyAssignment | ShorthandPropertyAssignment | SpreadAssignment>, multiLine: boolean) {
        super();
        this.properties = properties;
        this.multiLine = multiLine;
    }

    getProperty(propertyName: string) {
        const property = this.properties.find(p => p.key && p.key.toString() === propertyName);
        if (property) {
            return property.value!.toString();
        }
    }

    toString(internalState: InternalState[], state: State[], props: Prop[]) {
        return `{${this.properties.map(p => p.toString(internalState, state, props)).join(`,\n`)}}`;
    }

    getDependency() {
        return this.properties.reduce((d: string[], p) => d.concat(p.getDependency()), []);
    }
}

class Block extends Expression {
    statements: Expression[];
    multiLine: boolean;
    constructor(statements: Expression[], multiLine: boolean) {
        super();
        this.statements = statements;
        this.multiLine = multiLine;
    }

    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) {
        return `{
            ${this.statements.map(s => s.toString(internalState, state, props)).join("\n")}
        }`
    }

    getDependency() {
        return this.statements.reduce((d: string[], s) => {
            return d.concat(s.getDependency());
        }, []);
    }
}

class Parameter {
    decorators: Decorator[]
    modifiers: string[];
    dotDotDotToken: any;
    name: Identifier;
    questionToken: string;
    type?: string;
    initializer: any;
    constructor(decorators: Decorator[], modifiers: string[], dotDotDotToken: any, name: Identifier, questionToken: string = "", type?: string, initializer?: Expression) {
        this.decorators = decorators;
        this.modifiers = modifiers;
        this.dotDotDotToken = dotDotDotToken;
        this.name = name;
        this.questionToken = questionToken;
        this.type = type;
        this.initializer = initializer;
    }

    typeDeclaration() {
        return variableDeclaration(this.name, this.type || "any", undefined, this.questionToken);
    }

    declaration() {
        return variableDeclaration(this.name, this.type, this.initializer, this.questionToken);
    }

    toString() {
        return this.name.toString();
    }
}

class Paren extends ExpressionWithExpression {
    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) {
        return `(${super.toString(internalState, state, props)})`;
    }
}

class Call extends ExpressionWithExpression {
    typeArguments: any[];
    argumentsArray: Expression[];
    constructor(expression: Expression, typeArguments: string[], argumentsArray: Expression[] = []) {
        super(expression);
        this.typeArguments = typeArguments;
        this.argumentsArray = argumentsArray;
    }

    get arguments() {
        return this.argumentsArray.map(a => a);
    }

    toString(internalState: InternalState[], state: State[], props: Prop[]) {
        return `${this.expression.toString(internalState, state, props)}(${this.argumentsArray.map(a => a.toString(internalState, state, props)).join(",")})`;
    }

    getDependency() {
        const argumentsDependency = this.argumentsArray.reduce((d: string[], a) => {
            return d.concat(a.getDependency());
        }, []);
        return super.getDependency().concat(argumentsDependency);
    }
}

class Function {
    decorators: Decorator[];
    modifiers: string[];
    asteriskToken: string;
    name: Identifier | undefined;
    typeParameters: string[];
    parameters: Parameter[];
    type: string;
    body: Block;
    constructor(decorators: Decorator[] = [], modifiers: string[] = [], asteriskToken: string, name: Identifier | undefined, typeParameters: string[] = [], parameters: Parameter[], type: string, body: Block) {
        this.decorators = decorators;
        this.modifiers = modifiers;
        this.asteriskToken = asteriskToken;
        this.name = name;
        this.typeParameters = typeParameters;
        this.parameters = parameters,
            this.type = type;
        this.body = body;
    }

    declaration() {
        return `${this.modifiers.join(" ")} function ${this.name || ""}(${
            this.parameters.map(p => p.declaration()).join(",")
            })${compileType(this.type)}${this.body}`;
    }

    toString() {

    }
}

class ArrowFunction extends Expression {
    modifiers: any[];
    typeParameters: string[];
    parameters: Parameter[];
    type: string;
    body: Block;
    equalsGreaterThanToken: string;
    constructor(modifiers: string[] = [], typeParameters: string[], parameters: Parameter[], type: string, equalsGreaterThanToken: string, body: Block) {
        super();
        this.modifiers = modifiers;
        this.typeParameters = typeParameters;
        this.parameters = parameters;
        this.type = type;
        this.body = body;
        this.equalsGreaterThanToken = equalsGreaterThanToken;
    }

    toString() {
        return `${this.modifiers.join(" ")} (${this.parameters.map(p => p.declaration()).join(",")})${compileType(this.type)} ${this.equalsGreaterThanToken} ${this.body}`;
    }

    getDependency() {
        return this.body.getDependency();
    }
}

class ReturnStatement extends ExpressionWithExpression {
    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) {
        return `return ${super.toString(internalState, state, props)};`;
    }
}

class Binary {
    left: Expression;
    operator: string;
    right: Expression;
    constructor(left: Expression, operator: string, right: Expression) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) {
        if (this.operator === SyntaxKind.EqualsToken &&
            this.left instanceof PropertyAccess &&
            this.left.toString() !== this.left.toString(internalState, state, props) &&
            this.left.expression.toString() === SyntaxKind.ThisKeyword) {
            const rightExpression = this.right.toString(internalState, state, props);

            return `${this.left.compileStateSetting()}(${rightExpression});
            ${this.left.compileStateChangeRising(state, rightExpression)}`;
        }
        return `${this.left.toString(internalState, state, props)}${this.operator}${this.right.toString(internalState, state, props)}`;
    }

    getDependency() {
        return this.left.getDependency().concat(this.right.getDependency());
    }
}

class If extends ExpressionWithExpression {
    thenStatement: Expression;
    elseStatement?: Expression;
    constructor(expression: Expression, thenStatement: Expression, elseStatement?: Expression) {
        super(expression);
        this.thenStatement = thenStatement;
        this.elseStatement = elseStatement;
    }

    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) {
        const elseStatement = this.elseStatement ? `else ${this.elseStatement.toString(internalState, state, props)}` : "";
        return `if(${this.expression.toString(internalState, state, props)})${this.thenStatement.toString(internalState, state, props)}
        ${elseStatement}`;
    }

    getDependency() {
        return super.getDependency()
            .concat(this.thenStatement.getDependency())
            .concat(this.elseStatement ? this.elseStatement.getDependency() : []);
    }
}


class Conditional extends If { 
    constructor(condition: Expression, whenTrue: Expression, whenFalse: Expression) {
        super(condition, whenTrue, whenFalse);
    }

    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) {
        return `${this.expression.toString(internalState, state, props)}?${this.thenStatement.toString(internalState, state, props)}:${this.elseStatement!.toString(internalState, state, props)}`;
    }
}

export class Decorator {
    expression: Call;
    constructor(expression: Call) {
        this.expression = expression;
    }

    get name() {
        return this.expression.expression.toString();
    }

    toString() {
        return "";
        // return `@${this.expression.toString()}`;
    }
}

export class Property {
    decorators: Decorator[]
    modifiers: string[];
    name: Identifier;
    questionOrExclamationToken: string;
    type: string;
    initializer: Expression;

    constructor(decorators: Decorator[], modifiers: string[] = [], name: Identifier, questionOrExclamationToken: string = "", type: string, initializer: Expression) {
        this.decorators = decorators;
        this.modifiers = modifiers;
        this.name = name;
        this.questionOrExclamationToken = questionOrExclamationToken;
        this.type = type;
        this.initializer = initializer;
    }

    toString() {
        return this.name;
    }
}

class Class {
    decorators: Decorator[];
    name: Identifier;
    members: Array<Property | Method>;
    modifiers: string[];
    constructor(decorators: Decorator[] = [], modifiers: string[] = [], name: Identifier, typeParameters: any[], heritageClauses: any, members: Array<Property | Method>) {
        this.decorators = decorators;
        this.name = name;
        this.members = members;
        this.modifiers = modifiers;
    }

    toString() {
        return "";
    }
}

class PropertyAccess extends ExpressionWithExpression {
    name: Identifier
    constructor(expression: Expression, name: Identifier) {
        super(expression);
        this.name = name;
    }

    toString(internalState: InternalState[] = [], state: State[] = [], props: Prop[] = []) {
        const expressionString = this.expression.toString();
        if (expressionString === SyntaxKind.ThisKeyword &&
            props.findIndex(p => p.name.valueOf() === this.name.valueOf()) >= 0) {
            return getPropName(this.name);
        }

        if (expressionString === SyntaxKind.ThisKeyword &&
            (internalState.findIndex(p => p.name.valueOf() === this.name.valueOf()) >= 0)) {
            return getLocalStateName(this.name);
        }

        if (expressionString === SyntaxKind.ThisKeyword) {
            const stateProp = state.find(s => s.name.valueOf() === this.name.valueOf());
            if (stateProp) {
                return `(${stateProp.getter()})`;
            }
        }

        if (expressionString === SyntaxKind.ThisKeyword &&
            state.findIndex(p => p.name.valueOf() === this.name.valueOf()) >= 0) {
            return `${stateGetter(this.name, true)}`;
        }

        return `${this.expression.toString(internalState, state, props)}.${this.name}`;
    }

    compileStateSetting() {
        return stateSetter(this.name);
    }

    compileStateChangeRising(state: State[] = [], rightExpressionString: string) {
        return state.find(s => s.name.valueOf() === this.name.valueOf()) ? `props.${this.name}Change!(${rightExpressionString})` : "";
    }

    getDependency() {
        if (this.expression.toString() === SyntaxKind.ThisKeyword) {
            return [this.name.toString()];
        }
        return [];
    }
}

export class Method {
    decorators: Decorator[];
    modifiers: string[];
    asteriskToken: string;
    name: Identifier;
    questionToken: string;
    typeParameters: any;
    parameters: Parameter[];
    type: string;
    body: Block;
    constructor(decorators: Decorator[] = [], modifiers: string[], asteriskToken: string, name: Identifier, questionToken: string = "", typeParameters: any[], parameters: Parameter[], type: string = "void", body: Block) {
        this.decorators = decorators;
        this.modifiers = modifiers;
        this.asteriskToken = asteriskToken;
        this.name = name;
        this.questionToken = questionToken;
        this.typeParameters = typeParameters;
        this.parameters = parameters,
            this.type = type;
        this.body = body;
    }

    parametersTypeDeclaration() {
        return this.parameters.map(p => p.declaration()).join(",");
    }

    typeDeclaration() {
        return `${this.name}${this.questionToken}:(${this.parameters.map(p => p.typeDeclaration()).join(",")})=>${this.type}`
    }

    declaration(prefix = "", internalState: InternalState[], state: State[], props: Prop[]) {
        return `${prefix} ${this.name}(${this.parametersTypeDeclaration()})${this.body.toString(internalState, state, props)}`;
    }

    arrowDeclaration(internalState: InternalState[], state: State[], props: Prop[]) {
        return `(${this.parametersTypeDeclaration()})=>${this.body.toString(internalState, state, props)}`
    }

    getDependency() {
        return this.body.getDependency();
    }

    toString() {
        return this.name;
    }
}

class Prop {
    property: Property;
    constructor(property: Property) {
        this.property = property;
    }

    defaultProps() {
        return this.defaultDeclaration();
    }

    get name() {
        return this.property.name;
    }

    get type() {
        return this.property.type;
    }

    typeDeclaration() {
        return `${this.name}${this.property.questionOrExclamationToken}:${this.type}`;
    }

    defaultDeclaration() {
        return `${this.name}:${this.property.initializer}`;
    }

    getter() {
        return getPropName(this.name);
    }

    getDependecy() {
        return [this.getter()];
    }

    setter(value: any) {
        return `prop.${this.name}`;
    }
}

class InternalState extends Prop {
    defaultDeclaration() {
        return `const [${getLocalStateName(this.name)}, ${stateSetter(this.name)}] = useState(${this.property.initializer});`;
    }

    defaultProps() {
        return "";
    }

    getter() {
        return getLocalStateName(this.name);
    }

    setter(value: any) {
        return `${stateSetter(this.name)}(${value})`;
    }
}

class State extends InternalState {
    typeDeclaration() {
        return [super.typeDeclaration(),
        `default${capitalizeFirstLetter(this.name)}?:${this.type}`,
        `${this.name}Change?:(${this.name}:${this.type})=>void`
        ].join(",\n");
    }

    defaultProps() {
        return `${this.name}Change:()=>{}`
    }

    defaultDeclaration() {
        const propName = getPropName(this.name);
        return `const [${getLocalStateName(this.name)}, ${stateSetter(this.name)}] = useState(()=>(${propName}!==undefined?${propName}:props.default${capitalizeFirstLetter(this.name)})||${this.property.initializer});`;
    }

    getter() {
        const propName = getPropName(this.name);
        const expression = `${propName}!==undefined?${propName}:${getLocalStateName(this.name)}`;
        return expression;
    }

    getDependecy() {
        return [getPropName(this.name), getLocalStateName(this.name), getPropName(`${this.name}Change`)]
    }

    setter(value: any) {
        return super.setter(value);
    }
}

class Listener {
    method: Method;
    target?: string;
    eventName?: string;

    constructor(method: Method) {
        this.method = method;
        const [event, parameters] = method.decorators.find(d => d.name === "Listen")!.expression.arguments;
        if (parameters) {
            this.target = (parameters as ObjectLiteral).getProperty("target") as string;
        }
        if (event) {
            this.eventName = event.toString();
        }
    }

    get name() {
        return this.method.name;
    }

    typeDeclaration() {
        return this.method.typeDeclaration();
    }

    defaultDeclaration(internalState: InternalState[], state: State[], props: Prop[]) {
        const s = state.concat(props).concat(internalState);
        const dependency = Object.keys(this.method.getDependency().reduce((k: any, d) => {
            if (!k[d]) {
                k[d] = d;
            }
            return k;
        }, {})).map(d => s.find(s => s.name.toString() === d)).filter(d => d).reduce((d: string[], p) => d.concat(p!.getDependecy()), []);
        return `const ${this.name}=useCallback(${this.method.arrowDeclaration(internalState, state, props)}, [${dependency.join(",")}])`;
    }
}

function capitalizeFirstLetter(string: string | Identifier) {
    string = string.toString();
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function stateSetter(stateName: Identifier) {
    return `__state_set${capitalizeFirstLetter(stateName)}`
}

export class ReactComponent {
    props: Prop[] = [];
    state: State[] = [];
    internalState: InternalState[];
    events: Property[] = [];

    modifiers: string[];
    name: Identifier;

    listeners: Listener[];
    methods: Method[];

    view: any;
    viewModel: any;

    constructor(decorator: Decorator, modifiers: string[] = [], name: Identifier, typeParameters: string[], heritageClauses: any, members: Array<Property | Method>) {
        this.modifiers = modifiers;
        this.name = name;

        this.props = members
            .filter(m => m.decorators.find(d => d.name === "Prop" || d.name === "Event"))
            .map(p => new Prop(p as Property));

        this.internalState = members
            .filter(m => m.decorators.find(d => d.name === "InternalState"))
            .map(p => new InternalState(p as Property));

        this.state = members.filter(m => m.decorators.find(d => d.name === "State"))
            .map(s => new State(s as Property));

        this.methods = members.filter(m => m instanceof Method && m.decorators.length === 0) as Method[];

        this.listeners = members.filter(m => m.decorators.find(d => d.name === "Listen"))
            .map(m => new Listener(m as Method));


        const parameters = (decorator.expression.arguments[0] as ObjectLiteral);

        this.view = parameters.getProperty("view");
        this.viewModel = parameters.getProperty("viewModel");
    }

    compileImportStatements(hooks:string[]) { 
        if (hooks.length) {
           return [`import React, {${hooks.join(",")}} from 'react';`];
        } 
        return ["import React from 'react'"];
    }

    getImports() {
        const imports: string[] = [];
        const hooks:string[] = [];

        if (this.internalState.length || this.state.length) {
            hooks.push("useState");
        }

        if (this.listeners.length) {
            hooks.push("useCallback");
        }

        if (this.listeners.filter(l => l.target).length) {
            hooks.push("useEffect");
        }

        return imports.concat(this.compileImportStatements(hooks)).join(";\n");
    }

    compileDefaultProps() {
        const defaultProps = this.props.filter(p => p.property.initializer).concat(this.state);

        if (defaultProps.length) {
            return `${this.name}.defaultProps = {
                ${defaultProps.map(p => p.defaultProps())
                    .join(",\n")}
            }`;
        }

        return "";
    }

    stateDeclaration() {
        if (this.state.length || this.internalState.length) {
            return `
            ${this.state.
                    concat(this.internalState)
                    .map(s => s.defaultDeclaration())
                    .join(";\n")
                }
            `;
        }
        return "";
    }

    listenersDeclaration() {
        if (this.listeners.length) {
            return this.listeners.map(l => l.defaultDeclaration(this.internalState, this.state, this.props)).join(";\n");
        }
        return "";
    }

    compileUseEffect() {
        const subscriptions = this.listeners.filter(m => m.target);
        if (subscriptions.length) {
            const { add, cleanup } = subscriptions.reduce(({ add, cleanup }, s) => {
                (add as string[]).push(`${s.target}.addEventListener(${s.eventName}, ${s.name});`);
                (cleanup as string[]).push(`${s.target}.removeEventListener(${s.eventName}, ${s.name});`);
                return { add, cleanup }
            }, { add: [], cleanup: [] });
            if (add.length) {
                return `useEffect(()=>{
                    ${add.join("\n")}
                    return function cleanup(){
                        ${cleanup.join("\n")}
                    }
                });`;
            }
        }
        return "";
    }

    compileComponentInterface() {
        return `interface ${this.name}{
            ${this.props.concat(this.internalState).concat(this.state)
                .map(p => p.typeDeclaration())
                .concat(this.listeners.map(l => l.typeDeclaration()))
                .join(",\n")
            }
        }`;
    }

    toString() {

        return `
            ${this.getImports()}
            ${this.compileComponentInterface()}

            ${this.modifiers.join(" ")} function ${this.name}(props: {
                    ${this.props
                .concat(this.state)
                .map(p => p.typeDeclaration()).join(",\n")}
                }
            ){
                ${this.stateDeclaration()}
                ${this.listenersDeclaration()}
                ${this.compileUseEffect()}

                ${this.methods.map(m => m.declaration("function", this.internalState, this.state, this.props)).join("\n")}
                
                return ${this.view}(${this.viewModel}({
                    ${
            ["...props"]
                .concat(
                    this.internalState
                        .concat(this.state)
                        .map(s => `${s.name}:${s.getter()}`)
                )
                .concat(this.listeners.map(l => l.name.toString()))
                .join(",\n")
            }
                }));
            }

            ${this.compileDefaultProps()}
        `;
    }
}

class ElementAccess extends ExpressionWithExpression {
    index: Expression;
    constructor(expression: Expression, index: Expression) {
        super(expression);
        this.index = index;
    }

    toString(internalState: InternalState[], state: State[], props: Prop[]) {
        return `${super.toString(internalState, state, props)}[${this.index.toString(internalState, state, props)}]`;
    }

    getDependency() {
        return super.getDependency().concat(this.index.getDependency());
    }
}

class Prefix extends Expression {
    operator: string;
    operand: Expression;
    constructor(operator: string, operand: Expression) {
        super();
        this.operator = operator;
        this.operand = operand;
    }

    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) {
        return `${this.operator}${this.operand.toString(internalState, state, props)}`;
    }

    getDependency() {
        return this.operand.getDependency();
    }
}

class NonNullExpression extends ExpressionWithExpression {
    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) {
        return `${super.toString(internalState, state, props)}!`;
    }
}

class VariableDeclaration extends Expression {
    name: Identifier;
    type: string;
    initializer?: Expression | string;

    constructor(name: Identifier, type: string = "", initializer?: Expression | string) {
        super();
        this.name = name;
        this.type = type;
        this.initializer = initializer;
    }

    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) {
        const initilizerDeclaration = this.initializer ? `=${this.initializer.toString(internalState, state, props)}` : "";
        return `${this.name}${compileType(this.type)}${initilizerDeclaration}`;
    }
}

class VariableDeclarationList extends Expression {
    declarations: VariableDeclaration[];
    flags: string;

    constructor(declarations: VariableDeclaration[] = [], flags: string) {
        super();
        this.declarations = declarations;
        this.flags = flags;
    }

    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) {
        return `${this.flags} ${this.declarations.map(d => d.toString(internalState, state, props)).join(",\n")};`;
    }

    getDependency() {
        return this.declarations.reduce((d: string[], p) => d.concat(p.getDependency()), []);
    }
}

class VariableStatement extends Expression {
    declarationList: VariableDeclarationList;
    modifiers: string[];
    constructor(modifiers: string[] = [], declarationList: VariableDeclarationList) {
        super();
        this.modifiers = modifiers;
        this.declarationList = declarationList;
    }


    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) {
        return `${this.
            modifiers.join(" ")} ${this.declarationList.toString(internalState, state, props)}`;
    }

    getDependency() {
        return this.declarationList.getDependency();
    }
}

class PropertySignature extends ExpressionWithOptionalExpression { 
    modifiers: string[];
    name: Identifier;
    questionToken: string;
    type: string;

    constructor(modifiers: string[] = [], name: Identifier, questionToken: string="", type: string, initializer?: Expression) { 
        super(initializer);
        this.modifiers = modifiers;
        this.name = name;
        this.questionToken = questionToken;
        this.type = type;
    }

    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) { 
        return `${this.name}${this.questionToken}:${this.type}`; 
    }

}

class TemplateSpan extends ExpressionWithExpression { 
    literal: string;
    constructor(expression: Expression, literal: string) { 
        super(expression);
        this.literal = literal;
    }

    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) { 
        return `\${${super.toString(internalState, state, props)}}${this.literal}`;
    }
}

class TemplateExpression extends Expression {
    head: string;
    templateSpans: TemplateSpan[];
    
    constructor(head: string, templateSpans: TemplateSpan[]) {
        super();
        this.head = head;
        this.templateSpans = templateSpans;
    }

    toString(internalState?: InternalState[], state?: State[], props?: Prop[]) {
        return `\`${this.head}${this.templateSpans.map(s => s.toString(internalState, state, props)).join("")}\``;
    }

    getDependency() { 
        return this.templateSpans.reduce((d:string[], t) => d.concat(t.getDependency()), []);
    }

}

export default {
    NodeFlags: {
        Const: "const",
        Let: "let",
        None: "var"
    },

    processSourceFileName(name: string) { 
        return name;
    },

    SyntaxKind: SyntaxKind,

    createIdentifier(name: string): Identifier {
        return new Identifier(name);
    },

    createNumericLiteral(value: string, numericLiteralFlags = ""): Expression {
        return new SimpleExpression(value);
    },

    createVariableDeclaration(name: Identifier, type: string = "", initializer?: Expression | string): VariableDeclaration {
        return new VariableDeclaration(name, type, initializer);
    },

    createVariableDeclarationList(declarations: VariableDeclaration[] = [], flags: string) {
        if (flags === undefined) {
            throw "createVariableDeclarationList";
        }
        return new VariableDeclarationList(declarations, flags);
    },

    createVariableStatement(modifiers: string[] = [], declarationList: VariableDeclarationList): Expression {
        return new VariableStatement(modifiers, declarationList);
    },

    createStringLiteral(value: string) {
        return new StringLiteral(value);
    },

    createBindingElement(dotDotDotToken?: any, propertyName?: string, name?: string, initializer?: Expression) {
        return new BindingElement(dotDotDotToken, propertyName, name, initializer);
    },

    createArrayBindingPattern(elements: Array<BindingElement>) {
        return new BindingPattern(elements, "array");
    },

    createArrayLiteral(elements: Expression[], multiLine: boolean): Expression {
        return new ArrayLiteral(elements, multiLine);
    },

    createObjectLiteral(properties: Array<PropertyAssignment | ShorthandPropertyAssignment | SpreadAssignment>, multiLine: boolean): Expression {
        return new ObjectLiteral(properties, multiLine);
    },

    createObjectBindingPattern(elements: BindingElement[]) {
        return new BindingPattern(elements, "object");
    },

    createPropertyAssignment(key: string, value: Expression) {
        return new PropertyAssignment(key, value)
    },

    createKeywordTypeNode(kind: string) {
        if (kind === undefined) {
            throw "createKeyword"
        }
        return kind;
    },

    createArrayTypeNode(elementType: string) {
        if (elementType === undefined) {
            throw "createArrayTypeNode"
        }
        return `${elementType}[]`;
    },

    createFalse() {
        return new SimpleExpression(this.SyntaxKind.FalseKeyword);
    },

    createTrue(): Expression {
        return new SimpleExpression(this.SyntaxKind.TrueKeyword);
    },

    createNull() {
        return new SimpleExpression(this.SyntaxKind.NullKeyword);
    },

    createThis() {
        return new SimpleExpression(this.SyntaxKind.ThisKeyword);
    },

    createBlock(statements: Expression[], multiLine: boolean) {
        return new Block(statements, multiLine);
    },

    createFunctionDeclaration(decorators: Decorator[] = [], modifiers: string[] = [], asteriskToken: string, name: Identifier, typeParameters: string[], parameters: Parameter[], type: string, body: Block) {
        return new Function(decorators, modifiers, asteriskToken, name, typeParameters, parameters, type, body).declaration();
    },

    createParameter(decorators: Decorator[], modifiers: string[], dotDotDotToken: any, name: Identifier, questionToken?: string, type?: string, initializer?: Expression) {
        return new Parameter(decorators, modifiers, dotDotDotToken, name, questionToken, type, initializer);
    },

    createReturn(expression: Expression) {
        return new ReturnStatement(expression);
    },

    createFunctionExpression(modifiers: string[] = [], asteriskToken: string, name: Identifier | undefined, typeParameters: string[], parameters: Parameter[], type: string, body: Block) {
        return new Function([], modifiers, asteriskToken, name, typeParameters, parameters, type, body).declaration();
    },

    createToken(token: string) {
        if (token === undefined) {
            throw "createToken"
        }
        return token;
    },

    createArrowFunction(modifiers: string[] = [], typeParameters: string[], parameters: Parameter[], type: string, equalsGreaterThanToken: string, body: Block) {
        return new ArrowFunction(modifiers, typeParameters, parameters, type, equalsGreaterThanToken, body);
    },

    createModifier(modifier: string) {
        if (modifier === undefined) {
            throw "createModifier";
        }
        return modifier
    },

    createBinary(left: Expression, operator: string, right: Expression) {
        return new Binary(left, operator, right);
    },

    createParen(expression: Expression) {
        return new Paren(expression);
    },

    createCall(expression: Expression, typeArguments: string[] = [], argumentsArray: Expression[] = []): Expression {
        return new Call(expression, typeArguments, argumentsArray);
    },

    createExportAssignment(decorators: Decorator[] = [], modifiers: string[] = [], isExportEquals: any, expression: Expression) {
        return `export default ${expression}`;
    },

    createShorthandPropertyAssignment(name: Identifier, expression?: Expression) {
        return new ShorthandPropertyAssignment(name, expression)
    },

    createSpreadAssignment(expression: Expression) {
        return new SpreadAssignment(expression);
    },

    createTypeReferenceNode(typeName: string, typeArguments: string[] = []) {
        return typeName;
    },

    createIf(expression: Expression, thenStatement: Expression, elseStatement?: Expression) {
        return new If(expression, thenStatement, elseStatement);
    },

    createImportDeclaration(decorators: Decorator[] = [], modifiers: string[] = [], importClause: string = "", moduleSpecifier: string| StringLiteral) {
        if (moduleSpecifier.toString().indexOf("component_declaration/common") >= 0) {
            return "";
        }
        importClause = importClause ? `${importClause} from ` : "";
        return `import ${importClause}${moduleSpecifier}`;
    },

    createImportSpecifier(propertyName: string | undefined, name: Identifier) {
        return name;
    },

    createNamedImports(node: any[] = [], elements?: any[]) {
        return node.join(",");
    },

    createImportClause(name?: Identifier, namedBindings: string = "") {
        const result: string[] = [];
        if (name) {
            result.push(name.toString());
        }
        if (namedBindings) {
            result.push(`{${namedBindings}}`);
        }

        return result.join(",");
    },

    createDecorator(expression: Call) {
        return new Decorator(expression);
    },

    createProperty(decorators: Decorator[], modifiers: string[], name: Identifier, questionOrExclamationToken: string = "", type: string, initializer: any) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    },

    createClassDeclaration(decorators: Decorator[], modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: any, members: Array<Property | Method>) {
        const componentDecorator = decorators.find(d => d.name === "Component");
        if (componentDecorator) {
            return new ReactComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members);
        }

        return new Class(decorators, modifiers, name, typeParameters, heritageClauses, members)
    },

    createPropertyAccess(expression: Expression, name: Identifier): Expression {
        return new PropertyAccess(expression, name);
    },

    createJsxExpression(dotDotDotToken: string, expression: string) {
        return `{${expression}}`;
    },

    createJsxAttribute(name: string, initializer: any) {
        return `${(eventsDictionary as any)[name] || name}=${initializer}`;
    },

    createJsxAttributes(properties: string[]) {
        return properties.join("\n");
    },

    createJsxOpeningElement(tagName: string, typeArguments: any[], attributes: string) {
        return `<${tagName} ${attributes}>`
    },

    createJsxSelfClosingElement(tagName: string, typeArguments: any[], attributes: string) {
        return `<${tagName} ${attributes}/>`
    },

    createJsxClosingElement(tagName: string) {
        return `</${tagName}>`;
    },

    createJsxElement(openingElement: string, children: string[], closingElement: string) {
        return `${openingElement}${children.join("\n")}${closingElement}`;
    },

    createJsxText(text: string, containsOnlyTriviaWhiteSpaces: string) {
        return containsOnlyTriviaWhiteSpaces ? "" : text;
    },

    createFunctionTypeNode(typeParameters: any, parameters: Parameter[], type: string) {
        return `(${parameters.map(p => p.declaration())})=>${type}`;
    },

    createExpressionStatement(expression: Expression) {
        return expression;
    },

    createMethod(decorators: Decorator[], modifiers: string[], asteriskToken: string, name: Identifier, questionToken: string, typeParameters: any, parameters: Parameter[], type: string, body: Block) {
        return new Method(decorators, modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body);
    },

    createPrefix(operator: string, operand: Expression) {
        if (operator === undefined) {
            throw "createPrefix";
        }
        return new Prefix(operator, operand);
    },

    createPostfix(operator: string, operand: Expression) {
        if (operator === undefined) {
            throw "createPrefix";
        }
        return new Prefix(operator, operand); // ?
    },

    createNonNullExpression(expression: Expression) {
        return new NonNullExpression(expression);
    },

    createElementAccess(expression: Expression, index: Expression): Expression {
        return new ElementAccess(expression, index);
    },

    createPropertySignature(modifiers: string[] = [], name: Identifier, questionToken: string | undefined, type: string, initializer?: Expression) {
        return new PropertySignature(modifiers, name, questionToken, type, initializer);
    },

    createTypeLiteralNode(members: PropertySignature[]) { 
        return `{${members.join(",")}}`;
    },

    createIntersectionTypeNode(types: any[]) { 
        return types.join("&");
    },

    createConditional(condition: Expression, whenTrue: Expression, whenFalse: Expression) { 
        return new Conditional(condition, whenTrue, whenFalse);
    },

    createTemplateHead(text: string, rawText?: string) { 
        return text;
    },
    createTemplateMiddle(text: string, rawText?: string) {
        return text;
     },
    createTemplateTail(text: string, rawText?: string) { 
        return text;
    },

    createTemplateSpan(expression: Expression, literal:string) { 
        return new TemplateSpan(expression, literal);
    },

    createTemplateExpression(head:string, templateSpans:TemplateSpan[]) { 
        return new TemplateExpression(head, templateSpans);
    }
}