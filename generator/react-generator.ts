import SyntaxKind from "./syntaxKind";
import fs from "fs";
import path from "path";
import { compileCode } from "./component-compiler";

const eventsDictionary = {
    pointerover: "onPointerOver",
    pointerout: "onPointerOut",
    pointerdown: "onPointerDown",
    click: "onClick"
}

function compileType(type: string = "", questionToken: string = "") {
    return type ? `${questionToken}:${type}` : "";
}

function variableDeclaration(name: Identifier|BindingPattern, type: string = "", initializer?: Expression, questionToken: string = "") {
    const initilizerDeclaration = initializer ? `=${initializer}` : "";
    return `${name}${compileType(type, questionToken)}${initilizerDeclaration}`;
}

function getRelativePath(src:string, dst:string, moduleName: string="") { 
    const relativePath = `${path.relative(src, dst)}${moduleName ? `/${moduleName}` : ""}`.replace(/\\/gi, "/");
    if (relativePath.startsWith("/")) { 
        return `.${relativePath}`;
    }
    if (!relativePath.startsWith(".")) { 
        return `./${relativePath}`;
    }
    return relativePath;
}

function getModuleRelativePath(src: string, moduleSpecifier: string) { 
    const normalizedPath = path.normalize(moduleSpecifier);
    const moduleParts = normalizedPath.split(/(\/|\\)/);

    const folderPath = path.resolve(moduleParts.slice(0, moduleParts.length - 2).join("/"));

    return getRelativePath(src, folderPath, moduleParts[moduleParts.length - 1]);
}

function getLocalStateName(name: Identifier | string) {
    return `__state_${name}`;
}

function getPropName(name: Identifier | string) {
    return `props.${name}`;
}

function getProps(members: Array<Property | Method>): Property[] {
    return members.filter(m => m.decorators.find(d => d.name === "OneWay" || d.name === "Event" || d.name === "Template" || d.name === "Slot")) as Property[];
}

export interface toStringOptions {
    members: Array<Property | Method>;
    disableTemplates?: boolean;
    internalState: InternalState[];
    state: State[];
    props: Prop[];
    componentContext?: string;
    newComponentContext?: string;
    variables?: VariableExpression;
}

export interface VariableExpression { 
    [name: string]: Expression;
}

export class Expression {
    getDependency(): string[] {
        return [];
    }

    toString(options?: toStringOptions) {
        return "";
    }

    getAllDependency() {
        return this.getDependency();
    }

    isJsx() { 
        return false;
    }
}

export class SimpleExpression extends Expression {
    expression: string;
    constructor(expression: string) {
        super();
        this.expression = expression;
    }

    toString() {
        return this.expression;
    }
}

export class StringLiteral extends SimpleExpression {
    quoteSymbol: string;
    constructor(value: string, quoteSymbol = '"') {
        super(value);
        this.quoteSymbol = quoteSymbol;
    }
    toString() {
        return `${this.quoteSymbol}${this.expression}${this.quoteSymbol}`;
    }
    valueOf() { 
        return this.expression;
    }
}

export class Identifier extends SimpleExpression {
    constructor(name: string) {
        super(name);
    }

    valueOf() {
        return this.expression;
    }

    toString(options?: toStringOptions) { 
        const baseValue = super.toString();
        if (options?.variables && options.variables[baseValue]) {
            return options.variables[baseValue].toString(options);    
        }
        return baseValue;
    }
}


export class ExpressionWithExpression extends Expression {
    expression: Expression;

    constructor(expression: Expression) {
        super();
        this.expression = expression;
    }

    toString(options?: toStringOptions) {
        return this.expression.toString(options);
    }

    getDependency() {
        return this.expression.getDependency();
    }

    isJsx() { 
        return this.expression.isJsx();
    }
}

export class TypeOf extends ExpressionWithExpression {
    toString(options?: toStringOptions) {
        return `typeof ${this.expression.toString(options)}`;
    }
}

export class Void extends ExpressionWithExpression {
    toString(options?: toStringOptions) {
        return `void ${this.expression.toString(options)}`;
    }
}

export class ExpressionWithOptionalExpression extends Expression {
    expression?: Expression;

    constructor(expression?: Expression) {
        super();
        this.expression = expression;
    }

    toString(options?: toStringOptions) {
        return this.expression ? this.expression.toString(options) : "";
    }

    getDependency() {
        return this.expression && this.expression.getDependency() || [];
    }
}

export class BindingElement extends Expression {
    dotDotDotToken?: string;
    propertyName?: Identifier;
    name: string | Identifier | BindingPattern;
    initializer?: Expression;
    constructor(dotDotDotToken: string = "", propertyName: Identifier | undefined, name: string | Identifier | BindingPattern, initializer?: Expression) {
        super();
        this.dotDotDotToken = dotDotDotToken;
        this.propertyName = propertyName;
        this.name = name;
        this.initializer = initializer;
    }

    toString() {
        const key = this.propertyName ? `${this.propertyName}:` : "";
        return `${key}${this.dotDotDotToken}${this.name}`;
    }

    getDependency() {
        if (!this.propertyName) { 
            return [this.name.toString()];
        }
        return [this.propertyName.toString()];
    }
}

export class Delete extends ExpressionWithExpression {
    toString(options?: toStringOptions) {
        return `${SyntaxKind.DeleteKeyword} ${super.toString()}`;
    }
}

export class BindingPattern extends Expression {

    elements: Array<BindingElement>
    type: 'array' | 'object'

    constructor(elements: Array<BindingElement>, type: 'object' | 'array') {
        super();
        this.elements = elements;
        this.type = type;
    }

    toString() {
        if (this.elements.length === 0) { 
            return "";
        }
        return this.type === "array" ? `[${this.elements}]` : `{${this.elements.sort((a, b) => {
            if (a.dotDotDotToken) { 
                return 1;
            }
            if (b.dotDotDotToken) { 
                return -1;
            }
            const aValue = a.propertyName?.toString() || a.name.toString();
            const bValue = b.propertyName?.toString() || b.name.toString();
    
            if (aValue < bValue) {
                return -1;
            }
            return 1;
        })}}`;
    }

    remove(name: string) {
        this.elements = this.elements.filter(e => e.name?.toString() !== name);
    }

    add(element: BindingElement) { 
        this.elements.push(element);
    }

    getDependency() { 
        return this.elements.reduce((d: string[], e) => d.concat(e.getDependency()), []);
    }

    hasRest() { 
        return this.elements.find(e => e.dotDotDotToken);
    }

    getVariableExpressions(startExpression: Expression): VariableExpression { 
        return this.elements.reduce((v: VariableExpression, e, index) => {
            if (e.name) {
                let expression: Expression | null = null;

                if (this.type !== "object") {
                    expression = new ElementAccess(startExpression, new SimpleExpression(index.toString()));
                } else if (e.name instanceof Identifier) {
                    expression = new PropertyAccess(startExpression, e.name);
                } else if (typeof e.name === "string") {
                    const name = e.name;
                    expression = new PropertyAccess(startExpression, new Identifier(name));
                } else if (e.name instanceof BindingPattern && e.propertyName) { 
                    return {
                        ...e.name.getVariableExpressions(
                            new PropertyAccess(startExpression, e.propertyName)
                        ),
                        ...v
                    };
                }   
                if (expression) {
                    return {
                        [e.name.toString()]: expression,
                        ...v,
                    };
                }
            }
            /* istanbul ignore next */
            return v;
        }, {})
    }
}

export class ArrayLiteral extends Expression {
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

export class PropertyAssignment extends Expression {
    key: Identifier;
    value: Expression;
    constructor(key: Identifier, value: Expression) {
        super();
        this.key = key;
        this.value = value;
    }
    toString(options?: toStringOptions) {
        return `${this.key}:${this.value.toString(options)}`;
    }

    getDependency() {
        return this.value.getDependency();
    }

}

export class ShorthandPropertyAssignment extends ExpressionWithOptionalExpression {
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

    toString(options?: toStringOptions) {
        let expression = this.expression ? `:${this.expression.toString(options)}` : "";
        if (!expression && options?.variables?.[this.name.toString()]) { 
            expression = `:${options.variables[this.name.toString()].toString(options)}`;
        }

        return `${this.name}${expression}`;
    }

}

export class SpreadAssignment extends ExpressionWithExpression {
    key: null = null;
    value: null = null;

    toString(options?: toStringOptions) {
        return `...${this.expression.toString(options)}`;
    }
}

export class ObjectLiteral extends Expression {
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
            return property.value;
        }
    }

    setProperty(propertyName: string, value: Expression) { 
        this.properties.push(
            new PropertyAssignment(
                new Identifier(propertyName),
                value
            )
        )
    }

    removeProperty(propertyName: string) { 
        this.properties = this.properties.filter(p => p.key?.toString() !== propertyName);
    }

    toString(options?:any) {
        return `{${this.properties.map(p => p.toString(options)).join(`,\n`)}}`;
    }

    getDependency() {
        return this.properties.reduce((d: string[], p) => d.concat(p.getDependency()), []);
    }
}

export class Block extends Expression {
    statements: Expression[];
    multiLine: boolean;
    constructor(statements: Expression[], multiLine: boolean) {
        super();
        this.statements = statements;
        this.multiLine = multiLine;
    }

    toString(options?: toStringOptions) {
        return `{
            ${this.statements.map(s => s.toString(options)).join("\n")}
        }`
    }

    getDependency() {
        return this.statements.reduce((d: string[], s) => {
            return d.concat(s.getDependency());
        }, []);
    }

    isJsx() { 
        return this.statements.some(s => s.isJsx());
    }
}

export class PropertyAccessChain extends ExpressionWithExpression {
    questionDotToken: string;
    name: Expression;
    constructor(expression: Expression, questionDotToken: string = SyntaxKind.DotToken, name: Expression) {
        super(expression);
        this.questionDotToken = questionDotToken;
        this.name = name;
    }

