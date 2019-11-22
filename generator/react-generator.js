
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
            return `get ${this.name}(){return this.prop.${this.name};}`
        }
        if (this.isInternalState) { 
            return `get ${this.name}(){return this.state.${this.name}}
                set ${this.name}(${this.name}) { this.state({${this.name}}); }`;
        }
        if (this.isState) { 
            return `get ${this.name}(){ return "${this.name}" in this.props ? this.props.${this.name} : this.state.${this.name}; }
                set ${this.name}(${this.name}) {
                     this.state({${this.name}});
                     this.${this.name}Change(${this.name});
                }
                get ${this.name}Change() { return this.props.${this.name}Change || (()=>{}); }`;
        }
    }

    toString() { 
        return this.name;
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
        if (!eventDecorator || eventDecorator.expression.argumentsArray.length === 0) {
            return;
        }
        return eventDecorator;
    }

    declaration() { 
        return `${this.name}(${this.parameters.map(p=>p.declaration()).join(",")})${this.body}`;
    }

    toString() { 
        return this.name;
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
        return `{${Object.keys(this.value).map(k => `${k}: ${this.value[k]}`)}}`;
    }
}

class Block { 
    constructor(statements=[], multiLine) { 
        this.statements = statements;
        this.multiLine = multiLine;
    }

    toString() { 
        return `{
            ${this.statements.join(";\n")}
        }`
    }
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

    toString() {
        //${ this.decorators.map(d => d.toString()).join() }
        const properties = this.members.map(m => m.declaration()).join("\n");
        
        return `
        ${this.modifiers} class ${this.name} {
            ${this.compileConstructor()}
            ${properties}
            ${this.compileDidMount()}
        }`;
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

module.exports = {
    SyntaxKind: {
        ExportKeyword: "export",
        FalseKeyword: false,
        TrueKeyword: true,
        PlusToken: "+",
        NumberKeyword: "number"
    },

    createIdentifier(name) { 
        return name;
    },
    createStringLiteral(value) { 
        return new StringLiteral(value);
    },
    createPropertyAssignment(key, value) { 
        return { key, value };
    },
    createArrayLiteral(elements, multiLine) { 
        return new ArrayLiteral(elements, multiLine);
    },
    /**
     * 
     * @param {Array} properties 
     * @param {bolean} multiLine 
     */
    createObjectLiteral(properties, multiLine) { 
        return new Obj(properties.reduce((obj, { key, value }) => {
            obj[key] = value;
            return obj;
         }, {}));
    },
    createCall(expression, typeArguments, argumentsArray) { 
        return new Call(expression, typeArguments, argumentsArray);
    },
    createDecorator(expression) {
        return new Decorator(expression);
    },
    createModifier(modifier) { 
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
    },
    createNumericLiteral(value, numericLiteralFlags) { 
        return value;
    },
    createTrue() {
        return this.SyntaxKind.TrueKeyword
    },

    createToken(token) { 
        if (token === undefined) { 
            throw "createToken"
        }
        return token
    },

    createBinary(left, operator, right) { 
        return `${left}${operator}${right}`;
    },

    createReturn(expression){ 
        return `return ${expression}`;
    },
    
    createFalse() {
        return this.SyntaxKind.FalseKeyword
    }
}