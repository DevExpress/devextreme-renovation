
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
    BarBarToken: "||"
};
class Call { 
    /**
     * 
     * @param {string} expression 
     * @param {*} typeArguments 
     * @param {Array<any>} argumentsArray 
     */
    constructor(expression, typeArguments, argumentsArray = []) { 
        this.expression = expression;
        this.typeArguments = typeArguments;
        this.argumentsArray = argumentsArray;
    }

    get arguments() { 
        return this.argumentsArray.map(a => { 
            if (a instanceof Obj) { 
                return a.value;
            }
            return a;
        })
    }

    toString() { 
        return `${this.expression}(${this.argumentsArray.join(",")})`;
    }
}

class Decorator{ 
    /**
     * 
     * @param {Call} expression 
     */
    constructor(expression){ 
        this.expression = expression;
    }

    get name() { 
        return this.expression.expression;
    }

    toString(){ 
        // return `@${this.expression.toString()}`;
    }
}

function capitalizeFirstLetter(string) { 
    return string.charAt(0).toUpperCase() + string.slice(1)
}

class Property { 
    /**
     * 
     * @param {Array<Decorator>} decorators 
     * @param {*} modifiers 
     * @param {string} name 
     * @param {*} questionOrExclamationToken 
     * @param {*} type 
     * @param {*} initializer 
     */
    constructor(decorators, modifiers, name, questionOrExclamationToken, type, initializer) { 
        this.decorators = decorators;
        this.modifiers = modifiers;
        this.name = name;
        this.questionOrExclamationToken = questionOrExclamationToken;
        this.type = type;
        this.initializer = initializer;
    }

    get isInternalState() { 
        return this.decorators.find(d => d.name === "InternalState");
    }

    get isProp() { 
        return this.decorators.find(d => d.name === "Prop");
    }

    get isState() { 
        return this.decorators.find(d => d.name === "State");
    }

    declaration() { 
        if (this.isProp) { 
            return this.name;
        }
        if (this.isState) {
            return `${this.name},
                    default${capitalizeFirstLetter(this.name)},
                    ${this.name}Change=()=>{}`
        }
    }

    toString() { 
        return this.name;
    }
}

class PropertyAccess {
    constructor(expression, name) {
        this.expression = expression;
        this.name = name;
    }