    toString(options?: toStringOptions) {
        const replaceMark = this.questionDotToken === SyntaxKind.QuestionDotToken;
        const firstPart = this.expression.toString(options);

        return `${replaceMark ? firstPart.replace(/[\?!]$/, '') : firstPart}${this.questionDotToken}${this.name.toString(options)}`;
    }

    getDependency() {
        return super.getDependency().concat(this.name.getDependency());
    }
}

export class Parameter {
    decorators: Decorator[]
    modifiers: string[];
    dotDotDotToken: any;
    name: Identifier | BindingPattern;
    questionToken: string;
    type?: TypeExpression;
    initializer?: Expression;
    constructor(decorators: Decorator[], modifiers: string[], dotDotDotToken: any, name: Identifier|BindingPattern, questionToken: string = "", type?: TypeExpression, initializer?: Expression) {
        this.decorators = decorators;
        this.modifiers = modifiers;
        this.dotDotDotToken = dotDotDotToken;
        this.name = name;
        this.questionToken = questionToken;
        this.type = type;
        this.initializer = initializer;
    }

    typeDeclaration() {
        return variableDeclaration(this.name, this.type?.toString() || "any", undefined, this.questionToken);
    }

    declaration() {
        return variableDeclaration(this.name, this.type?.toString(), this.initializer, this.questionToken);
    }

    toString() {
        return this.name.toString();
    }
}

export class Paren extends ExpressionWithExpression {
    toString(options?: toStringOptions) {
        return `(${super.toString(options)})`;
    }
}

export class Call extends ExpressionWithExpression {
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

    toString(options?: toStringOptions) {
        return `${this.expression.toString(options)}(${this.argumentsArray.map(a => a.toString(options)).join(",")})`;
    }

    getDependency() {
        const argumentsDependency = this.argumentsArray.reduce((d: string[], a) => {
            return d.concat(a.getDependency());
        }, []);
        return super.getDependency().concat(argumentsDependency);
    }
}

export class New extends Call {
    toString(options?: toStringOptions) {
        return `${SyntaxKind.NewKeyword} ${super.toString(options)}`;
    }
}

export class CallChain extends Call {
    questionDotToken: string;
    constructor(expression: Expression, questionDotToken: string = "", typeArguments: string[] = [], argumentsArray: Expression[] = []) {
        super(expression, typeArguments, argumentsArray);
        this.questionDotToken = questionDotToken;
    }

    toString(options?: toStringOptions) {
        return `${this.expression.toString(options)}${this.questionDotToken}(${this.argumentsArray.map(a => a.toString(options)).join(",")})`;
    }
}

export class BaseFunction extends Expression { 
    modifiers: string[];
    typeParameters: string[];
    parameters: Parameter[];
    type: string;
    body: Block | Expression;
    context: GeneratorContex;

    constructor(modifiers: string[] = [], typeParameters: string[] = [], parameters: Parameter[], type: string, body: Block | Expression, context: GeneratorContex) { 
        super();
        this.modifiers = modifiers;
        this.typeParameters = typeParameters;
        this.parameters = parameters;
        this.type = type;
        this.body = body;
        this.context = context;
    }

    getDependency() { 
        return this.body.getDependency();
    }

    getToStringOptions(options?: toStringOptions) { 
        const widget = this.parameters[0] && this.context.components?.[this.parameters[0].type?.toString() || ""];
        if (widget && widget instanceof ReactComponent) { 
            options = {
                members: widget.members.filter(m => m.decorators.find(d => d.name === "Template" || d.name === "Slot")),
                internalState: [],
                state: [],
                props: [],
                componentContext: this.parameters[0].name.toString(),
                newComponentContext: this.parameters[0].name.toString()
            };
        }
        return options;
    }
}

export class Function extends BaseFunction {
    decorators: Decorator[];
    asteriskToken: string;
    name?: Identifier;
    body: Block;
    constructor(decorators: Decorator[] = [], modifiers: string[] = [], asteriskToken: string, name: Identifier | undefined, typeParameters: string[] = [], parameters: Parameter[], type: string, body: Block, context: GeneratorContex) {
        super(modifiers, typeParameters, parameters, type, body, context);
        this.decorators = decorators;
        this.asteriskToken = asteriskToken;
        this.name = name;
        this.body = body;
    }

    toString(options?: toStringOptions) {
        options = this.getToStringOptions(options);
        return `${this.modifiers.join(" ")} function ${this.name || ""}(${
            this.parameters.map(p => p.declaration()).join(",")
            })${compileType(this.type)}${this.body.toString(options)}`;
    }
}

export class ArrowFunction extends BaseFunction {
    modifiers: any[];
    typeParameters: string[];
    parameters: Parameter[];
    type: string;
    body: Block | Expression;
    equalsGreaterThanToken: string;
    constructor(modifiers: string[] = [], typeParameters: string[], parameters: Parameter[], type: string, equalsGreaterThanToken: string, body: Block | Expression, context: GeneratorContex) {
        super(modifiers, typeParameters, parameters, type, body, context);
        this.modifiers = modifiers;
        this.typeParameters = typeParameters;
        this.parameters = parameters;
        this.type = type;
        this.body = body;
        this.equalsGreaterThanToken = equalsGreaterThanToken;
    }

    toString(options?: toStringOptions) {
        const bodyString = this.body.toString(this.getToStringOptions(options));
        return `${this.modifiers.join(" ")} (${this.parameters.map(p => p.declaration()).join(",")})${compileType(this.type)} ${this.equalsGreaterThanToken} ${bodyString}`;
    }
}

function checkDependency(expression: Expression, properties: Array<InternalState | State | Prop | Property | Method> = []) {
    const dependency = expression.getAllDependency().reduce((r: { [name: string]: boolean }, d) => {
        r[d] = true;
        return r;
    }, {});

    return properties.some(s => dependency[s.name.toString()]);
}

export class ReturnStatement extends ExpressionWithExpression {
    toString(options?: toStringOptions) {
        return `return ${super.toString(options)};`;
    }
}

export class Binary extends Expression {
    left: Expression;
    operator: string;
    right: Expression;
    constructor(left: Expression, operator: string, right: Expression) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    toString(options?: toStringOptions) {
        if (options &&
            this.operator === SyntaxKind.EqualsToken &&
            this.left instanceof PropertyAccess &&
            this.left.expression.toString().startsWith(SyntaxKind.ThisKeyword) &&
            checkDependency(this.left, options.members)) {
            const rightExpression = this.right.toString(options);

            if (checkDependency(this.left, options.members.filter(m=>m.isReadOnly()))) {
                throw `Error: Can't assign property use TwoWay() or Internal State - ${this.toString()}`;
            }

            const isState = checkDependency(this.left, options.members.filter(m => m.decorators.find(d => d.name === "TwoWay")));
            const stateSetting = `${this.left.compileStateSetting(rightExpression, isState, options)}`;
            const changeRising = this.left.compileStateChangeRising(options.state, rightExpression);
            return changeRising ? `(${stateSetting},${changeRising})` : stateSetting;
        }
        return `${this.left.toString(options)}${this.operator}${this.right.toString(options)}`;
    }

    getDependency() {
        if (this.operator === SyntaxKind.EqualsToken) {
            return this.right.getDependency();
        }
        return this.getAllDependency();
    }

    getAllDependency() {
        return this.left.getDependency().concat(this.right.getDependency());
    }
}

export class If extends ExpressionWithExpression {
    thenStatement: Expression;
    elseStatement?: Expression;
    constructor(expression: Expression, thenStatement: Expression, elseStatement?: Expression) {
        super(expression);
        this.thenStatement = thenStatement;
        this.elseStatement = elseStatement;
    }

    toString(options?: toStringOptions) {
        const elseStatement = this.elseStatement ? `else ${this.elseStatement.toString(options)}` : "";
        return `if(${this.expression.toString(options)})${this.thenStatement.toString(options)}
        ${elseStatement}`;
    }

    getDependency() {
        return super.getDependency()
            .concat(this.thenStatement.getDependency())
            .concat(this.elseStatement ? this.elseStatement.getDependency() : []);
    }
}

export class Conditional extends If {
    elseStatement: Expression;
    constructor(expression: Expression, thenStatement: Expression, elseStatement: Expression) {
        super(expression, thenStatement);
        this.elseStatement = elseStatement;
    }
    toString(options?: toStringOptions) {
        return `${this.expression.toString(options)}?${this.thenStatement.toString(options)}:${this.elseStatement!.toString(options)}`;
    }
}

export class While extends If {
    toString(options?: toStringOptions) {
        return `while(${this.expression.toString(options)})${this.thenStatement.toString(options)}`;
    }
}

export class Do extends While {
    constructor(statement: Expression, expression: Expression) {
        super(expression, statement);
    }
    toString(options?: toStringOptions) {
        return `do ${this.thenStatement.toString(options)} 
            while(${this.expression.toString(options)})`;
    }
}

export class For extends ExpressionWithExpression {
    initializer?: Expression;
    condition?: Expression;
    incrementor?: Expression;

    constructor(initializer: Expression | undefined, condition: Expression | undefined, incrementor: Expression | undefined, statement: Expression) {
        super(statement);
        this.initializer = initializer;
        this.condition = condition;
        this.incrementor = incrementor;
    }

    toString(options?: toStringOptions) {
        const initializer = this.initializer ? this.initializer.toString(options) : "";
        const condition = this.condition ? this.condition.toString(options) : "";
        const incrementor = this.incrementor ? this.incrementor.toString(options) : "";

        return `for(${initializer};${condition};${incrementor})${this.expression.toString(options)}`;
    }

