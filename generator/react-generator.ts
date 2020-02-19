import SyntaxKind from "./syntaxKind";
import fs from "fs";
import path from "path";
import { compileCode } from "./component-compiler";
import { JsxElement } from "./angular-generator";

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


function getLocalStateName(name: Identifier | string) {
    return `__state_${name}`;
}

function getPropName(name: Identifier | string) {
    return `props.${name}`;
}

export interface toStringOptions {
    members: Array<Property | Method>;
    internalState: InternalState[];
    state: State[];
    props: Prop[];
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
}

export class Identifier extends SimpleExpression {
    constructor(name: string) {
        super(name);
    }

    valueOf() {
        return this.expression;
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

export class BindingElement {
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

export class Delete extends ExpressionWithExpression {
    toString(options?: toStringOptions) {
        return `${SyntaxKind.DeleteKeyword} ${super.toString()}`;
    }
}

export class BindingPattern {

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

    toString() {
        return `${this.name}${this.expression ? `:${this.expression}` : ""}`;
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
        return `${this.expression.toString(options)}${this.questionDotToken}${this.name.toString(options)}`;
    }

    getDependency() {
        return super.getDependency().concat(this.name.getDependency());
    }
}

export class Parameter {
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

export class Function extends Expression {
    decorators: Decorator[];
    modifiers: string[];
    asteriskToken: string;
    name: Identifier | undefined;
    typeParameters: string[];
    parameters: Parameter[];
    type: string;
    body: Block;
    constructor(decorators: Decorator[] = [], modifiers: string[] = [], asteriskToken: string, name: Identifier | undefined, typeParameters: string[] = [], parameters: Parameter[], type: string, body: Block) {
        super();
        this.decorators = decorators;
        this.modifiers = modifiers;
        this.asteriskToken = asteriskToken;
        this.name = name;
        this.typeParameters = typeParameters;
        this.parameters = parameters;
        this.type = type;
        this.body = body;
    }

    declaration() {
        return `${this.modifiers.join(" ")} function ${this.name || ""}(${
            this.parameters.map(p => p.declaration()).join(",")
            })${compileType(this.type)}${this.body}`;
    }

    toString() {
        return this.declaration();
    }
}

function checkDependency(expression: Expression, properties: Array<InternalState | State | Prop | Property | Method> = []) {
    const dependency = expression.getAllDependency().reduce((r: { [name: string]: boolean }, d) => {
        r[d] = true;
        return r;
    }, {});

    return properties.some(s => dependency[s.name.toString()]);
}

export class ArrowFunction extends Expression {
    modifiers: any[];
    typeParameters: string[];
    parameters: Parameter[];
    type: string;
    body: Block | Expression;
    equalsGreaterThanToken: string;
    constructor(modifiers: string[] = [], typeParameters: string[], parameters: Parameter[], type: string, equalsGreaterThanToken: string, body: Block | Expression) {
        super();
        this.modifiers = modifiers;
        this.typeParameters = typeParameters;
        this.parameters = parameters;
        this.type = type;
        this.body = body;
        this.equalsGreaterThanToken = equalsGreaterThanToken;
    }

    toString(options?: toStringOptions) {
        const bodyString = this.body.toString(options);
        return `${this.modifiers.join(" ")} (${this.parameters.map(p => p.declaration()).join(",")})${compileType(this.type)} ${this.equalsGreaterThanToken} ${bodyString}`;
    }

    getDependency() {
        return this.body.getDependency();
    }
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
            checkDependency(this.left, options.members) &&
            this.left.expression.toString() === SyntaxKind.ThisKeyword) {
            const rightExpression = this.right.toString(options);

            if (checkDependency(this.left, options.members.filter(m=>m.isReadOnly()))) {
                throw `Error: Can't assign property use TwoWay() or Internal State - ${this.toString()}`;
            }

            const stateSetting = `${this.left.compileStateSetting(rightExpression)}`
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

export class Property extends Expression {
    decorators: Decorator[]
    modifiers: string[];
    name: Identifier;
    questionOrExclamationToken: string;
    type: string;
    initializer?: Expression;
    inherited: boolean = false;

    constructor(decorators: Decorator[], modifiers: string[] = [], name: Identifier, questionOrExclamationToken: string = "", type: string = "", initializer?: Expression) {
        super();
        this.decorators = decorators;
        this.modifiers = modifiers;
        this.name = name;
        this.questionOrExclamationToken = questionOrExclamationToken;
        this.type = type;
        this.initializer = initializer;
    }

    typeDeclaration() {
        return `${this.name}${this.questionOrExclamationToken}:${this.type}`;
    }

    defaultDeclaration() {
        return `${this.name}:${this.initializer}`;
    }

    toString(options?: toStringOptions) {
        return this.name.toString();
    }

    getter() { 
        return this.name.toString();
    }

    isReadOnly() { 
        return !!this.decorators.find(d => d.name === "OneWay" || d.name === "Event");
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

    constructor(decorators: Decorator[] = [], modifiers: string[] = [], name: Identifier, typeParameters: any[], heritageClauses: HeritageClause[]=[], members: Array<Property | Method>) {
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

interface Heritable {
    name: string;
    heritageProperies: Property[];
    compileDefaultProps(): string;
    defaultPropsDest(): string;
}

export class ComponentInput extends Class implements Heritable {
    get heritageProperies() {
        return (this.members.filter(m => m instanceof Property) as Property[]).map(p => { 
            const property = new Property(p.decorators, p.modifiers, p.name, p.questionOrExclamationToken, p.type, p.initializer);
            property.inherited = true;
            return property
        });
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

export class TypeNode extends Expression {
    typeName: Identifier;
    typeArguments: string[];
    constructor(typeName: Identifier, typeArguments: string[] = []) {
        super();
        this.typeName = typeName;
        this.typeArguments = typeArguments;
    }
    toString() {
        const typeArguments = this.typeArguments.length ? `<${this.typeArguments.join(",")}>` : "";
        return `${this.typeName}${typeArguments}`;
    }
}

export class ExpressionWithTypeArguments extends ExpressionWithExpression {
    typeArguments: TypeNode[] = [];
    constructor(typeArguments: TypeNode[] = [], expression: Expression) {
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

        const findProperty = (p: InternalState | State | Prop) => p.name.valueOf() === this.name.valueOf();
        if (expressionString === SyntaxKind.ThisKeyword || expressionString === `${SyntaxKind.ThisKeyword}.props`) {
            const p = props.find(findProperty);
            if (p) {
                return p.getter();
            }

            const stateProp = state.find(findProperty);
            if (stateProp) {
                return `(${stateProp.getter()})`;
            }
        }

        if (expressionString === SyntaxKind.ThisKeyword) {
            if (internalState.findIndex(findProperty) >= 0) {
                return getLocalStateName(this.name);
            }
        }

        if (expressionString === SyntaxKind.ThisKeyword && (internalState.length + state.length + props.length) > 0) { 
            return this.name.toString();
        }

        return `${this.expression.toString(options)}.${this.name}`;
    }

    compileStateSetting(state: string) {
        return `${stateSetter(this.name)}(${state})`;
    }

    compileStateChangeRising(state: State[] = [], rightExpressionString: string) {
        return state.find(s => s.name.valueOf() === this.name.valueOf()) ? `props.${this.name}Change!(${rightExpressionString})` : "";
    }

    getDependency() {
        const expressionString = this.expression.toString();
        if (expressionString === SyntaxKind.ThisKeyword || expressionString === `${SyntaxKind.ThisKeyword}.props`) {
            return [this.name.toString()];
        }
        return this.expression.getDependency();
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
    constructor(decorators: Decorator[] = [], modifiers: string[] = [], asteriskToken: string, name: Identifier, questionToken: string = "", typeParameters: any[], parameters: Parameter[], type: string = "void", body: Block) {
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

    defaultDeclaration() { 
        return this.declaration();
    }

    declaration(prefix = "", options?: toStringOptions) {
        return `${prefix} ${this.name}(${this.parametersTypeDeclaration()})${this.body.toString(options)}`;
    }

    arrowDeclaration(options?:any) {
        return `(${this.parametersTypeDeclaration()})=>${this.body.toString(options)}`
    }

    getDependency(properties: Array<State | Prop | InternalState> = []) {
        const dependency = this.body.getDependency();

        return Object.keys(dependency.reduce((k: any, d) => {
            if (!k[d]) {
                k[d] = d;
            }
            return k;
        }, {})).map(d => properties.find(p => p.name.toString() === d)).filter(d => d).reduce((d: string[], p) => d.concat(p!.getDependecy()), [])
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

export class Prop {
    property: Property;
    constructor(property: Property) {
        if (property.decorators.find(d => d.name === "Template")) {
            property.name = new Identifier(property.name.toString().replace("template", "render"));
            property.name = new Identifier(property.name.toString().replace("Template", "Render"));
        }
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

    setter(value: any) {
        return `prop.${this.name}`;
    }
}

export class Ref extends Prop {
    defaultProps() {
        return "";
    }

    typeDeclaration() {
        return `${this.name}:any`;
    }

    defaultDeclaration() {
        return "";
    }

    getter() {
        return `${this.name}.current!`;
    }

    getDependecy() {
        return [this.name.toString()];
    }

    setter(value: any) {
        return "";
    }
}

export class Slot extends Prop {
    constructor(property: Property) {
        super(property);
        property.name = new Identifier(property.name.toString().replace("default", "children"));
    }

    typeDeclaration() {
        return `${this.name}${this.property.questionOrExclamationToken}:React.ReactNode`;
    }

    defaultDeclaration() {
        return "";
    }

    setter(value: any) {
        return "";
    }
}

export class InternalState extends Prop {
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

export class State extends InternalState {
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

function stateSetter(stateName: Identifier) {
    return `__state_set${capitalizeFirstLetter(stateName)}`
}

export class ReactComponent {
    props: Prop[] = [];
    state: State[] = [];
    internalState: InternalState[];
    refs: Ref[];
    events: Property[] = [];

    modifiers: string[];
    _name: Identifier;

    listeners: Listener[];
    methods: Method[];
    effects: Method[];
    slots: Slot[];

    view: any;
    viewModel: any;
    heritageClauses: HeritageClause[];

    members: Array<Property | Method>;

    get name() { 
        return this._name.toString();
    }

    constructor(decorator: Decorator, modifiers: string[] = [], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[] = [], members: Array<Property | Method>) {
        this.modifiers = modifiers;
        this._name = name;
        this.heritageClauses = heritageClauses;

        this.members = members = inheritMembers(heritageClauses, members);

        this.props = members
            .filter(m => m.decorators.find(d => d.name === "OneWay" || d.name === "Event" || d.name === "Template"))
            .map(p => new Prop(p as Property))


        this.refs = members.filter(m => m.decorators.find(d => d.name === "Ref"))
            .map(p => new Ref(p as Property));

        this.internalState = members
            .filter(m => m instanceof Property && (m.decorators.length === 0 || m.decorators.find(d => d.name === "InternalState")))
            .map(p => new InternalState(p as Property));

        this.state = members.filter(m => m.decorators.find(d => d.name === "TwoWay"))
            .map(s => new State(s as Property));

        this.methods = members.filter(m => m instanceof Method && m.decorators.length === 0) as Method[];

        this.listeners = members.filter(m => m.decorators.find(d => d.name === "Listen"))
            .map(m => new Listener(m as Method));

        this.effects = members.filter(m => m.decorators.find(d => d.name === "Effect")) as Method[];

        this.slots = members.filter(m => m.decorators.find(d => d.name === "Slot")).map(m => new Slot(m as Property));

        const parameters = (decorator.expression.arguments[0] as ObjectLiteral);

        this.view = parameters.getProperty("view");
        this.viewModel = parameters.getProperty("viewModel");
    }

    get heritageProperies() {
        return this.props.map(p => p.property)
            .concat(this.state.map(s => s.property))
            .map(p => {
                const property = new Property(p.decorators, p.modifiers, p.name, p.questionOrExclamationToken, p.type, p.initializer);
                property.inherited = true;
                return property;
            });
    }

    compileImportStatements(hooks: string[]) {
        if (hooks.length) {
            return [`import React, {${hooks.join(",")}} from 'react';`];
        }
        return ["import React from 'react'"];
    }

    compileImports() {
        const imports: string[] = [];
        const hooks: string[] = [];

        if (this.internalState.length || this.state.length) {
            hooks.push("useState");
        }

        if (this.listeners.length || this.methods.length) {
            hooks.push("useCallback");
        }

        if (this.listeners.filter(l => l.target).length || this.effects.length) {
            hooks.push("useEffect");
        }

        if (this.refs.length) {
            hooks.push("useRef");
        }

        return imports.concat(this.compileImportStatements(hooks)).join(";\n");
    }

    defaultPropsDest() {
        return `${this.name.toString()}.defaultProps`;
    }

    compileDefaultProps() {
        const defaultProps = this.props.filter(p => !p.property.inherited && p.property.initializer).concat(this.state);
        const heritageDefaultProps = this.heritageClauses.filter(h => h.defaultProps.length).map(h => `...${h.defaultProps}`);

        if (defaultProps.length) {
            return `${this.defaultPropsDest()} = {
                ${heritageDefaultProps.join(",") + (heritageDefaultProps.length ? "," : "")}
                ${defaultProps.map(p => p.defaultProps())
                    .join(",\n")}
            }`;
        } else if (heritageDefaultProps.length) {
            return `${this.defaultPropsDest()} = {${heritageDefaultProps.join(",")}}`;
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
                props: this.props.concat(this.refs)
            })).join(";\n");
        }
        return "";
    }

    compileUseEffect() {
        const subscriptions = this.listeners.filter(m => m.target);

        const effects = this.effects;

        const effectsString = effects.map(e => `useEffect(${e.arrowDeclaration({
            internalState: this.internalState, state: this.state, props: this.props.concat(this.refs)
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

    compileUseRef() {
        return this.refs.map(r => {
            return `const ${r.name}=useRef<${r.type}>()`;
        }).join(";\n");
    }

    compileComponentInterface() {

        const props = this.isJSXComponent ? [`props: {
            ${this.props
            
            .concat(this.state)
                .map(p => p.typeDeclaration()).join(";\n")}
            }`] : this.props
                .concat(this.state)
                .map(p => p.typeDeclaration());

        return `interface ${this.name}{
            ${  props
                .concat(this.internalState.concat(this.refs).concat(this.slots).map(p => p.typeDeclaration()))
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
            .concat(this.methods.map(m => m.name.toString()));
    }

    toString() {
        return `
            ${this.compileImports()}
            ${this.compileComponentInterface()}

            ${this.modifiers.join(" ")} function ${this.name}(props: {
                    ${this.props
                .concat(this.state)
                .concat(this.slots)
                .map(p => p.typeDeclaration()).join(",\n")}
                }
            ){
                ${this.compileUseRef()}
                ${this.stateDeclaration()}
                ${this.listenersDeclaration()}
                ${this.compileUseEffect()}
                ${this.methods.map(m => {
                    return `const ${m.name}=useCallback(${m.declaration("function", {
                        members: this.members,
                        internalState: this.internalState, state: this.state, props:this.props.concat(this.refs)
                    })}, [${
                        m.getDependency(this.internalState.concat(this.state).concat(this.props))
                    }]);`;
                }).join("\n")}
                return ${this.view}(${this.viewModel}({
                        ${ this.compileViewModelArguments().join(",\n")}
                    })
                );
            }

            ${this.compileDefaultProps()}`;
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
        return `${super.toString(options)}!`;
    }
}

export class VariableDeclaration extends Expression {
    name: Identifier;
    type: string;
    initializer?: Expression | string;

    constructor(name: Identifier, type: string = "", initializer?: Expression | string) {
        super();
        this.name = name;
        this.type = type;
        this.initializer = initializer;
    }

    toString(options?: toStringOptions) {
        const initilizerDeclaration = this.initializer ? `=${this.initializer.toString(options)}` : "";
        return `${this.name}${compileType(this.type)}${initilizerDeclaration}`;
    }

    getDependency() {
        if (this.initializer && typeof this.initializer !== "string") {
            return this.initializer.getDependency();
        }
        return [];
    }
}

export class VariableDeclarationList extends Expression {
    declarations: VariableDeclaration[];
    flags: string;

    constructor(declarations: VariableDeclaration[] = [], flags: string) {
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
    type: string;
    constructor(decorators: Decorator[] = [], modifiers: string[] = [], parameters: Parameter[], type: string) {
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
        return `\${${super.toString(options)}}${this.literal}`;
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
        return `\`${this.head}${this.templateSpans.map(s => s.toString(options)).join("")}\``;
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
    elements?: any[];
    constructor(node: Identifier[] = [], elements?: any[]) {
        this.node = node;
        this.elements = elements;
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

export class JsxAttribute { 
    name: Identifier;
    initializer: Expression;
    constructor(name: Identifier, initializer: Expression) { 
        this.name = name;
        this.initializer = initializer;
    }

    toString() { 
        const name = this.name.toString();
        return `${(eventsDictionary as any)[name] || this.name.toString()}=${this.initializer}`;
    }
}

export class JsxOpeningElement extends Expression { 
    tagName: Identifier;
    typeArguments: any[];
    attributes: JsxAttribute[];

    constructor(tagName: Identifier, typeArguments: any[] = [], attributes: JsxAttribute[]) { 
        super();
        this.tagName = tagName;
        this.typeArguments = typeArguments;
        this.attributes = attributes;
    }

    attributesString() { 
        return this.attributes.map(a => a.toString()).join("\n");
    }

    toString() { 
        return `<${this.tagName} ${this.attributesString()}>`;
    }

    addAttribute(attribute: JsxAttribute) { 
        this.attributes.push(attribute);
    }

    isJsx() { 
        return true
    }
}

export class JsxSelfClosingElement extends JsxOpeningElement{
    toString() { 
        return `<${this.tagName} ${this.attributesString()}/>`;
    }
 }

export class JsxExpression extends ExpressionWithExpression { 
    dotDotDotToken: string;
    constructor(dotDotDotToken: string="", expression: Expression) {
        super(expression);
        this.dotDotDotToken = dotDotDotToken;
    }

    toString() { 
        return `{${this.dotDotDotToken}${this.expression}}`;
    }

    isJsx() { 
        return true;
    }
}

export interface GeneratorContex {
    path?: string;
    components?: { [name: string]: Heritable };
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

    createVariableDeclaration(name: Identifier, type: string = "", initializer?: Expression | string): VariableDeclaration {
        return new VariableDeclaration(name, type, initializer);
    }

    createVariableDeclarationList(declarations: VariableDeclaration[] = [], flags: string) {
        if (flags === undefined) {
            throw "createVariableDeclarationList";
        }
        return new VariableDeclarationList(declarations, flags);
    }

    createVariableStatement(modifiers: string[] = [], declarationList: VariableDeclarationList): Expression {
        return new VariableStatement(modifiers, declarationList);
    }

    createStringLiteral(value: string) {
        return new StringLiteral(value);
    }

    createBindingElement(dotDotDotToken?: any, propertyName?: string, name?: string, initializer?: Expression) {
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
        if (kind === undefined) {
            throw "createKeyword"
        }
        return kind;
    }

    createArrayTypeNode(elementType: string) {
        if (elementType === undefined) {
            throw "createArrayTypeNode"
        }
        return `${elementType}[]`;
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
        return new Function(decorators, modifiers, asteriskToken, name, typeParameters, parameters, type, body);
    }

    createParameter(decorators: Decorator[] = [], modifiers: string[] = [], dotDotDotToken: any, name: Identifier, questionToken?: string, type?: string, initializer?: Expression) {
        return new Parameter(decorators, modifiers, dotDotDotToken, name, questionToken, type, initializer);
    }

    createReturn(expression: Expression) {
        return new ReturnStatement(expression);
    }

    createFunctionExpression(modifiers: string[] = [], asteriskToken: string, name: Identifier | undefined, typeParameters: string[], parameters: Parameter[], type: string, body: Block) {
        return new Function([], modifiers, asteriskToken, name, typeParameters, parameters, type, body);
    }

    createToken(token: string) {
        if (token === undefined) {
            throw "unknown token";
        }
        if (typeof token === "number") {
            const tokenName = Object.keys(SyntaxKind).find(k => (SyntaxKind as any)[k] === token);
            throw `${tokenName} is missed`;
        }
        return token;
    }

    createArrowFunction(modifiers: string[] = [], typeParameters: string[] = [], parameters: Parameter[], type: string = "", equalsGreaterThanToken: string, body: Block | Expression) {
        return new ArrowFunction(modifiers, typeParameters, parameters, type, equalsGreaterThanToken, body);
    }

    createModifier(modifier: string) {
        if (modifier === undefined) {
            throw "createModifier";
        }
        if (typeof modifier === "number") {
            const modifierName = Object.keys(SyntaxKind).find(k => (SyntaxKind as any)[k] === modifier);
            throw `${modifierName} is missed`;
        }
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

    createTypeReferenceNode(typeName: Identifier, typeArguments: string[] = []) {
        return new TypeNode(typeName, typeArguments);
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
        if (moduleSpecifier.toString().indexOf("component_declaration/jsx") >= 0) {
            const importString = moduleSpecifier.expression.toString().replace("component_declaration/jsx", "component_declaration/jsx-g")
            moduleSpecifier = new StringLiteral(importString);
        }

        const module = moduleSpecifier.expression.toString();
        const context = this.getContext();
        if (context.path) {
            const modulePath = path.join(context.path, `${module}.tsx`);
            if (fs.existsSync(modulePath)) {
                compileCode(this, fs.readFileSync(modulePath).toString(), { dirname: context.path, path: modulePath });

                if (importClause) {
                    this.addComponent(importClause.default, this.cache[modulePath].find((e: any) => e instanceof ReactComponent));
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

        return `import ${importClause}${moduleSpecifier}`;
    }

    createImportSpecifier(propertyName: string | undefined, name: Identifier) {
        return name;
    }

    createNamedImports(node: Identifier[] = [], elements?: any[]) {
        return new NamedImports(node, elements);
    }

    createImportClause(name?: Identifier, namedBindings?: NamedImports) {
        return new ImportClause(name, namedBindings);
    }

    createDecorator(expression: Call) {
        return new Decorator(expression);
    }

    createProperty(decorators: Decorator[], modifiers: string[] = [], name: Identifier, questionOrExclamationToken: string = "", type: string = "", initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }

    createComponent(componentDecorator: Decorator, modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) { 
        return new ReactComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members);
    }

    createComponentBindings(decorators: Decorator[], modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) { 
        return new ComponentInput(decorators, modifiers, name, typeParameters, heritageClauses, members)
    }

    createClassDeclaration(decorators: Decorator[], modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) {
        const componentDecorator = decorators.find(d => d.name === "Component");
        let result: Class | ReactComponent | ComponentInput;
        if (componentDecorator) {
            result = this.createComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members);
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

    createJsxExpression(dotDotDotToken: string, expression: Expression) {
        return new JsxExpression(dotDotDotToken, expression);
    }

    createJsxAttribute(name: Identifier, initializer: Expression) {
        return new JsxAttribute(name, initializer);
    }

    createJsxSpreadAttribute(expression: Expression) {
        return new JsxExpression(this.SyntaxKind.DotDotDotToken, expression);
    }

    createJsxAttributes(properties: JsxAttribute[]) {
        return properties;
    }

    createJsxOpeningElement(tagName: Identifier, typeArguments: any[], attributes: JsxAttribute[]=[]) {
        return new JsxOpeningElement(tagName, typeArguments, attributes);
    }

    createJsxSelfClosingElement(tagName: Identifier, typeArguments: any[], attributes: JsxAttribute[]=[]) {
        return new JsxSelfClosingElement(tagName, typeArguments, attributes);
    }

    createJsxClosingElement(tagName: Identifier) {
        return `</${tagName}>`;
    }

    createJsxElement(openingElement: JsxOpeningElement, children: JsxElement[], closingElement: string): Expression {
        return new SimpleExpression(`${openingElement}${children.join("\n")}${closingElement}`
            .replace(/(\.default)(\W+)/g, ".children$2")
            .replace(/template/g, "render")
            .replace(/(.+)(Template)/g, "$1Render"));
    }

    createJsxText(text: string, containsOnlyTriviaWhiteSpaces: string) {
        return containsOnlyTriviaWhiteSpaces ? "" : text;
    }

    createFunctionTypeNode(typeParameters: any, parameters: Parameter[], type: string) {
        return `(${parameters.map(p => p.declaration())})=>${type}`;
    }

    createExpressionStatement(expression: Expression) {
        return expression;
    }

    createMethod(decorators: Decorator[], modifiers: string[], asteriskToken: string, name: Identifier, questionToken: string, typeParameters: any, parameters: Parameter[], type: string, body: Block) {
        return new Method(decorators, modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body);
    }

    createPrefix(operator: string, operand: Expression) {
        if (operator === undefined) {
            throw "createPrefix";
        }
        return new Prefix(operator, operand);
    }

    createPostfix(operand: Expression, operator: string) {
        if (operator === undefined) {
            throw "createPrefix";
        }
        return new Postfix(operator, operand);
    }

    createNonNullExpression(expression: Expression) {
        return new NonNullExpression(expression);
    }

    createElementAccess(expression: Expression, index: Expression): Expression {
        return new ElementAccess(expression, index);
    }

    createPropertySignature(modifiers: string[] = [], name: Identifier, questionToken: string | undefined, type: string, initializer?: Expression) {
        return new PropertySignature(modifiers, name, questionToken, type, initializer);
    }

    createIndexSignature(decorators: Decorator[] | undefined, modifiers: string[] = [], parameters: Parameter[], type: string) {
        return new IndexSignature(decorators, modifiers, parameters, type);
    }

    createTypeLiteralNode(members: PropertySignature[]) {
        return `{${members.join(",")}}`;
    }

    createLiteralTypeNode(literal: any) { 
        return literal;
    }

    createTypeAliasDeclaration(decorators: Decorator[]=[], modifiers: string[]=[], name: Identifier, typeParameters: any[]=[], type: string) { 
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

    createExpressionWithTypeArguments(typeArguments: TypeNode[] = [], expression: Expression) {
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

    createCallChain(expression: Expression, questionDotToken: string = "", typeArguments: string[] = [], argumentsArray: Expression[] = []) {
        return new CallChain(expression, questionDotToken, typeArguments, argumentsArray);
    }

    context: GeneratorContex[] = [];

    addComponent(name: string, component: Heritable) {
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
}

export default new Generator();