    /**
     * 
     * @param {Array<Property>} internalState 
     * @param {Array<Property>} state
     */
    toString(internalState=[], state=[]) {
        if (this.expression === SyntaxKind.ThisKeyword &&
            internalState.findIndex(p => p.name === this.name) >= 0) {
            return `${this.name}`;
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

    compileStateChangeRising(state, rightExpressionString) { 
        return state.find(s => s.name === this.name) ? `${this.name}Change(${rightExpressionString})` : "";
    }
}

class Parameter { 
    /**
     * 
     * @param {Array<Decorator>} decorators 
     * @param {*} modifiers 
     * @param {*} dotDotDotToken 
     * @param {string} name 
     * @param {*} questionToken 
     * @param {*} type 
     * @param {*} initializer 
     */
    constructor(decorators, modifiers, dotDotDotToken, name, questionToken, type, initializer) { 
        this.decorators = decorators;
        this.modifiers = modifiers;
        this.dotDotDotToken = dotDotDotToken;
        this.name = name;
        this.questionToken = questionToken;
        this.type = type;
        this.initializer = initializer;
    }

    declaration() { 
        if (this.initializer) { 
            return `${this.name}=${this.initializer}`; 
        }
        return this.name;
    }

    toString() { 
        return this.name;
    }
}

class Method { 
    /**
     * 
     * @param {Array<Decorator>} decorators 
     * @param {Array<string>} modifiers 
     * @param {*} asteriskToken 
     * @param {string} name 
     * @param {*} questionToken 
     * @param {Array} typeParameters 
     * @param {Array<Parameter>} parameters 
     * @param {*} type 
     * @param {*} body 
     */
    constructor(decorators = [], modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body) { 
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

    get isEvent() { 
        return this.decorators.find(d => d.name === "Listen");
    }

    get isSubscription() { 
        const eventDecorator = this.isEvent;
        if (!eventDecorator || eventDecorator.expression.argumentsArray.length < 2) {
            return;
        }
        return eventDecorator;
    }

    declaration(prefix = "", internalState, state) { 
        return `${prefix} ${this.name}(${this.parameters.map(p=>p.declaration()).join(",")})${this.body.toString(internalState, state)}`;
    }

    arrowDeclaration(internalState, state) { 
        return `(${this.parameters.map(p=>p.declaration()).join(",")})=>${this.body.toString(internalState, state)}`
    }

    toString() { 
        return this.name;
    }
}

class Function { 
    constructor(decorators = [], modifiers=[], asteriskToken, name, typeParameters, parameters, type, body) { 
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
        return `${this.modifiers.join(" ")} function ${this.name}(${this.parameters.map(p=>p.declaration()).join(",")})${this.body}`;
    }

    toString() { 

    }
}

class ArrowFunction { 
    constructor(modifiers = [], typeParameters = [], parameters = [], type, equalsGreaterThanToken, body) { 
        this.modifiers = modifiers;
        this.typeParameters = typeParameters;
        this.parameters = parameters, 
        this.type = type;
        this.body = body;
        this.equalsGreaterThanToken = equalsGreaterThanToken;
    }

    toString() { 
        return `${this.modifiers.join(" ")} (${this.parameters.join(",")}) ${this.equalsGreaterThanToken} ${this.body}`;
    }
}

class StringLiteral{ 
    constructor(value) { 
        this.value = value;
    }
    toString() { 
        return `"${this.value}"`;
    }
}

class Obj { 
    constructor(value) {
        this.value = value;
    }
    
    toString() { 
        return `{${Object.keys(this.value).map(k => `${k}:${this.value[k]}`)}}`;
    }
}

class ShorthandPropertyAssignment { 
    constructor(name, expression) { 
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

class PropertyAssignment { 
    constructor(key, value) { 
        this.key = key;
        this.value = value;
    }
    toString() { 
        return `${this.key}:${this.value}`
    }
}

class ObjectLiteral {
    /**
     * 
     * @param {Array<PropertyAssignment|ShorthandPropertyAssignment} properties 
     * @param {boolean} multiLine 
     */
    constructor(properties, multiLine) {
        this.properties = properties;
        this.multiLine = multiLine;
    }

    getProperty(propertyName) { 
        const property = this.properties.find(p => p.key === propertyName);
        if (property) { 
            return property.value;
        }
    }

    toString() { 
        return `{${this.properties.join(`,\n`)}}`;
    }
}

class BindingElement { 
    constructor(dotDotDotToken, propertyName, name, initializer) { 
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
    /**
     * 
     * @param {Array<BindingElement>} elements 
     * @param {'object'|'array'} type
     */
    constructor(elements, type) { 
        this.elements = elements;
        this.type = type;
    }

    toString() { 
        const elements = this.elements.join(",");
        return this.type === "array" ? `[${elements}]` : `{${elements}}`;
    }
}

class Block { 
    constructor(statements=[], multiLine) { 
        this.statements = statements;
        this.multiLine = multiLine;
    }

    toString(internalState, state) { 
        return `{
            ${this.statements.map(s=>s.toString(internalState, state)).join(";\n")}
        }`
    }
}

class Paren { 
    constructor(expression) { 
        this.expression = expression;
    }

    toString() { 
        return `(${this.expression})`;
    }
}

class SpreadAssignment { 
    constructor(expression) { 
        this.expression = expression;
    }

    toString() { 
        return `...${this.expression}`;
    }
}

function stateSetter(stateName) { 
    return `_set${capitalizeFirstLetter(stateName)}`
}

function stateGetter(stateName, addParen = true) { 
    const expr = `${stateName}!==undefined?${stateName}:_${stateName}`;
    return addParen ? `(${expr})` : expr;
}

class Class { 
    /**
     * 
     * @param {Array<Decorator>} decorators 
     * @param {*} modifiers 
     * @param {string} name 
     * @param {*} typeParameters 
     * @param {*} heritageClauses 
     * @param {Array<Property|Method>} members 
     */
    constructor(decorators = [], modifiers = [], name, typeParameters, heritageClauses, members) {
        this.decorators = decorators;
        this.name = name;
        this.members = members;
        this.modifiers = modifiers;
    }

    compileConstructor() { 
        let result = "";
        const initState = this.members.filter(m => m.isInternalState).reduce((state, m) => { 
            state[m.name] = m.initializer
            return state;
        }, {});

        let state = "";

        if (Object.keys(initState).length) { 
            state = `this.state=${new Obj(initState)};`
        }

        const listeners = this.members.filter(m => m.isEvent);

        let initializers = ""
        if (listeners.length) { 
            initializers = listeners.map(l => `this.${l}=this.${l}.bind(this);`).join("\n");
        }

        if (state||initializers) { 
            result = `constructor(props){
                super(props);
                ${state}
                ${initializers}
            }`
        }

        return result;
    }

    compileDidMount() { 
        /**
         * @type {Method[]}
         */
        const listeners = this.members.filter(m => m.isSubscription);
        const subscription = listeners.map((l) => {
            const [event, { target }] = l.isSubscription.expression.arguments;
            return `${target}.addEventListener(${event}, this.${l.name});`;
        })

        let result = "";

        if (subscription.length) { 
            result = `componentDidMount(){
                ${subscription.join("\n")}
            }`
        }

        return result;
    }

    get isComponent() { 
        return this.decorators.find(d => d.name === "Component");
    }

    getImports() {
        const imports = [];
        const react = [];

        if(this.members.filter(m => m.isState || m.isInternalState).length){ 
            react.push("useState");
        }

        if (this.members.filter(m => m.isEvent).length) { 
            react.push("useCallback");
        }

        if (this.members.filter(m => m.isSubscription).length) { 
            react.push("useEffect");
        }

        if (react.length) { 
            imports.push(`import {${react.join(",")}} from 'react';`);
        }

        return imports.join("\n");
    }

    compileUseEffect() {
        const subscriptions = this.members.filter(m => m.isSubscription);
        if (subscriptions.length) {
            const { add, cleanup } = subscriptions.reduce(({ add, cleanup }, s) => {
                const subscriptionDecorator = s.isSubscription;
                const [event, parameters] = subscriptionDecorator.expression.arguments;
                let target;
                if (parameters) { 
                    target = parameters.getProperty("target");
                }
                if (target) { 
                    add.push(`${target}.addEventListener(${event}, ${s.name});`);
                    cleanup.push(`${target}.removeEventListener(${event}, ${s.name});`);
                }
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

    functionalComponentString() {
        
        const props = this.members.filter(m => m.isProp);
        const internalState = this.members.filter(m => m.isInternalState);
        const state = this.members.filter(m => m.isState);

        const methods = this.members.filter(m => m instanceof Method && m.decorators.length === 0);

        const useStateDeclaration = internalState
            .map(m => {
                return `const [${m.name}, ${stateSetter(m.name)}] = useState(${m.initializer});`;
            }).concat(state.map(s => {
                const internalName = `_${s.name}`;
                return `const [${internalName}, ${stateSetter(s.name)}] = useState(()=>(${s.name} !== undefined) ? ${s.name} : default${capitalizeFirstLetter(s.name)});`;
            })).join("\n");

        
        const propsDeclaration = props.map(p => p.declaration());
        const stateDeclaration = state.map(s => s.declaration());

        const events = this.members.filter(m => m.isEvent);
        const eventsDeclaration = events.map(m => {
            return `const ${m.name} = useCallback(${m.arrowDeclaration(internalState, state)}, []);`;
        });

        const parameters = this.isComponent.expression.arguments[0].properties
            .reduce((parameters, property) => {
                parameters[property.key] = property.value;
                return parameters;
            }, {});

        return `
            ${this.getImports()}

            ${this.modifiers.join(" ")} function ${this.name}({
                ${propsDeclaration.concat(stateDeclaration).join(",\n")}
            }){
                ${useStateDeclaration}
                ${methods.map(m => m.declaration("function", internalState, state)).join("\n")}
                ${eventsDeclaration.join("\n")}
                ${this.compileUseEffect()}
                return ${parameters.view}(${parameters.viewModel}({
                    ${propsDeclaration
                        .concat(internalState.map(m => m.name))
                        .concat(state.map(s => `${s.name}:${stateGetter(s.name, false)}`))
                    .concat(events.map(e => e.name))
            
                    }
                }));
            }
        `
    }

    toString() {
        if (this.isComponent) { 
            return this.functionalComponentString();
        }

        const properties = this.members.map(m => m.declaration()).join("\n");
        
        return `
        ${this.modifiers} class ${this.name} {
            ${this.compileConstructor()}
            ${properties}
            ${this.compileDidMount()}
        }`;
    }
}

class ReturnStatement { 
    /**
     * 
     * @param {Statement} expression 
     */
    constructor(expression) { 
        this.expression = expression;
    }

    toString(internalState, state) { 
        return `return ${this.expression.toString(internalState, state)};`;
    }
}

class If { 
    constructor(expression, thenStatement, elseStatement="") { 
        this.expression = expression;
        this.thenStatement = thenStatement;
        this.elseStatement = elseStatement;
    }

    toString() { 
        const elseStatement = this.elseStatement ? `else ${this.elseStatement}`: "";
        return `if(${this.expression})${this.thenStatement}
        ${elseStatement}`;
    }
}

class ArrayLiteral { 
    constructor(elements, multiLine) { 
        this.elements = elements;
        this.multiLine = multiLine;
    }

    toString() { 
        return `[${this.elements.join(",")}]`;
    }
}

class Prefix { 
    constructor(operator, operand) { 
        this.operator = operator;
        this.operand = operand;
    }

    toString(internalState, state) { 
        return `${this.operator}${this.operand.toString(internalState, state)}`
    }
}

class Binary{ 
    constructor(left, operator, right){ 
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    toString(internalState, state) {
        if (this.operator === SyntaxKind.EqualsToken &&
            this.left instanceof PropertyAccess &&
            this.left.expression === SyntaxKind.ThisKeyword) { 
            const rightExpression = this.right.toString(internalState, state);
            
            return `${this.left.compileStateSetting()}(${rightExpression});
            ${this.left.compileStateChangeRising(state, rightExpression)}`;
        }
        return `${this.left}${this.operator}${this.right}`;
    }
}

module.exports = {
    SyntaxKind,

    NodeFlags: {
        Const: "const",
        Let: "let",
        None: "var"
    },

    createIdentifier(name) { 
        return name;
    },
    createStringLiteral(value) { 
        return new StringLiteral(value);
    },
    createPropertyAssignment(key, value) { 
        return new PropertyAssignment(key, value)
    },
    createArrayLiteral(elements, multiLine) { 
        return new ArrayLiteral(elements, multiLine);
    },
    /**
     * 
     * @param {Array<PropertyAssignment|ShorthandPropertyAssignment>} properties 
     * @param {boolean} multiLine 
     */
    createObjectLiteral(properties, multiLine) { 
        return new ObjectLiteral(properties, multiLine);
    },
    createCall(expression, typeArguments, argumentsArray) { 
        return new Call(expression, typeArguments, argumentsArray);
    },
    createDecorator(expression) {
        return new Decorator(expression);
    },
    createModifier(modifier) { 
        if (modifier === undefined) { 
            throw "createModifier";
        }
        return modifier
    },
    createProperty(decorators, modifiers, name, questionOrExclamationToken, type, initializer) { 
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    },

    createClassDeclaration(decorators, modifiers, name, typeParameters, heritageClauses, members) { 
        return new Class(decorators, modifiers, name, typeParameters, heritageClauses, members)
    },
    createTypeReferenceNode() { 

    },

    createParameter(decorators, modifiers, dotDotDotToken, name, questionToken, type, initializer) { 
        return new Parameter(decorators, modifiers, dotDotDotToken, name, questionToken, type, initializer);
    },

    createBlock(statements, multiLine) { 
        return new Block(statements, multiLine);
    },

    createMethod(decorators, modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body) { 
        return new Method(decorators, modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body);
    },
    createKeywordTypeNode(kind) { 
        if (kind === undefined) { 
            throw "createKeyword"
        }
        return kind;
    },
    createArrayTypeNode(elementType) { 
        // `${elementType}[]`;
        return "";
    },
    createNumericLiteral(value, numericLiteralFlags) { 
        return value;
    },
    createTrue() {
        return this.SyntaxKind.TrueKeyword;
    },
    createNull() { 
        return this.SyntaxKind.NullKeyword;
    },
    createThis() { 
        return this.SyntaxKind.ThisKeyword;
    },

    createToken(token) { 
        if (token === undefined) { 
            throw "createToken"
        }
        return token;
    },

    createBinary(left, operator, right) { 
        return new Binary(left, operator, right);
    },

    createReturn(expression){ 
        return new ReturnStatement(expression);
    },
    
    createFalse() {
        return this.SyntaxKind.FalseKeyword
    },

    createFunctionDeclaration(decorators, modifiers, asteriskToken, name, typeParameters, parameters, type, body) { 
        return new Function(decorators, modifiers, asteriskToken, name, typeParameters, parameters, type, body).declaration();
    },

    createFunctionTypeNode(typeParameters, parameters, type) { 
        return ""
    },
    createVariableDeclaration(name, type, initializer="") { 
        return `${name}=${initializer}`;
    },

    createFunctionExpression(modifiers = [], asteriskToken, name = "", typeParameters, parameters = [], type, body) {
        return `${modifiers.join(" ")} function ${name}(${parameters.join(",")})${body}`;
    },

    createVariableDeclarationList(declarations = [], flags) { 
        if (flags === undefined) { 
            throw "createVariableDeclarationList";
        }
        return `${flags} ${declarations.join("")}`;
    },

    createArrowFunction(modifiers = [], typeParameters = [], parameters = [], type, equalsGreaterThanToken, body) {
        return new ArrowFunction(modifiers, typeParameters, parameters, type, equalsGreaterThanToken, body);
    },

    createVariableStatement(modifiers = [], declarationList) {
        return `${modifiers} ${declarationList}`;
    },

    createParen(expression) { 
        return new Paren(expression);
    },

    createExportAssignment(decorators=[], modifiers=[], isExportEquals, expression) { 
        return `export default ${expression}`;
    },

    createPropertyAccess(expression, name) { 
        return new PropertyAccess(expression, name);
    },

    createPrefix(operator, operand) { 
        if (operator === undefined) { 
            throw "createPrefix";
        }
        return new Prefix(operator, operand);
    },

    createExpressionStatement(expression) { 
        return expression
    },

    createShorthandPropertyAssignment(name, expression) { 
        return new ShorthandPropertyAssignment(name, expression)
    },
    
    createBindingElement(dotDotDotToken, propertyName, name, initializer) {
        return new BindingElement(dotDotDotToken, propertyName, name, initializer);
    },

    createObjectBindingPattern(elements) { 
        return new BindingPattern(elements, "object");
    },

    createArrayBindingPattern(elements) { 
        return new BindingPattern(elements, "array");
    },

    createJsxExpression(dotDotDotToken, expression) { 
        return `{${expression}}`;
    },

    createJsxAttribute(name, initializer) { 
        return `${name}=${initializer}`;
    },

    createJsxAttributes(properties) { 
        return properties.join("\n");
    },

    createJsxOpeningElement(tagName, typeArguments, attributes) { 
        return `<${tagName} ${attributes}>`
    },

    createJsxClosingElement(tagName) { 
        return `</${tagName}>`;
    },

    createJsxElement(openingElement, children=[], closingElement) { 
        return `${openingElement}${children.join("\n")}${closingElement}`;
    },

    createJsxText(text, containsOnlyTriviaWhiteSpaces) { 
        return text;
    },

    createImportSpecifier(propertyName, name) { 
        return name;
    },

    createNamedImports(node, elements) { 
        return node.join(",");
    },

    createImportClause(name, namedBindings) { 
        return `{${namedBindings}}`;
    },

    createImportDeclaration(decorators, modifiers, importClause="", moduleSpecifier) { 
        return `import ${importClause} ${moduleSpecifier}`;
    },

    createIf(expression, thenStatement, elseStatement) { 
        return new If(expression, thenStatement, elseStatement);
    },

    createEmptyStatement() { 
        return "";
    },

    createSpreadAssignment(expression) {
        return new SpreadAssignment(expression);
    }
}