    getDependency() {
        return super.getDependency()
            .concat(this.initializer && this.initializer.getDependency() || [])
            .concat(this.condition && this.condition.getDependency() || [])
            .concat(this.incrementor && this.incrementor.getDependency() || []);
    }
}

export class ForIn extends ExpressionWithExpression {
    initializer: Expression;
    statement: Expression;
    constructor(initializer: Expression, expression: Expression, statement: Expression) {
        super(expression);
        this.initializer = initializer;
        this.statement = statement;
    }

    toString(options?: toStringOptions) {
        const initializer = this.initializer.toString(options);
        const statement = this.statement.toString(options);
        const expression = super.toString(options);

        return `for(${initializer} in ${expression})${statement}`;
    }

    getDependency() {
        return super.getDependency()
            .concat(this.initializer.getDependency())
            .concat(this.statement.getDependency());
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
        return `@${this.expression.toString()}`;
    }
}

export class BaseClassMember extends Expression { 
    decorators: Decorator[];
    modifiers: string[];
    _name: Identifier;
    type: TypeExpression;
    inherited: boolean;

    prefix: string = "";

    constructor(decorators: Decorator[] = [], modifiers: string[] = [], name: Identifier, type: TypeExpression = new SimpleExpression(""), inherited: boolean = false) { 
        super();
        this.decorators = decorators;
        this.modifiers = modifiers;
        this._name = name;
        this.type = type;
        this.inherited = inherited;
    }

    get name(): string { 
        return `${this.prefix}${this._name}`;
    }

    toString(options?: toStringOptions) {
        return this.name.toString();
    }

    getter() { 
        return this.toString();
    }

    isReadOnly() { 
        return true;
    }

}

export class Method extends BaseClassMember {
    asteriskToken: string;
    questionToken: string;
    typeParameters: any;
    parameters: Parameter[];
    body: Block;
   
    constructor(decorators: Decorator[] = [], modifiers: string[] = [], asteriskToken: string, name: Identifier, questionToken: string = "", typeParameters: any[], parameters: Parameter[], type: TypeExpression = new SimpleExpression("any"), body: Block) {
        super(decorators, modifiers, name, type);
        this.asteriskToken = asteriskToken;
        this.questionToken = questionToken;
        this.typeParameters = typeParameters;
        this.parameters = parameters;
        this.body = body;
    }

    parametersTypeDeclaration() {
        return this.parameters.map(p => p.declaration()).join(",");
    }

    typeDeclaration() {
        return `${this.name}${this.questionToken}:(${this.parameters.map(p => p.typeDeclaration()).join(",")})=>${this.type}`
    }

    defaultDeclaration() { 
        /* istanbul ignore next */
        return this.declaration();
    }

    declaration(options?: toStringOptions) {
        return `function ${this.name}(${this.parametersTypeDeclaration()})${this.body.toString(options)}`;
    }

    arrowDeclaration(options?:any) {
        return `(${this.parametersTypeDeclaration()})=>${this.body.toString(options)}`
    }

    getDependency(properties: Array<State | Prop | InternalState> = []) {
        const dependency = this.body.getDependency();
        const additionalDependency = [];

        if (dependency.find(d => d === "props")) { 
            additionalDependency.push("props");
        }

        const result = Object.keys(dependency.reduce((k: any, d) => {
            if (!k[d]) {
                k[d] = d;
            }
            return k;
        }, {}))
            .map(d => properties.find(p => p.name.toString() === d))
            .filter(d => d)
            .reduce((d: string[], p) => d.concat(p!.getDependecy()), [])
            .concat(additionalDependency);
        
        if (additionalDependency.indexOf("props") > -1) { 
            return result.filter(d => !d.startsWith("props."));
        }
        
        return result;
    }
}

export class GetAccessor extends Method { 
    constructor(decorators: Decorator[] = [], modifiers: string[] = [], name: Identifier, parameters: Parameter[], type?: TypeExpression, body?: Block) { 
        super(decorators, modifiers, "", name, "", [], parameters, type, body || new Block([], false));
    }

    typeDeclaration() { 
        return `${this._name}:${this.type}`;
    }

    getter() { 
        return `${super.getter()}()`;
    }
}

export class Property extends BaseClassMember {
    questionOrExclamationToken: string;
    initializer?: Expression;

    get name(): string {
        if (this.decorators.find(d => d.name === "Template")) {
            return this._name.toString().replace(/template/g, "render")
                .replace(/(.+)(Template)/g, "$1Render");
        }
        if (this.decorators.find(d => d.name === "Slot") && this._name.toString() === "default") {
            return "children";
        }
        return super.name;
    }

    constructor(decorators: Decorator[] = [], modifiers: string[] = [], name: Identifier, questionOrExclamationToken: string = "", type: TypeExpression = new SimpleExpression("any"), initializer?: Expression, inherited: boolean = false) {
        super(decorators, modifiers, name, type, inherited);
        this.questionOrExclamationToken = questionOrExclamationToken;
        this.initializer = initializer;
    }

    typeDeclaration() {
        if (this.decorators.find(d => d.name === "Slot")) {
            return `${this.name}${this.questionOrExclamationToken}:React.ReactNode`;
        }
        const baseValue = `${this.name}${this.questionOrExclamationToken}:${this.type}`;
        if (this.decorators.find(d => d.name === "TwoWay")) {
            return `
            ${baseValue};
            default${capitalizeFirstLetter(this.name)}?:${this.type};
            ${this.name}Change?:(${this.name}:${this.type})=>void`;
        }
        return baseValue;
    }

    defaultDeclaration() {
        const baseValue = `${this.name}:${this.initializer}`;
        if (this.decorators.find(d => d.name === "TwoWay")) {
            return `${baseValue},
            ${this.name}Change:()=>{}`;
        }
        return baseValue;
    }

    getter() {
        if (this.decorators.find(d => d.name === "InternalState")) {
            return getLocalStateName(this.name);
        }
        if (this.decorators.find(d => d.name === "Template" || d.name === "Slot")) {
            return `props.${this.name}`;
        }
        return this.name;
    }

    isReadOnly() {
        return !!this.decorators.find(d => d.name === "OneWay" || d.name === "Event");
    }

    inherit() { 
        return new Property(this.decorators, this.modifiers, this._name, this.questionOrExclamationToken, this.type, this.initializer, true);
    }
}

function inheritMembers(heritageClauses: HeritageClause[], members: Array<Property | Method>) {
    return heritageClauses.reduce((m, { members }) => {
        members = members.filter(inheritMember => m.every(m => m.name.toString() !== inheritMember.name.toString()));
        return m.concat(members);
    }, members);
}

export class Class {
    decorators: Decorator[];
    _name: Identifier;
    members: Array<Property | Method>;
    modifiers: string[];
    heritageClauses: HeritageClause[];

    get name() { 
        return this._name.toString();
    }

    constructor(decorators: Decorator[] = [], modifiers: string[] = [], name: Identifier, typeParameters: any[], heritageClauses: HeritageClause[] = [], members: Array<Property | Method>) {
        members = inheritMembers(heritageClauses, members);
        this.decorators = decorators;
        this._name = name;
        this.members = members;
        this.modifiers = modifiers;
        this.heritageClauses = heritageClauses;
    }

    toString() {
        return "";
    }
}

export interface Heritable {
    name: string;
    heritageProperies: Property[];
    compileDefaultProps(): string;
    defaultPropsDest(): string;
}

export class ComponentInput extends Class implements Heritable {
    get heritageProperies() {
        return (this.members.filter(m => m instanceof Property) as Property[]).map(p => p.inherit());
    }

    compileDefaultProps() {
        return this.name.toString();
    }

    toString() { 
        const inherited = this.heritageClauses.reduce((t: string[], h) => t.concat(h.typeNodes.map(t => `...${t}`)), []);
       
        const types = this.heritageClauses.reduce((t: string[], h) => t.concat(h.typeNodes.map(t => `typeof ${t}`)), []);

        const typeDeclaration = `declare type ${this.name}=${types.concat([`{
            ${this.members.filter(m => !(m as Property).inherited).map(p => p.typeDeclaration()).join(";\n")}
        }`]).join("&")}`;

        return `${typeDeclaration}
        ${this.modifiers.join(" ")} const ${this.name}:${this.name}={
           ${inherited.concat(
               this.members
                   .filter(m => !(m as Property).inherited && (m as Property).initializer)
                   .map(p => p.defaultDeclaration())
           ).join(",\n")}
        };`;
    }

    defaultPropsDest() {
        return this.name.toString();
    }
}

export class TypeExpression extends Expression { }

export class SimpleTypeExpression extends TypeExpression { 
    type: string;

    constructor(type: string) { 
        super();
        this.type = type;
    }

    toString(options?: toStringOptions) { 
        return this.type;
    }
}

export class ArrayTypeNode extends TypeExpression { 
    elementType: TypeExpression;

    constructor(elementType: TypeExpression) { 
        super();
        this.elementType = elementType;
    }

    toString(options?: toStringOptions) { 
        return `${this.elementType}[]`;
    }
}

export class FunctionTypeNode extends TypeExpression { 
    typeParameters: any;
    parameters: Parameter[];
    type: TypeExpression;
    constructor(typeParameters: any, parameters: Parameter[], type: TypeExpression) { 
        super();
        this.typeParameters = typeParameters;
        this.parameters = parameters;
        this.type = type;
    }

    toString(options?: toStringOptions) { 
        return `(${this.parameters.map(p => p.declaration())})=>${this.type}`;
    }
}

export class TypeReferenceNode extends TypeExpression {
    typeName: Identifier;
    typeArguments: TypeExpression[];
    constructor(typeName: Identifier, typeArguments: TypeExpression[] = []) {
        super();
        this.typeName = typeName;
        this.typeArguments = typeArguments;
    }
    toString() {
        const typeArguments = this.typeArguments.length ? `<${this.typeArguments.join(",")}>` : "";
        return `${this.typeName}${typeArguments}`;
    }
}

