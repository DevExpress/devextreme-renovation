const SyntaxKind = {
    ExportKeyword: "export",
    FalseKeyword: "false",
    TrueKeyword: "true",
    AnyKeyword: "any",
    PlusToken: "+",
    EqualsToken: "=",
    NumberKeyword: "number",
    EqualsGreaterThanToken: "=>",
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
    QuestionToken: "?"
};

const eventsDictionary = {
    pointerover: "onPointerOver",
    pointerout: "onPointerOut",
    pointerdown:"onPointerDown",
    click: "onClick"
}

function compileType(type: string = "", questionToken:string="") { 
    return type ? `${questionToken}:${type}` : "";
}

function variableDeclaration(name: string, type: string = "", initializer: any = "", questionToken:string="") {
    const initilizerDeclaration = initializer ? `=${initializer}` : "";
    return `${name}${compileType(type, questionToken)}${initilizerDeclaration}`;
}

function stateGetter(stateName:string, addParen = true) {
    const expr = `${stateName}!==undefined?${stateName}:_${stateName}`;
    return addParen ? `(${expr})` : expr;
}

class BindingElement {
    dotDotDotToken?: any;
    propertyName?: string;
    name?: string;
    initializer: any;
    constructor(dotDotDotToken:any, propertyName?:string, name?:string, initializer?:any) {
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
    type: 'array'|'object'
   
    constructor(elements:Array<BindingElement>, type:'object'|'array') {
        this.elements = elements;
        this.type = type;
    }

    toString() {
        const elements = this.elements.join(",");
        return this.type === "array" ? `[${elements}]` : `{${elements}}`;
    }
}

class ArrayLiteral {
    elements: any;
    multiLine: boolean;
    constructor(elements:any, multiLine:boolean) {
        this.elements = elements;
        this.multiLine = multiLine;
    }

    toString() {
        return `[${this.elements.join(",")}]`;
    }
}

class PropertyAssignment {
    key: string;
    value: any;
    constructor(key:string, value:any) {
        this.key = key;
        this.value = value;
    }
    toString(internalState:any, state:any, props:any) {
        return `${this.key}:${this.value.toString(internalState, state, props)}`;
    }
}

class ShorthandPropertyAssignment {
    name: string;
    expression: any;