export class TypeLiteralNode extends TypeExpression { 
    members: PropertySignature[];
    constructor(members: PropertySignature[]) { 
        super();
        this.members = members;
    }

    toString(options?:toStringOptions) { 
        return `{${this.members.join(",")}}`;
    }
}

export class ExpressionWithTypeArguments extends ExpressionWithExpression {
    typeArguments: TypeReferenceNode[] = [];
    constructor(typeArguments: TypeReferenceNode[] = [], expression: Expression) {
        super(expression);
        this.typeArguments = typeArguments;
    }

    toString() {
        const typeArgumentString = this.typeArguments.length ? `<${this.typeArguments.join(",")}>` : "";
        return `${this.expression}${typeArgumentString}`;
    }

    get typeNode() {
        return this.expression.toString();
    }

    get type() {
        if (this.typeArguments.length) {
            return this.typeArguments[0].toString();
        }
        return this.typeNode;
    }
}

export class PropertyAccess extends ExpressionWithExpression {
    name: Identifier
    constructor(expression: Expression, name: Identifier) {
        super(expression);
        this.name = name;
    }

    toString(options?: toStringOptions) {

        const expressionString = this.expression.toString();
        const internalState = options && options.internalState || [];
        const state = options && options.state || [];
        const props = options && options.props || [];
        const componentContext = options?.componentContext || SyntaxKind.ThisKeyword;

        const usePropsSpace = `${componentContext}.props`;

        const findProperty = (p: InternalState | State | Prop) => p.name.valueOf() === this.name.valueOf();
        if (expressionString === componentContext || expressionString === usePropsSpace) {
            const p = props.find(findProperty);
            if (p) {
                return p.getter();
            }

            const stateProp = state.find(findProperty);
            if (stateProp) {
                return `(${stateProp.getter()})`;
            }

            const member = options?.members
                .filter(m => expressionString === usePropsSpace ? m.inherited : true)
                .find(m => m._name.toString() === this.name.toString());
            
            if (member) { 
                return `${options?.newComponentContext ? `${options.newComponentContext}.` : ""}${member.getter()}`;
            }
        }

        if (expressionString === SyntaxKind.ThisKeyword && (internalState.length + state.length + props.length) > 0) {
            return this.name.toString();
        }

        const result = `${this.expression.toString(options)}.${this.name}`;

        if (options?.newComponentContext && result.startsWith(componentContext)) { 
            return result.replace(options.componentContext!, options.newComponentContext);
        }

        return result;
    }

    compileStateSetting(state: string, isState: boolean, options?: toStringOptions) {
        return `${stateSetter(this.name)}(${state})`;
    }

    compileStateChangeRising(state: State[] = [], rightExpressionString: string) {
        return state.find(s => s.name.valueOf() === this.name.valueOf()) ? `props.${this.name}Change!(${rightExpressionString})` : "";
    }

    getDependency(options?: toStringOptions) {
        const expressionString = this.expression.toString();
        const componentContext = options?.componentContext || SyntaxKind.ThisKeyword;
        if ((expressionString === componentContext && this.name.toString() !== "props") || expressionString === `${componentContext}.props`) {
            return [this.name.toString()];
        }
        const dependecy = this.expression.getDependency();
        if (this.toString() === `${componentContext}.props` && dependecy.length === 0) {
            return ["props"];
        }
        return dependecy;
    }
}

export class Prop {
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
        return this.property.typeDeclaration();
    }

    defaultDeclaration() {
        return this.property.defaultDeclaration();
    }

    getter() {
        return getPropName(this.name);
    }

    getDependecy() {
        return [this.getter()];
    }
}

export class Ref extends Prop {
    typeDeclaration() {
        return `${this.name}:any`;
    }

    getter() {
        return `${this.name}.current${this.property.questionOrExclamationToken}`;
    }

    getDependecy() {
        return [this.name.toString()];
    }
}

export class Slot extends Prop {
   
}

export class InternalState extends Prop {
    defaultDeclaration() {
        return `const [${getLocalStateName(this.name)}, ${stateSetter(this.name)}] = useState(${this.property.initializer});`;
    }

    getter() {
        return getLocalStateName(this.name);
    }
}

export class State extends InternalState {

    defaultProps() {
        return `${this.name}Change:()=>{}`
    }

    defaultDeclaration() {
        const propName = getPropName(this.name);
        const initializer = this.property.initializer ? `||${this.property.initializer.toString()}` : "";
        return `const [${getLocalStateName(this.name)}, ${stateSetter(this.name)}] = useState(()=>(${propName}!==undefined?${propName}:props.default${capitalizeFirstLetter(this.name)})${initializer});`;
    }

    getter() {
        const propName = getPropName(this.name);
        const expression = `${propName}!==undefined?${propName}:${getLocalStateName(this.name)}`;
        return expression;
    }

    getDependecy() {
        return [getPropName(this.name), getLocalStateName(this.name), getPropName(`${this.name}Change`)]
    }
}

export class Listener {
    method: Method;
    target?: string;
    eventName?: string;

    constructor(method: Method) {
        this.method = method;
        const [event, parameters] = method.decorators.find(d => d.name === "Listen")!.expression.arguments;
        if (parameters) {
            this.target = (parameters as ObjectLiteral).getProperty("target")?.toString();
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

    defaultDeclaration(options: toStringOptions) {
        const dependency = this.method.getDependency(options.state.concat(options.props).concat(options.internalState));
        return `const ${this.name}=useCallback(${this.method.arrowDeclaration(options)}, [${dependency.join(",")}])`;
    }
}

function capitalizeFirstLetter(string: string | Identifier) {
    string = string.toString();
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function stateSetter(stateName: Identifier|string) {
    return `__state_set${capitalizeFirstLetter(stateName)}`
}

export class ReactComponent {
    props: Prop[] = [];
    state: State[] = [];
    internalState: InternalState[];
    refs: Ref[];
    apiRefs: Ref[];
    events: Property[] = [];

    modifiers: string[];
    _name: Identifier;

    listeners: Listener[];
    methods: Method[];
    effects: Method[];
    slots: Slot[];

    api: Method[];

    view: any;
    viewModel: any;
    heritageClauses: HeritageClause[];

    members: Array<Property | Method>;

    context: GeneratorContex;

    defaultOptionRules?: Expression | null;

    get name() { 
        return this._name.toString();
    }

    addPrefixToMembers(members: Array<Property | Method>) { 
        if (this.isJSXComponent) { 
            members.filter(m => !m.inherited && m instanceof GetAccessor).forEach(m => {
                m.prefix = "__";
            });
        }
        return members;
    }

    get needGenerateDefaultOptions(): boolean { 
        return !!this.context.defaultOptionsModule && (!this.defaultOptionRules || this.defaultOptionRules?.toString() !== "null");
    }

    constructor(decorator: Decorator, modifiers: string[] = [], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[] = [], members: Array<Property | Method>, context: GeneratorContex) {
        this.modifiers = modifiers;
        this._name = name;
        this.heritageClauses = heritageClauses;


        this.members = members = inheritMembers(heritageClauses, this.addPrefixToMembers(members));

        this.props = members
            .filter(m => m.decorators.find(d => d.name === "OneWay" || d.name === "Event" || d.name === "Template"))
            .map(p => new Prop(p as Property))

        const refs = members.filter(m => m.decorators.find(d => d.name === "Ref")).reduce((r: {refs: Ref[], apiRefs: Ref[]}, p) => {
            if(context.components && context.components[p.type!.toString()] instanceof ReactComponent) {
                p.decorators.find(d => d.name === "Ref")!.expression.expression = new SimpleExpression("ApiRef");
                r.apiRefs?.push(new Ref(p as Property));
            } else {
                r.refs.push(new Ref(p as Property));
            }
            return r;
        }, { refs: [], apiRefs: []});
        this.refs = refs.refs;
        this.apiRefs = refs.apiRefs;

        this.internalState = members
            .filter(m => m instanceof Property && (m.decorators.length === 0 || m.decorators.find(d => d.name === "InternalState")))
            .map(p => new InternalState(p as Property));

        this.state = members.filter(m => m.decorators.find(d => d.name === "TwoWay"))
            .map(s => new State(s as Property));

        this.methods = members.filter(m => m instanceof Method && m.decorators.length === 0) as Method[];

        this.listeners = members.filter(m => m.decorators.find(d => d.name === "Listen"))
            .map(m => new Listener(m as Method));

        this.effects = members.filter(m => m.decorators.find(d => d.name === "Effect")) as Method[];

        this.api = members.filter(m => m.decorators.find(d => d.name === "Method")) as Method[];

        this.slots = members.filter(m => m.decorators.find(d => d.name === "Slot")).map(m => new Slot(m as Property));

        const parameters = (decorator.expression.arguments[0] as ObjectLiteral);

        this.view = parameters.getProperty("view");
        this.viewModel = parameters.getProperty("viewModel") || "";

        this.defaultOptionRules = parameters.getProperty("defaultOptionRules");

        this.context = context;

        if (context.defaultOptionsImport) { 
            context.defaultOptionsImport.add("convertRulesToOptions");
            context.defaultOptionsImport.add("Rule");
        }
    }

    get heritageProperies() {
        return this.members
            .filter(m => m instanceof Property &&
                m.decorators.find(d =>
                    d.name === "OneWay" ||
                    d.name === "TwoWay" ||
                    d.name === "Event" ||
                    d.name === "Slot" ||
                    d.name === "Template"))
            .map(p=>p as Property)
            .map(p => {
                const property = new Property(p.decorators, p.modifiers, p._name, p.questionOrExclamationToken, p.type, p.initializer);
                property.inherited = true;
                return property;
            });
    }

    compileImportStatements(hooks: string[], compats: string[]) {
        if (hooks.length) {
            return [`import React, {${hooks.concat(compats).join(",")}} from 'react';`];
        }
        return ["import React from 'react'"];
    }

    processModuleFileName(module: string) {
        return module;
    }

    compileDefaultOptionsImport(imports: string[]): void { 
        if (!this.context.defaultOptionsImport && this.needGenerateDefaultOptions && this.context.defaultOptionsModule && this.context.dirname) {
            const relativePath = getModuleRelativePath(this.context.dirname, this.context.defaultOptionsModule);
            imports.push(`import {convertRulesToOptions, Rule} from "${relativePath}"`);
        }
    }

    compileImports() {
        const imports: string[] = [];
        const hooks: string[] = [];
        const compats: string[] = [];

        if (this.internalState.length || this.state.length) {
            hooks.push("useState");
        }

        if (this.listeners.length || this.methods.length) {
            hooks.push("useCallback");
        }

        if (this.listeners.filter(l => l.target).length || this.effects.length) {
            hooks.push("useEffect");
        }

        if (this.refs.length || this.apiRefs.length) {
            hooks.push("useRef");
        }

        if (this.api.length) {
            hooks.push("useImperativeHandle");
            compats.push("forwardRef");
        }

        if(this.apiRefs.length) {
            imports.splice(-1, 0, ...this.apiRefs.reduce((imports: string[], ref) => {
                const baseComponent = this.context.components![ref.type!.toString()] as ReactComponent;
                if(this.context.dirname) {
                    const relativePath = getModuleRelativePath(this.context.dirname, baseComponent.context.path!);
                    imports.push(`import {${baseComponent.name}Ref as ${ref.type}Ref} from "${this.processModuleFileName(relativePath.replace(path.extname(relativePath), ''))}"`);
                }
                return imports;
            }, []));
        }

        this.compileDefaultOptionsImport(imports);

        return imports.concat(this.compileImportStatements(hooks, compats)).join(";\n");
    }

    defaultPropsDest() {
        return `${this.name.toString()}.defaultProps`;
    }

    compileDefaultOptionsMethod(defaultOptionRulesInitializer:string = "[]", statements: string[]=[]) { 
        if (this.needGenerateDefaultOptions) { 
            const defaultOptionsTypeName = `${this.name}OptionRule`;
            const defaultOptionsTypeArgument = this.isJSXComponent ? this.heritageClauses[0].defaultProps : this.name;
            return `type ${defaultOptionsTypeName} = Rule<${defaultOptionsTypeArgument}>;

            const __defaultOptionRules:${defaultOptionsTypeName}[] = ${defaultOptionRulesInitializer};
            export function defaultOptions(rule: ${defaultOptionsTypeName}) { 
                __defaultOptionRules.push(rule);
                ${statements.join("\n")}
            }`;
        }
        return "";
    }

    compileDefaultProps() {
        const defaultProps = this.heritageClauses
            .filter(h => h.defaultProps.length).map(h => `...${h.defaultProps}`)
            .concat(
                this.props.filter(p => !p.property.inherited && p.property.initializer)
                    .concat(this.state)
                    .map(p => p.defaultProps())
        );

        if (this.defaultOptionRules && this.needGenerateDefaultOptions) { 
            defaultProps.push(`...convertRulesToOptions(${this.defaultOptionRules})`);
        }

        if (this.needGenerateDefaultOptions) { 
            return `
                function __createDefaultProps(){
                    return {
                        ${defaultProps.join(",\n")}
                    }
                }
                ${this.defaultPropsDest()}= __createDefaultProps();
            `;
        }
        if (defaultProps.length) {
            return `${this.defaultPropsDest()} = {
                ${defaultProps.join(",\n")}
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
            return this.listeners.map(l => l.defaultDeclaration({
                members: this.members,
                internalState: this.internalState,
                state: this.state,
                props: this.props.concat(this.refs, this.apiRefs)
            })).join(";\n");
        }
        return "";
    }

    compileUseEffect() {
        const subscriptions = this.listeners.filter(m => m.target);

        const effects = this.effects;

        const effectsString = effects.map(e => `useEffect(${e.arrowDeclaration({
            members: this.members,
            internalState: this.internalState, state: this.state, props: this.props.concat(this.refs, this.apiRefs)
        })}, 
        [${e.getDependency(this.props.concat(this.state).concat(this.internalState))}])`).join(";\n");

        let subscriptionsString = "";
        if (subscriptions.length) {
            const { add, cleanup } = subscriptions.reduce(({ add, cleanup }, s) => {
                (add as string[]).push(`${s.target}.addEventListener(${s.eventName}, ${s.name});`);
                (cleanup as string[]).push(`${s.target}.removeEventListener(${s.eventName}, ${s.name});`);
                return { add, cleanup }
            }, { add: [], cleanup: [] });
            if (add.length) {
                subscriptionsString = `useEffect(()=>{
                    ${add.join("\n")}
                    return function cleanup(){
                        ${cleanup.join("\n")}
                    }
                });`;
            }
        }
        return subscriptionsString + effectsString;
    }

    compileComponentRef() {
        if(this.api.length) {
            return `export type ${this.name}Ref = {${this.api.map(a => a.typeDeclaration())}}`
        }
        return "";
    }

    compileUseImperativeHandle() {
        if(this.api.length) {
            const api = this.api.reduce((r: { methods: string[], deps: string[]}, a) => {
                r.methods.push(`${a.name}: ${a.arrowDeclaration({
                    members: this.members,
                    internalState: this.internalState, state: this.state, props: this.props.concat(this.refs, this.apiRefs)
                })}`);

                r.deps = [...new Set(r.deps.concat(a.getDependency(this.props.concat(this.state).concat(this.internalState))))];
                
                return r;
            }, { methods: [], deps: [] });

            return `useImperativeHandle(ref, () => ({${api.methods.join(",\n")}}), [${api.deps.join(",")}])`
        }

        return "";
    }

    compileUseRef() {
        return this.refs.map(r => {
            return `const ${r.name}=useRef<${r.type}>()`;
        }).concat(this.apiRefs.map(r => {
            return `const ${r.name}=useRef<${r.type}Ref>()`;
        })).join(";\n");
    }

    compileComponentInterface() {

        const props = this.isJSXComponent ? [`props: ${this.compilePropsType()}`] : this.props
                .concat(this.state)
                .map(p => p.typeDeclaration());

        return `interface ${this.name}{
            ${  props
                .concat(this.internalState.concat(this.refs, this.apiRefs).concat(this.slots.filter(s=>!s.property.inherited)).map(p => p.typeDeclaration()))
                .concat(this.listeners.map(l => l.typeDeclaration()))
                .concat(this.methods.map(m => m.typeDeclaration()))
                .concat([""])
                .join(";\n")
            }
        }`;
    }

    get isJSXComponent() {
        return this.heritageClauses
            .reduce((typeNodes: string[], h) => typeNodes.concat(h.typeNodes), [])
            .filter(t => t === "JSXComponent").length;
    }

    compileViewModelArguments(): string[] {
        const compileState = (state: Array<State | InternalState>) => state.map(s => `${s.name}:${s.getter()}`);
        const state = compileState(this.state);
        const internalState = compileState(this.internalState);

        const props = this.isJSXComponent ?
            [`props:{${["...props"].concat(state).join(",\n")}}`].concat(internalState) :
            ["...props"].concat(internalState).concat(state);

        return props
            .concat(this.listeners.map(l => l.name.toString()))
            .concat(this.refs.map(r => r.name.toString()))
            .concat(this.apiRefs.map(r => r.name.toString()))
            .concat(this.methods.map(m => m instanceof GetAccessor ? `${m._name}:${m.name}()` : m.name.toString()));
    }

    compilePropsType() {
        if (this.isJSXComponent) { 
            return this.heritageClauses[0].defaultProps[0];
        }
        return `{
            ${this.props
                .concat(this.state)
                .concat(this.slots)
                .map(p => p.typeDeclaration()).join(",\n")}
        }`;
    }

    toString() {
        return `
            ${this.compileImports()}
            ${this.compileComponentRef()}
            ${this.compileComponentInterface()}

            ${this.api.length === 0 
                ? `${this.modifiers.join(" ")} function ${this.name}(props: ${this.compilePropsType()}){`
                : `const ${this.name} = forwardRef<${this.name}Ref, ${this.compilePropsType()}>((props: ${this.compilePropsType()}, ref) => {`}
                ${this.compileUseRef()}
                ${this.stateDeclaration()}
                ${this.listenersDeclaration()}
                ${this.compileUseEffect()}
                ${this.compileUseImperativeHandle()}
                ${this.methods.map(m => {
                    return `const ${m.name}=useCallback(${m.declaration({
                        members: this.members,
                        internalState: this.internalState, state: this.state, props:this.props.concat(this.refs, this.apiRefs)
                    })}, [${
                        m.getDependency(this.internalState.concat(this.state).concat(this.props))
                    }]);`;
                }).join("\n")}
                return ${this.view}(${this.viewModel}({
                        ${ this.compileViewModelArguments().join(",\n")}
                    })
                );
            ${this.api.length === 0 ? `}` : `});\n${this.modifiers.join(" ")} ${this.name};`}
            
            ${this.compileDefaultProps()}
            ${this.compileDefaultOptionsMethod("[]", [
                `${this.defaultPropsDest()} = {
                    ...__createDefaultProps(),
                    ...convertRulesToOptions(__defaultOptionRules)
                };`
            ])}`;
    }
}

export class ElementAccess extends ExpressionWithExpression {
    index: Expression;
    constructor(expression: Expression, index: Expression) {
        super(expression);
        this.index = index;
    }

    toString(options?: toStringOptions) {
        return `${super.toString(options)}[${this.index.toString(options)}]`;
    }

    getDependency() {
        return super.getDependency().concat(this.index.getDependency());
    }
}

export class Prefix extends Expression {
    operator: string;
    operand: Expression;
    constructor(operator: string, operand: Expression) {
        super();
        this.operator = operator;
        this.operand = operand;
    }

    toString(options?: toStringOptions) {
        return `${this.operator}${this.operand.toString(options)}`;
    }

    getDependency() {
        return this.operand.getDependency();
    }
}

export class Postfix extends Prefix {
    toString(options?: toStringOptions) {
        return `${this.operand.toString(options)}${this.operator}`;
    }
}

export class NonNullExpression extends ExpressionWithExpression {
    toString(options?: toStringOptions) {
        return `${super.toString(options).replace(/[\?!]$/, '')}!`;
    }
}

export class VariableDeclaration extends Expression {
    name: Identifier | BindingPattern;
    type: string;
    initializer?: Expression;

    constructor(name: Identifier | BindingPattern, type: string = "", initializer?: Expression) {
        super();
        this.name = name;
        this.type = type;
        this.initializer = initializer;
    }

    toString(options?: toStringOptions) {
        if (this.name instanceof BindingPattern && options?.members.length && this.initializer instanceof PropertyAccess) {
            const dependecy = this.initializer.getDependency(options);
            if (dependecy.indexOf("props") === 0) { 
                const props = getProps(options.members);
                const members = this.name.getDependency()
                    .map(d => props.find(m => m._name.toString() === d))
                    .filter(m => m && m.name && m.getter().toString() !== m._name.toString()) as Array<Property|Method>;
                const variables = members.reduce((v: VariableExpression, m) => {
                    const bindingPattern = this.name as BindingPattern;
                    bindingPattern.remove(m._name.toString());
                    if (bindingPattern.hasRest()) { 
                        bindingPattern.add(
                            new BindingElement(undefined, undefined, new Identifier(m.name))
                        );
                    }
                    return {
                        ...v,
                        [m._name.toString()]: this.initializer ? new PropertyAccess(this.initializer, new Identifier(m.name)) : new SimpleExpression(m.name)
                    };
                }, options.variables || {});
                
                options.variables = variables;
            }
         }
        
        const initilizerDeclaration = this.initializer ? `=${this.initializer.toString(options)}` : "";
        if (this.name.toString()) { 
           return `${this.name}${compileType(this.type)}${initilizerDeclaration}`;
        }
        return "";
    }

    getDependency() {
        if (this.initializer && typeof this.initializer !== "string") {
            const initializerDependency = this.initializer.getDependency();
            if (this.name instanceof BindingPattern && this.initializer.toString().startsWith("this")) {
                if (this.name.hasRest()) {
                    return initializerDependency;
                }
                return this.name.getDependency();
            }
            return initializerDependency;
        }
        return [];
    }

    getVariableExpressions(): VariableExpression { 
        if (this.name instanceof Identifier && this.initializer instanceof Expression) { 
            const expression =
                this.initializer instanceof SimpleExpression ||
                    this.initializer.isJsx() ||
                    this.initializer instanceof Call ?
                
                    this.initializer :
                    new Paren(this.initializer);
            
            return {
                [this.name.toString()]: expression
            };
        }
        if (this.name instanceof BindingPattern && this.initializer) {
            return this.name.getVariableExpressions(this.initializer);
        }
        return {};
    }
}

export class VariableDeclarationList extends Expression {
    declarations: VariableDeclaration[];
    flags?: string;

    constructor(declarations: VariableDeclaration[], flags?: string) {
        super();
        this.declarations = declarations;
        this.flags = flags;
    }

    toString(options?: toStringOptions) {
        const declarations = this.declarations.map(d => d.toString(options)).filter(d => d);
        if (declarations.length === 0) { 
            return "";
        }
        return `${this.flags} ${declarations}`;
    }

    getDependency() {
        return this.declarations.reduce((d: string[], p) => d.concat(p.getDependency()), []);
    }

    getVariableExpressions(): VariableExpression { 
        return this.declarations.reduce((v: VariableExpression, d) => { 
            return {
                ...v,
                ...d.getVariableExpressions()
            }
        }, {});
    }
}

export class VariableStatement extends Expression {
    declarationList: VariableDeclarationList;
    modifiers: string[];
    constructor(modifiers: string[] = [], declarationList: VariableDeclarationList) {
        super();
        this.modifiers = modifiers;
        this.declarationList = declarationList;
    }


    toString(options?: toStringOptions) {
        const declarationList = this.declarationList.toString(options);
        return declarationList ? `${this.modifiers.join(" ")} ${declarationList}` : "";
    }

    getDependency() {
        return this.declarationList.getDependency();
    }
}

export class PropertySignature extends ExpressionWithOptionalExpression {
    modifiers: string[];
    name: Identifier;
    questionToken: string;
    type: string;

    constructor(modifiers: string[] = [], name: Identifier, questionToken: string = "", type: string, initializer?: Expression) {
        super(initializer);
        this.modifiers = modifiers;
        this.name = name;
        this.questionToken = questionToken;
        this.type = type;
    }

    toString(options?: toStringOptions) {
        return `${this.name}${this.questionToken}:${this.type}`;
    }

}

export class IndexSignature extends Expression {
    decorators?: Decorator[];
    modifiers: string[];
    parameters: Parameter[];
    type: TypeExpression;
    constructor(decorators: Decorator[] = [], modifiers: string[] = [], parameters: Parameter[], type: TypeExpression) {
        super();
        this.decorators = decorators;
        this.modifiers = modifiers;
        this.parameters = parameters;
        this.type = type;
    }

    toString(options?: toStringOptions) {
        return `${this.parameters.map(p => `[${p.typeDeclaration()}]`)}:${this.type}`;
    }
}

export class TemplateSpan extends ExpressionWithExpression {
    literal: string;
    constructor(expression: Expression, literal: string) {
        super(expression);
        this.literal = literal;
    }

    toString(options?: toStringOptions) {
        const expressionString = super.toString(options);
        if (options?.disableTemplates) { 
            return `${expressionString}+"${this.literal}"`;
        }
        return `\${${expressionString}}${this.literal}`;
    }
}

export class TemplateExpression extends Expression {
    head: string;
    templateSpans: TemplateSpan[];

    constructor(head: string, templateSpans: TemplateSpan[]) {
        super();
        this.head = head;
        this.templateSpans = templateSpans;
    }

    toString(options?: toStringOptions) {
        const templateSpansStrings = this.templateSpans.map(s => s.toString(options));
        if (options?.disableTemplates) { 
            return `"${this.head}"+${templateSpansStrings.join("+")}`;
        }
        return `\`${this.head}${templateSpansStrings.join("")}\``;
    }

    getDependency() {
        return this.templateSpans.reduce((d: string[], t) => d.concat(t.getDependency()), []);
    }

}

export class HeritageClause {
    token: string;
    types: ExpressionWithTypeArguments[];
    members: Property[];
    defaultProps: string[] = [];
    get typeNodes() {
        return this.types.map(t => t.typeNode);
    }
    constructor(token: string, types: ExpressionWithTypeArguments[], context: GeneratorContex) {
        this.token = token;
        this.types = types;

        this.members = types.reduce((properties: Property[], { type }) => {
            if (context.components && context.components[type] && context.components[type]) {
                properties = properties.concat(context.components[type].heritageProperies)
            }
            return properties;
        }, []);

        this.defaultProps = types.reduce((defaultProps: string[], { type }) => {
            const importName = type;
            const component = context.components && context.components[importName]
            if (component && component.compileDefaultProps() !== "") {
                defaultProps.push(`${component.defaultPropsDest().replace(component.name.toString(), importName)}`);
            }
            return defaultProps;
        }, []);
    }

    toString() {
        return `${this.token} ${this.types.map(t => t.toString())}`;
    }
}

export class CaseClause extends ExpressionWithOptionalExpression {
    statements: Expression[];
    constructor(expression: Expression | undefined, statements: Expression[]) {
        super(expression);
        this.statements = statements;
    }

    toString(options?: toStringOptions) {
        return `case ${super.toString(options)}:
            ${this.statements.map(s => s.toString(options)).join("\n")}
        `;
    }

    getDependency() {
        return this.statements.reduce((d: string[], s) => {
            return d.concat(s.getDependency());
        }, []).concat(super.getDependency());
    }
}

export class DefaultClause extends CaseClause {
    constructor(statements: Expression[]) {
        super(undefined, statements);
    }

    toString(options?: toStringOptions) {
        return `default:
            ${this.statements.map(s => s.toString(options)).join("\n")}
        `;
    }
}

export class CaseBlock extends Block {
    constructor(clauses: Array<DefaultClause | CaseClause>) {
        super(clauses, true);
    }
}

export class Switch extends If {
    toString(options?: toStringOptions) {
        return `switch(${this.expression.toString(options)})${this.thenStatement.toString(options)}`;
    }
}

export class ComputedPropertyName extends ExpressionWithExpression {
    toString(options?: toStringOptions) {
        return `[${super.toString(options)}]`;
    }
}

export class NamedImports {
    node: Identifier[];
    constructor(node: Identifier[], elements?: any[]) {
        this.node = node;
    }

    add(name: string) { 
        this.remove(name);
        this.node.push(new Identifier(name));
    }
    
    remove(name: string) { 
        this.node = this.node.filter(n => n.toString() !== name);
    }

    toString() {
        return this.node.length ? `{${this.node.join(",")}}` : "";
    }
}

export class ImportClause { 
    name?: Identifier;
    namedBindings?: NamedImports;
    constructor(name?: Identifier, namedBindings?: NamedImports) { 
        this.name = name;
        this.namedBindings = namedBindings;
    }

    get default() { 
        return this.name?.toString() || "";
    }

    get imports() { 
        return this.namedBindings?.node.map(m => m.toString()) || [];
    }

    remove(name:string) { 
        if (this.namedBindings) { 
            this.namedBindings.remove(name);
        }
    }

    add(name: string) { 
        if (this.namedBindings) {
            this.namedBindings.add(name);
        } else { 
            this.namedBindings = new NamedImports([new Identifier(name)]);
        }
    }

    toString() { 
        const result: string[] = [];
        if (this.name) {
            result.push(this.name.toString());
        }
        if (this.namedBindings) {
            const namedBindings = this.namedBindings.toString();
            namedBindings && result.push(namedBindings);
        }

        return result.length ? `${result.join(",")} from ` : "";
    }
}

export class ImportDeclaration { 
    decorators: Decorator[];
    modifiers: string[];
    importClause: ImportClause;
    moduleSpecifier: StringLiteral;

    replaceSpecifier(search: string | RegExp, replaceValue: string) { 
        this.moduleSpecifier.expression = this.moduleSpecifier.expression.replace(search, replaceValue);
    }
    
    add(name: string) { 
        this.importClause.add(name);
    }

    constructor(decorators: Decorator[] = [], modifiers: string[] = [], importClause: ImportClause, moduleSpecifier: StringLiteral) { 
        this.decorators = decorators;
        this.modifiers = modifiers;
        this.importClause = importClause;
        this.moduleSpecifier = moduleSpecifier;
    }

    toString() { 
        return `import ${this.importClause}${this.moduleSpecifier}`;
    }
}

export class JsxAttribute { 
    name: Identifier;
    initializer: Expression;
    constructor(name: Identifier, initializer: Expression) { 
        this.name = name;
        this.initializer = initializer;
    }

    toString(options?:toStringOptions) { 
        const name = this.name.toString(options);
        return `${(eventsDictionary as any)[name] || name}=${this.initializer.toString(options)}`;
    }
}

export class JsxOpeningElement extends Expression { 
    tagName: Expression;
    typeArguments: any[];
    attributes: Array<JsxAttribute | JsxSpreadAttribute>;
    
    processTagName(tagName: Expression) { 
        return tagName.toString() === "Fragment" ? new Identifier("React.Fragment") : tagName;
    }

    constructor(tagName: Expression, typeArguments: any[] = [], attributes: Array<JsxAttribute|JsxSpreadAttribute>) { 
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

export class AsExpression extends ExpressionWithExpression { 
    type: TypeExpression;
    constructor(expression: Expression, type: TypeExpression) {
        super(expression);
        this.type = type;
    }

    toString(options?: toStringOptions) { 
        return `${super.toString(options)} as ${this.type}`;
    }
}

export interface GeneratorContex {
    path?: string;
    dirname?: string;
    components?: { [name: string]: Heritable };
    defaultOptionsImport?: ImportDeclaration;
    defaultOptionsModule?: string
}

export class Generator {
    NodeFlags = {
        Const: "const",
        Let: "let",
        None: "var",
        LessThanEqualsToken: "<=",
        MinusEqualsToken: "-=",
        ConstructorKeyword: "constructor",

        // FirstToken: 0,
        // EndOfFileToken: 1,
        // FirstTriviaToken: 2,
        // MultiLineCommentTrivia: 3,
        // NewLineTrivia: 4,
        // FirstLiteralToken: 5,
        // TemplateMiddle: 6,
        // NamedImports: 10
    };

    SyntaxKind = SyntaxKind;

    processSourceFileName(name: string) {
        return name;
    }

    createIdentifier(name: string): Identifier {
        return new Identifier(name);
    }

    createNumericLiteral(value: string, numericLiteralFlags = ""): Expression {
        return new SimpleExpression(value);
    }

    createVariableDeclaration(name: Identifier | BindingPattern, type: string = "", initializer?: Expression): VariableDeclaration {
        return new VariableDeclaration(name, type, initializer);
    }

    createVariableDeclarationList(declarations: VariableDeclaration[], flags?: string) {
        return new VariableDeclarationList(declarations, flags);
    }

    createVariableStatement(modifiers: string[] = [], declarationList: VariableDeclarationList): Expression {
        return new VariableStatement(modifiers, declarationList);
    }

    createStringLiteral(value: string) {
        return new StringLiteral(value);
    }

    createBindingElement(dotDotDotToken: string="", propertyName: Identifier | undefined, name: string | Identifier | BindingPattern, initializer?: Expression) {
        return new BindingElement(dotDotDotToken, propertyName, name, initializer);
    }

    createArrayBindingPattern(elements: Array<BindingElement>) {
        return new BindingPattern(elements, "array");
    }

    createArrayLiteral(elements: Expression[], multiLine: boolean): Expression {
        return new ArrayLiteral(elements, multiLine);
    }

    createObjectLiteral(properties: Array<PropertyAssignment | ShorthandPropertyAssignment | SpreadAssignment>, multiLine: boolean): Expression {
        return new ObjectLiteral(properties, multiLine);
    }

    createObjectBindingPattern(elements: BindingElement[]) {
        return new BindingPattern(elements, "object");
    }

    createPropertyAssignment(key: Identifier, value: Expression) {
        return new PropertyAssignment(key, value)
    }

    createKeywordTypeNode(kind: string) {
        return new SimpleTypeExpression(kind);
    }

    createArrayTypeNode(elementType: TypeExpression) {
        return new ArrayTypeNode(elementType);
    }

    createFalse() {
        return new SimpleExpression(this.SyntaxKind.FalseKeyword);
    }

    createTrue(): Expression {
        return new SimpleExpression(this.SyntaxKind.TrueKeyword);
    }

    createNew(expression: Expression, typeArguments: string[] = [], argumentsArray: Expression[]) {
        return new New(expression, typeArguments, argumentsArray);
    }

    createDelete(expression: Expression) {
        return new Delete(expression);
    }

    createNull() {
        return new SimpleExpression(this.SyntaxKind.NullKeyword);
    }

    createThis() {
        return new SimpleExpression(this.SyntaxKind.ThisKeyword);
    }

    createBreak(label?: string | Identifier) {
        return new SimpleExpression("break");
    }

    createContinue(label?: string | Identifier) {
        return new SimpleExpression("continue");
    }

    createDebuggerStatement() {
        return new SimpleExpression("debugger");
    }

    createBlock(statements: Expression[], multiLine: boolean) {
        return new Block(statements, multiLine);
    }

    createFunctionDeclaration(decorators: Decorator[] = [], modifiers: string[] = [], asteriskToken: string, name: Identifier, typeParameters: string[], parameters: Parameter[], type: string, body: Block) {
        return new Function(decorators, modifiers, asteriskToken, name, typeParameters, parameters, type, body, this.getContext());
    }

    createParameter(decorators: Decorator[] = [], modifiers: string[] = [], dotDotDotToken: any, name: Identifier|BindingPattern, questionToken?: string, type?: TypeExpression, initializer?: Expression) {
        return new Parameter(decorators, modifiers, dotDotDotToken, name, questionToken, type, initializer);
    }

    createReturn(expression: Expression) {
        return new ReturnStatement(expression);
    }

    createFunctionExpression(modifiers: string[] = [], asteriskToken: string, name: Identifier | undefined, typeParameters: string[], parameters: Parameter[], type: string, body: Block) {
        return new Function([], modifiers, asteriskToken, name, typeParameters, parameters, type, body, this.getContext());
    }

    createToken(token: string) {
        return token;
    }

    createArrowFunction(modifiers: string[] = [], typeParameters: string[] = [], parameters: Parameter[], type: string = "", equalsGreaterThanToken: string, body: Block | Expression) {
        return new ArrowFunction(modifiers, typeParameters, parameters, type, equalsGreaterThanToken, body, this.getContext());
    }

    createModifier(modifier: string) {
        return modifier
    }

    createBinary(left: Expression, operator: string, right: Expression) {
        return new Binary(left, operator, right);
    }

    createParen(expression: Expression) {
        return new Paren(expression);
    }

    createCall(expression: Expression, typeArguments: string[] = [], argumentsArray: Expression[] = []) {
        return new Call(expression, typeArguments, argumentsArray);
    }

    createExportAssignment(decorators: Decorator[] = [], modifiers: string[] = [], isExportEquals: any, expression: Expression) {
        return `export default ${expression}`;
    }

    createShorthandPropertyAssignment(name: Identifier, expression?: Expression) {
        return new ShorthandPropertyAssignment(name, expression)
    }

    createSpreadAssignment(expression: Expression) {
        return new SpreadAssignment(expression);
    }

    createTypeReferenceNode(typeName: Identifier, typeArguments?: TypeExpression[]) {
        return new TypeReferenceNode(typeName, typeArguments);
    }

    createIf(expression: Expression, thenStatement: Expression, elseStatement?: Expression) {
        return new If(expression, thenStatement, elseStatement);
    }

    createWhile(expression: Expression, statement: Expression) {
        return new While(expression, statement);
    }

    createImportDeclaration(decorators: Decorator[] = [], modifiers: string[] = [], importClause: ImportClause=new ImportClause(), moduleSpecifier: StringLiteral) {
        if (moduleSpecifier.toString().indexOf("component_declaration/common") >= 0) {
            return "";
        }
        const context = this.getContext();
        if (context.defaultOptionsModule && context.dirname) {
            const relativePath = getModuleRelativePath(context.dirname, context.defaultOptionsModule);
            if (relativePath.toString()===moduleSpecifier.valueOf()) {
                context.defaultOptionsImport = new ImportDeclaration(decorators, modifiers, importClause, moduleSpecifier);
                return context.defaultOptionsImport;
            }
        }
        if (moduleSpecifier.toString().indexOf("component_declaration/jsx") >= 0) {
            const importString = moduleSpecifier.expression.toString().replace("component_declaration/jsx", "component_declaration/jsx-g")
            moduleSpecifier = new StringLiteral(importString);
        }

        const module = moduleSpecifier.expression.toString();
        if (context.dirname) {
            const modulePath = path.join(context.dirname, `${module}.tsx`);
            if (fs.existsSync(modulePath)) {
                compileCode(this, fs.readFileSync(modulePath).toString(), { dirname: context.dirname, path: modulePath });

                if (importClause) {
                    this.addComponent(importClause.default, this.cache[modulePath].find((e: any) => e instanceof ReactComponent), importClause);
                    const componentInputs:ComponentInput[] = this.cache[modulePath].filter((e: any) => e instanceof ComponentInput);
                    componentInputs.length && importClause.imports.forEach(i => {
                        const componentInput = componentInputs.find(c => c.name.toString() === i && c.modifiers.indexOf("export") >= 0);
                        if (componentInput) { 
                            this.addComponent(i, componentInput);
                        }
                    });
                }
            }
        }

        return new ImportDeclaration(decorators, modifiers, importClause, moduleSpecifier);
    }

    createImportSpecifier(propertyName: string | undefined, name: Identifier) {
        return name;
    }

    createNamedImports(node: Identifier[]) {
        return new NamedImports(node);
    }

    createImportClause(name?: Identifier, namedBindings?: NamedImports) {
        return new ImportClause(name, namedBindings);
    }

    createDecorator(expression: Call) {
        return new Decorator(expression);
    }

    createProperty(decorators: Decorator[], modifiers: string[] = [], name: Identifier, questionOrExclamationToken?: string, type?: TypeExpression, initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }

    createComponent(componentDecorator: Decorator, modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) { 
        return new ReactComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members, this.getContext());
    }

    createComponentBindings(decorators: Decorator[], modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) { 
        return new ComponentInput(decorators, modifiers, name, typeParameters, heritageClauses, members)
    }

    createClassDeclaration(decorators: Decorator[], modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) {
        const componentDecorator = decorators.find(d => d.name === "Component");
        let result: Class | ReactComponent | ComponentInput;
        if (componentDecorator) {
            result = this.createComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members);
            this.addComponent(name.toString(), result);
        } else if (decorators.find(d => d.name === "ComponentBindings")) {
            const componentInput = this.createComponentBindings(decorators, modifiers, name, typeParameters, heritageClauses, members);
            this.addComponent(name.toString(), componentInput);
            result = componentInput;
        } else {
            result = new Class(decorators, modifiers, name, typeParameters, heritageClauses, members);
        }

        return result;
    }

    createPropertyAccess(expression: Expression, name: Identifier) {
        return new PropertyAccess(expression, name);
    }

    createJsxExpression(dotDotDotToken: string="", expression: Expression) {
        return new JsxExpression(dotDotDotToken, expression);
    }

    createJsxAttribute(name: Identifier, initializer: Expression) {
        return new JsxAttribute(name, initializer);
    }

    createJsxSpreadAttribute(expression: Expression) {
        return new JsxSpreadAttribute(expression);
    }

    createJsxAttributes(properties: Array<JsxAttribute|JsxSpreadAttribute>) {
        return properties;
    }

    createJsxOpeningElement(tagName: Identifier, typeArguments: any[], attributes: Array<JsxAttribute|JsxSpreadAttribute>=[]) {
        return new JsxOpeningElement(tagName, typeArguments, attributes);
    }

    createJsxSelfClosingElement(tagName: Identifier, typeArguments: any[], attributes: Array<JsxAttribute|JsxSpreadAttribute>=[]) {
        return new JsxSelfClosingElement(tagName, typeArguments, attributes);
    }

    createJsxClosingElement(tagName: Identifier) {
        return new JsxClosingElement(tagName);
    }

    createJsxElement(openingElement: JsxOpeningElement, children: Array<JsxElement | string | JsxExpression | JsxSelfClosingElement>, closingElement: JsxClosingElement) {
        return new JsxElement(openingElement, children, closingElement);
    }

    createJsxText(text: string, containsOnlyTriviaWhiteSpaces: string) {
        return containsOnlyTriviaWhiteSpaces === "true" ? "" : text;
    }

    createFunctionTypeNode(typeParameters: any, parameters: Parameter[], type: TypeExpression) {
        return new FunctionTypeNode(typeParameters, parameters, type);
        
    }

    createExpressionStatement(expression: Expression) {
        return expression;
    }

    createMethod(decorators: Decorator[] = [], modifiers: string[] = [], asteriskToken: string, name: Identifier, questionToken: string, typeParameters: any, parameters: Parameter[], type: TypeExpression | undefined, body: Block) {
        return new Method(decorators, modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body);
    }

    createGetAccessor(decorators: Decorator[] = [], modifiers: string[] = [], name: Identifier, parameters: Parameter[], type?: TypeExpression, body?: Block) {
        return new GetAccessor(decorators, modifiers, name, parameters, type, body);
    }

    createPrefix(operator: string, operand: Expression) {
        return new Prefix(operator, operand);
    }

    createPostfix(operand: Expression, operator: string) {
        return new Postfix(operator, operand);
    }

    createNonNullExpression(expression: Expression) {
        return new NonNullExpression(expression);
    }

    createElementAccess(expression: Expression, index: Expression): Expression {
        return new ElementAccess(expression, index);
    }

    createPropertySignature(modifiers: string[]| undefined, name: Identifier, questionToken: string | undefined, type: string, initializer?: Expression) {
        return new PropertySignature(modifiers, name, questionToken, type, initializer);
    }

    createIndexSignature(decorators: Decorator[] | undefined, modifiers: string[]| undefined, parameters: Parameter[], type: TypeExpression) {
        return new IndexSignature(decorators, modifiers, parameters, type);
    }

    createTypeLiteralNode(members: PropertySignature[]) {
        return new TypeLiteralNode(members);
    }

    createLiteralTypeNode(literal: any) { 
        return literal;
    }

    createTypeAliasDeclaration(decorators: Decorator[]=[], modifiers: string[]=[], name: Identifier, typeParameters: any[]=[], type: TypeExpression) { 
        return `${modifiers.join(" ")} type ${name} = ${type}`;
    }

    createIntersectionTypeNode(types: string[]) {
        return types.join("&");
    }

    createTypeQueryNode(exprName: Expression) { 
        return `typeof ${exprName}`;
    }

    createUnionTypeNode(types: string[]) {
        return types.join("|");
    }

    createConditional(condition: Expression, whenTrue: Expression, whenFalse: Expression) {
        return new Conditional(condition, whenTrue, whenFalse);
    }

    createTemplateHead(text: string, rawText?: string) {
        return text;
    }
    createTemplateMiddle(text: string, rawText?: string) {
        return text;
    }
    createTemplateTail(text: string, rawText?: string) {
        return text;
    }

    createTemplateSpan(expression: Expression, literal: string) {
        return new TemplateSpan(expression, literal);
    }

    createTemplateExpression(head: string, templateSpans: TemplateSpan[]) {
        return new TemplateExpression(head, templateSpans);
    }

    createNoSubstitutionTemplateLiteral(text: string, rawText?: string) { 
        return new TemplateExpression(text, []);
    }

    createFor(initializer: Expression | undefined, condition: Expression | undefined, incrementor: Expression | undefined, statement: Expression) {
        return new For(initializer, condition, incrementor, statement);
    }

    createForIn(initializer: Expression, expression: Expression, statement: Expression) {
        return new ForIn(initializer, expression, statement);
    }

    createCaseClause(expression: Expression, statements: Expression[]) {
        return new CaseClause(expression, statements);
    }

    createDefaultClause(statements: Expression[]) {
        return new DefaultClause(statements);
    }

    createCaseBlock(clauses: Array<DefaultClause | CaseClause>) {
        return new CaseBlock(clauses);
    }

    createSwitch(expression: Expression, caseBlock: CaseBlock) {
        return new Switch(expression, caseBlock);
    }

    createComputedPropertyName(expression: Expression) {
        return new ComputedPropertyName(expression);
    }

    createDo(statement: Expression, expression: Expression) {
        return new Do(statement, expression);
    }

    createExpressionWithTypeArguments(typeArguments: TypeReferenceNode[] = [], expression: Expression) {
        return new ExpressionWithTypeArguments(typeArguments, expression);
    }

    createTypeOf(expression: Expression) {
        return new TypeOf(expression);
    }

    createVoid(expression: Expression) {
        return new Void(expression);
    }

    createHeritageClause(token: string, types: ExpressionWithTypeArguments[]) {
        return new HeritageClause(token, types, this.getContext());
    }

    createPropertyAccessChain(expression: Expression, questionDotToken: string|undefined, name: Expression) {
        return new PropertyAccessChain(expression, questionDotToken, name);
    }
    
    createCallChain(expression: Expression, questionDotToken: string | undefined, typeArguments: string[]| undefined, argumentsArray: Expression[] | undefined) {
        return new CallChain(expression, questionDotToken, typeArguments, argumentsArray);
    }

    createAsExpression(expression: Expression, type: TypeExpression) { 
        return new AsExpression(expression, type);
    }

    createRegularExpressionLiteral(text: string) { 
        return new SimpleExpression(text);
    }

    context: GeneratorContex[] = [];

    addComponent(name: string, component: Heritable, importClause?:ImportClause) {
        const context = this.getContext();
        context.components = context.components || {};
        context.components[name] = component;
    }

    getContext() {
        return this.context[this.context.length - 1] || { components: {} };
    }

    setContext(context: GeneratorContex | null) {
        if (!context) {
            this.context.pop();
        } else {
            this.context.push(context);
        }
    }

    cache: { [name: string]: any } = {};

    destination: string = "";

    defaultOptionsModule?: string;
}

export default new Generator();