    constructor(name:string, expression:any) {
        this.name = name;
        this.expression = expression;
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

class SpreadAssignment {
    expression: any;
    key: null;
    value: null;
    constructor(expression:any) {
        this.expression = expression;
    }

    toString() {
        return `...${this.expression}`;
    }
}

class ObjectLiteral {
    properties: Array<PropertyAssignment|ShorthandPropertyAssignment|SpreadAssignment>;
    multiLine: boolean;
    constructor(properties:Array<PropertyAssignment|ShorthandPropertyAssignment|SpreadAssignment>, multiLine:boolean) {
        this.properties = properties;
        this.multiLine = multiLine;
    }

    getProperty(propertyName:string) {
        const property = this.properties.find(p => p.key === propertyName);
        if (property) {
            return property.value;
        }
    }

    toString(internalState:any, state:any, props:any) {
        return `{${this.properties.map(p=>p.toString(internalState, state, props)).join(`,\n`)}}`;
    }
}

class Block {
    statements: any[];
    multiLine: boolean;
    constructor(statements:any[], multiLine:boolean) {
        this.statements = statements;
        this.multiLine = multiLine;
    }

    toString(internalState:any, state:any, props:any) {
        return `{
            ${this.statements.map(s => s.toString(internalState, state, props)).join("\n")}
        }`
    }
}

class Parameter {
    decorators: Decorator[]
    modifiers:string[];
    dotDotDotToken: any;
    name: string;
    questionToken: string;
    type: string;
    initializer: any;
    constructor(decorators: Decorator[], modifiers: string[], dotDotDotToken: any, name: string, questionToken: string="", type: string, initializer: any) {
        this.decorators = decorators;
        this.modifiers = modifiers;
        this.dotDotDotToken = dotDotDotToken;
        this.name = name;
        this.questionToken = questionToken;
        this.type = type;
        this.initializer = initializer;
    }

    declaration() {
        const type = this.type ? `${this.questionToken}:${this.type}` : "";
        const init = this.initializer ? `${this.initializer}` : "";
        
        return variableDeclaration(this.name, this.type, this.initializer, this.questionToken);
    }

    toString() {
        return this.name;
    }
}

class Paren {
    expression: any;
    constructor(expression:any) {
        this.expression = expression;
    }

    toString() {
        return `(${this.expression})`;
    }
}

class Call {
    expression: any;
    typeArguments: any[];
    argumentsArray: any[];
    constructor(expression:any, typeArguments:string[], argumentsArray:any[] = []) {
        this.expression = expression;
        this.typeArguments = typeArguments;
        this.argumentsArray = argumentsArray;
    }

    get arguments() {
        return this.argumentsArray.map(a => {
            return a;
        })
    }

    toString(internalState:any[], state:any[], props:any[]) {
        return `${this.expression.toString(internalState, state, props)}(${this.argumentsArray.map(a => a.toString(internalState, state, props)).join(",")})`;
    }
}

class Function {
    decorators: Decorator[];
    modifiers: any[];
    asteriskToken:any;
    name: string;
    typeParameters: string[];
    parameters: Parameter[];
    type: string;
    body: Block;
    constructor(decorators:Decorator[] = [], modifiers:any = [], asteriskToken:any, name:string, typeParameters:string[] = [], parameters:Parameter[], type:string, body:Block) {
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
        return `${this.modifiers.join(" ")} function ${this.name}(${
            this.parameters.map(p => p.declaration()).join(",")
        })${compileType(this.type)}${this.body}`;
    }

    toString() {

    }
}

class ArrowFunction {
    modifiers: any[];
    typeParameters: string[];
    parameters: Parameter[];
    type: string;
    body: Block;
    equalsGreaterThanToken: string;
    constructor(modifiers:string[]=[], typeParameters:string[], parameters:Parameter[], type:string, equalsGreaterThanToken:string, body:Block) {
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
}

class ReturnStatement {
    expression: any;
    constructor(expression:any) {
        this.expression = expression;
    }

    toString(internalState: any[], state: any[], props:any[]) {
        return `return ${this.expression.toString(internalState, state, props)};`;
    }
}

class Binary {
    left: any;
    operator: string;
    right: any;
    constructor(left:any, operator:string, right:any) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    toString(internalState: InternalState[], state: State[], props: Prop[]) {
        if (this.operator === SyntaxKind.EqualsToken &&
            this.left instanceof PropertyAccess &&
            this.left.expression === SyntaxKind.ThisKeyword) {
            const rightExpression = this.right.toString(internalState, state, props);

            return `${this.left.compileStateSetting()}(${rightExpression});
            ${this.left.compileStateChangeRising(state, rightExpression)}`;
        }
        return `${this.left}${this.operator}${this.right}`;
    }
}

class If {
    expression: any;
    thenStatement: any;
    elseStatement: any;
    constructor(expression:any, thenStatement:any, elseStatement:any = "") {
        this.expression = expression;
        this.thenStatement = thenStatement;
        this.elseStatement = elseStatement;
    }

    toString() {
        const elseStatement = this.elseStatement ? `else ${this.elseStatement}` : "";
        return `if(${this.expression})${this.thenStatement}
        ${elseStatement}`;
    }
}

class Decorator {
    expression: Call;
    constructor(expression: Call) {
        this.expression = expression;
    }

    get name() {
        return this.expression.expression;
    }

    toString() {
        return "";
        // return `@${this.expression.toString()}`;
    }
}

class Property {
    decorators:Decorator[]
    modifiers: string[];
    name: string;
    questionOrExclamationToken: string;
    type: string;
    initializer: any;
    
    constructor(decorators:Decorator[], modifiers:string[]=[], name:string, questionOrExclamationToken:string="", type:string, initializer:any) {
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
    name: string;
    members: Array<Property|Method>;
    modifiers:string[];
    constructor(decorators: Decorator[] = [], modifiers: string[] = [], name: string, typeParameters: any[], heritageClauses: any, members: Array<Property|Method>) {
        this.decorators = decorators;
        this.name = name;
        this.members = members;
        this.modifiers = modifiers;
    }

    toString() {
        return "";
    }
}

class PropertyAccess {
    expression:any;
    name:string
    constructor(expression:any, name:string) {
        this.expression = expression;
        this.name = name;
    }

    toString(internalState:InternalState[] = [], state:State[] = [], props:Prop[] = []) {
        if (this.expression === SyntaxKind.ThisKeyword &&
            props.findIndex(p => p.name === this.name) >= 0) {
            return `props.${this.name}`;
        }

        if (this.expression === SyntaxKind.ThisKeyword &&
            (internalState.findIndex(p => p.name === this.name) >= 0)) {
            return `__state.${this.name}`;
        }

        if (this.expression === SyntaxKind.ThisKeyword) { 
            const stateProp = state.find(s => s.name === this.name);
            if (stateProp) { 
                return `(${stateProp.getter()})`;
            }
        }

        if (this.expression === SyntaxKind.ThisKeyword &&
            state.findIndex(p => p.name === this.name) >= 0) {
            return `${stateGetter(this.name, true)}`;
        }

        return `${this.expression}.${this.name}`;
    }

    compileStateSetting() {
        return stateSetter(this.name);
    }

    compileStateChangeRising(state:any[], rightExpressionString:any) {
        return state.find(s => s.name === this.name) ? `props.${this.name}Change(${rightExpressionString})` : "";
    }
}

class Method {
    decorators: Decorator[];
    modifiers: string[];
    asteriskToken: string;
    name: string;
    questionToken: string;
    typeParameters: any;
    parameters: Parameter[];
    type: string;
    body: Block;
    constructor(decorators:Decorator[] = [], modifiers:string[], asteriskToken:string, name:string, questionToken:string, typeParameters:any[], parameters:Parameter[], type:string, body:Block) {
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

    declaration(prefix = "", internalState:any, state:any, props:any) {
        return `${prefix} ${this.name}(${this.parameters.map(p => p.declaration()).join(",")})${this.body.toString(internalState, state, props)}`;
    }

    arrowDeclaration(internalState:any, state:any, props:any) {
        return `(${this.parameters.map(p => p.declaration()).join(",")})=>${this.body.toString(internalState, state, props)}`
    }

    toString() {
        return this.name;
    }
}

class Prop{ 
    property: Property;
    constructor(property: Property) { 
        this.property = property;
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
        return `props.${this.name}`;
    }

    setter(value:any) { 
        return `prop.${this.name}`;
    }
}

class InternalState extends Prop { 
    defaultDeclaration() { 
        return `[__state.${this.name}, ${stateSetter(this.name)}] = useState(${this.property.initializer});`;
    }

    getter() { 
        return `__state.${this.name}`;
    }

    setter(value:any){ 
        return `${stateSetter(this.name)}(${value})`;
    }
}

class State extends InternalState{ 
    typeDeclaration() { 
        return [super.typeDeclaration(),
            `default${capitalizeFirstLetter(this.name)}?:${this.type}`,
            `${this.name}Change?:(${this.name}:${this.type})=>void`
        ].join(",\n");
    }

    defaultDeclaration() { 
        return `[__state.${this.name}, ${stateSetter(this.name)}] = useState(()=>(props.${this.name}!==undefined?props.${this.name}:props.default${capitalizeFirstLetter(this.name)})||${this.property.initializer});`;
    }

    getter() { 
        const expression = `props.${this.name}!==undefined?props.${this.name}:__state.${this.name}`;
        return expression;
    }
    
    setter(value:any) { 
        return super.setter(value);
    }
}

class Listener  { 
    method: Method;
    target?: string;
    eventName?: string;

    constructor(method: Method) { 
        this.method = method;
        const [event, parameters] = method.decorators.find(d=>d.name==="Listen")!.expression.arguments;
        if (parameters) {
            this.target = parameters.getProperty("target");
        }
        this.eventName = event;
    }

    get name() {
        return this.method.name;
    }

    defaultDeclaration(internalState: InternalState[], state: State[], props:Prop[]) { 
        return `const ${this.name}=useCallback(${this.method.arrowDeclaration(internalState, state, props)}, [])`;
    }
}

function capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function stateSetter(stateName:string) {
    return `__state.set${capitalizeFirstLetter(stateName)}`
}

class ReactComponent { 
    props: Prop[] = [];
    state: State[] = [];
    internalState: InternalState[];
    events: Property[] = [];

    modifiers: string[];
    name: string;

    listeners: Listener[];
    methods: Method[];

    view: any;
    viewModel: any;

    constructor(decorator: Decorator, modifiers: string[]=[], name: string, typeParameters: string[], heritageClauses: any, members: Array<Property | Method>) { 
        this.modifiers = modifiers;
        this.name = name;

        this.props = members
            .filter(m => m.decorators.find(d => d.name === "Prop" || d.name==="Event"))
            .map(p => new Prop(p as Property));
        
        this.internalState = members
            .filter(m => m.decorators.find(d => d.name === "InternalState"))
            .map(p => new InternalState(p as Property));
        
        this.state = members.filter(m => m.decorators.find(d => d.name === "State"))
            .map(s => new State(s as Property));
    
        this.methods = members.filter(m => m instanceof Method && m.decorators.length === 0) as Method[];

        this.listeners = members.filter(m => m.decorators.find(d => d.name === "Listen"))
            .map(m => new Listener(m as Method));
        
        
        const parameters = decorator.expression.arguments[0].properties
            .reduce((parameters: any, property: PropertyAssignment) => {
                parameters[property.key] = property.value;
                return parameters;
            }, {});
        
        this.view = parameters.view;
        this.viewModel = parameters.viewModel;
    }

    getImports() { 
        const imports:string[] = [];
        const react = [];

        if (this.internalState.length || this.state.length) {
            react.push("useState");
        }

        if (this.listeners.length) {
            react.push("useCallback");
        }

        if (this.listeners.filter(l=>l.target).length) {
            react.push("useEffect");
        }

        if (react.length) {
            imports.push(`import React, {${react.join(",")}} from 'react';`);
        } else { 
            imports.push("import React from 'react'");
        }

        return imports.join("\n");
    }

    compileDefaultProps() { 
        const defaultProps = this.props.filter(p => p.property.initializer);

        if (defaultProps.length) { 
            return `${this.name}.defaultProps = {
                ${defaultProps.map(p => p.defaultDeclaration()).join(",\n")}
            }`;
        }

        return "";
    }

    stateDeclaration() { 
        if (this.state.length || this.internalState.length) { 
            return `
            const __state:any = {};
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

    toString() { 
        
        return `
            ${this.getImports()}

            ${this.modifiers.join(" ")} function ${this.name}(props: {
                    ${this.props
                        .concat(this.state)
                        .map(p => p.typeDeclaration()).join(",\n")}
                }
            ){
                ${this.stateDeclaration()}
                ${this.listenersDeclaration()}
                ${this.compileUseEffect()}

                ${this.methods.map(m=>m.declaration("function", this.internalState, this.state, this.props)).join("\n")}
                
                return ${this.view}(${this.viewModel}({
                    ${
                        ["...props"]
                        .concat(
                            this.internalState
                                .concat(this.state)
                                .map(s => `${s.name}:${s.getter()}`)
        )
            .concat(this.listeners.map(l=>l.name))
            .join(",\n")
                    }
                }));
            }

            ${this.compileDefaultProps()}
        `;
    }
}

class Prefix {
    operator: string;
    operand: any;
    constructor(operator:string, operand:any) {
        this.operator = operator;
        this.operand = operand;
    }

    toString(internalState:InternalState[], state:any, props:Prop[]) {
        return `${this.operator}${this.operand.toString(internalState, state, props)}`
    }
}

class NonNullExpression { 
    expression: any;
    constructor(expression: any) { 
        this.expression = expression;
    }
    toString(internalState: InternalState[], state: State[], props: Prop[]) { 
        return `${this.expression.toString(internalState, state, props)}!`;
    }
}

export default {
    NodeFlags: {
        Const: "const",
        Let: "let",
        None: "var"
    },

    SyntaxKind: SyntaxKind,

    createIdentifier(name: string) {
        return name;
    },

    createNumericLiteral(value: string, numericLiteralFlags = "") {
        return value;
    },

    createVariableDeclaration(name: string, type: string="", initializer:any = "") {
        return variableDeclaration(name, type, initializer);
    },

    createVariableDeclarationList(declarations = [], flags: string) {
        if (flags === undefined) {
            throw "createVariableDeclarationList";
        }
        return `${flags} ${declarations.join(",\n")};`;
    },

    createVariableStatement(modifiers = [], declarationList: string) {
        return `${modifiers} ${declarationList}`;
    },

    createStringLiteral(value: string) {
        return `"${value}"`;
    },

    createBindingElement(dotDotDotToken?: any, propertyName?: string, name?: string, initializer?: any) {
        return new BindingElement(dotDotDotToken, propertyName, name, initializer);
    },

    createArrayBindingPattern(elements: Array<BindingElement>) {
        return new BindingPattern(elements, "array");
    },

    createArrayLiteral(elements: any, multiLine: boolean) {
        return new ArrayLiteral(elements, multiLine);
    },

    createObjectLiteral(properties:PropertyAssignment[], multiLine:boolean) {
        return new ObjectLiteral(properties, multiLine);
    },

    createObjectBindingPattern(elements: BindingElement[]) {
        return new BindingPattern(elements, "object");
    },

    createPropertyAssignment(key:string, value:any) { 
        return new PropertyAssignment(key, value)
    },

    createKeywordTypeNode(kind:string) {
        if (kind === undefined) {
            throw "createKeyword"
        }
        return kind;
    },

    createArrayTypeNode(elementType:string) {
        if (elementType === undefined) {
            throw "createArrayTypeNode"
        }
        return `${elementType}[]`;
    },

    createFalse() {
        return this.SyntaxKind.FalseKeyword
    },

    createTrue() {
        return this.SyntaxKind.TrueKeyword
    },

    createNull() {
        return this.SyntaxKind.NullKeyword
    },

    createThis() {
        return this.SyntaxKind.ThisKeyword;
    },

    createBlock(statements:any[], multiLine:boolean) {
        return new Block(statements, multiLine);
    },

    createFunctionDeclaration(decorators:any[] = [], modifiers:any = [], asteriskToken:any, name:string, typeParameters:string[], parameters:Parameter[], type:string, body:Block) {
        return new Function(decorators, modifiers, asteriskToken, name, typeParameters, parameters, type, body).declaration();
    },

    createParameter(decorators: Decorator[], modifiers: string[], dotDotDotToken: any, name: string, questionToken: any, type: string, initializer: any) {
        return new Parameter(decorators, modifiers, dotDotDotToken, name, questionToken, type, initializer);
    },

    createReturn(expression:any) {
        return new ReturnStatement(expression);
    },

    createFunctionExpression(modifiers = [], asteriskToken:any, name = "", typeParameters:string[], parameters:Parameter[], type:string, body:Block) {
        return new Function([], modifiers, asteriskToken, name, typeParameters, parameters, type, body).declaration();
    },

    createToken(token:string) {
        if (token === undefined) {
            throw "createToken"
        }
        return token;
    },

    createArrowFunction(modifiers:string[]=[], typeParameters:string[], parameters:Parameter[], type:string, equalsGreaterThanToken:string, body:Block) {
        return new ArrowFunction(modifiers, typeParameters, parameters, type, equalsGreaterThanToken, body);
    },

    createModifier(modifier: string) {
        if (modifier === undefined) {
            throw "createModifier";
        }
        return modifier
    },

    createBinary(left:any, operator:string, right:any) {
        return new Binary(left, operator, right);
    },

    createParen(expression:any) {
        return new Paren(expression);
    },

    createCall(expression:any, typeArguments:string[], argumentsArray:any[] = []) {
        return new Call(expression, typeArguments, argumentsArray);
    },

    createExportAssignment(decorators:Decorator[] = [], modifiers: string[] = [], isExportEquals:any, expression:any) {
        return `export default ${expression}`;
    },

    createShorthandPropertyAssignment(name:string, expression:any) {
        return new ShorthandPropertyAssignment(name, expression)
    },

    createSpreadAssignment(expression:any) {
        return new SpreadAssignment(expression);
    },

    createTypeReferenceNode(typeName: string, typeArguments:string[]=[]) {
        return typeName;
    },

    createIf(expression:any, thenStatement:any, elseStatement:any) {
        return new If(expression, thenStatement, elseStatement);
    },

    createImportDeclaration(decorators: Decorator[], modifiers:string[]=[], importClause = "", moduleSpecifier="") {
        return `import ${importClause} ${moduleSpecifier}`;
    },

    createImportSpecifier(propertyName:string, name:string) {
        return name;
    },

    createNamedImports(node:any=[], elements:any) {
        return node.join(",");
    },

    createImportClause(name:string, namedBindings:string="") {
        return `${name?`${name},`:""}{${namedBindings}}`;
    },

    createDecorator(expression:Call) {
        return new Decorator(expression);
    },

    createProperty(decorators:Decorator[], modifiers:string[], name:string, questionOrExclamationToken:string="", type:string, initializer:any) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    },

    createClassDeclaration(decorators: Decorator[], modifiers: string[], name: string, typeParameters: string[], heritageClauses: any, members: Array<Property | Method>) {
        const componentDecorator = decorators.find(d => d.name === "Component");
        if (componentDecorator) { 
            return new ReactComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members);
        }

        return new Class(decorators, modifiers, name, typeParameters, heritageClauses, members)
    },

    createPropertyAccess(expression:any, name:string) {
        return new PropertyAccess(expression, name);
    },

    createJsxExpression(dotDotDotToken:string, expression:any) {
        return `{${expression}}`;
    },

    createJsxAttribute(name: string, initializer: any) {
        return `${(eventsDictionary as any)[name] || name}=${initializer}`;
    },

    createJsxAttributes(properties:any[]) {
        return properties.join("\n");
    },

    createJsxOpeningElement(tagName:string, typeArguments:any[], attributes:string) {
        return `<${tagName} ${attributes}>`
    },

    createJsxClosingElement(tagName:string) {
        return `</${tagName}>`;
    },

    createJsxElement(openingElement:string, children:string[], closingElement:string) {
        return `${openingElement}${children.join("\n")}${closingElement}`;
    },

    createJsxText(text:string, containsOnlyTriviaWhiteSpaces:string) {
        return text;
    },

    createFunctionTypeNode(typeParameters:any, parameters:Parameter[], type:string) { 
        return `(${parameters.map(p => p.declaration())})=>${type}`;
    },

    createExpressionStatement(expression:any) {
        return expression;
    },

    createMethod(decorators:Decorator[], modifiers:string[], asteriskToken:string, name:string, questionToken:string, typeParameters:any, parameters:Parameter[], type:string, body:Block) {
        return new Method(decorators, modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body);
    },

    createPrefix(operator:string, operand:any) {
        if (operator === undefined) {
            throw "createPrefix";
        }
        return new Prefix(operator, operand);
    },

    createNonNullExpression(expression:any) { 
        return new NonNullExpression(expression);
    }
}