import SyntaxKind from "./syntaxKind";
import fs from "fs";
import path from "path";
import { compileCode } from "../component-compiler";
import { ImportDeclaration, ImportClause, NamedImports } from "./expressions/import";
import { SimpleExpression, Expression } from "./expressions/base";
import { Identifier, New, Delete, Paren, Call, NonNullExpression, TypeOf, Void, CallChain, AsExpression } from "./expressions/common";
import {
    JsxExpression,
    JsxAttribute,
    JsxSpreadAttribute,
    JsxOpeningElement,
    JsxSelfClosingElement,
    JsxClosingElement,
    JsxElement
} from "./expressions/jsx";
import { Parameter, ArrowFunction, Function } from "./expressions/functions";
import {
    TypeExpression,
    FunctionTypeNode,
    TypeReferenceNode,
    SimpleTypeExpression,
    ArrayTypeNode,
    PropertySignature,
    IndexSignature,
    TypeLiteralNode,
    IntersectionTypeNode,
    UnionTypeNode,
    TypeQueryNode,
    ParenthesizedType,
    LiteralTypeNode
} from "./expressions/type";
import { Method, GetAccessor, Property } from "./expressions/class-members";
import { For, ForIn, Do, While } from "./expressions/cycle";
import { CaseClause, DefaultClause, CaseBlock, Switch, If, Conditional } from "./expressions/conditions";
import { ShorthandPropertyAssignment, SpreadAssignment, PropertyAssignment } from "./expressions/property-assignment";
import { Binary, Prefix, Postfix } from "./expressions/operators";
import { ReturnStatement, Block } from "./expressions/statements";
import { GeneratorContext } from "./types";
import { VariableDeclaration, VariableDeclarationList, VariableStatement } from "./expressions/variables";
import { StringLiteral, ArrayLiteral, ObjectLiteral, NumericLiteral } from "./expressions/literal";
import { Class, HeritageClause } from "./expressions/class";
import { TemplateSpan, TemplateExpression } from "./expressions/template";
import { ComputedPropertyName, PropertyAccess, ElementAccess, PropertyAccessChain, Spread } from "./expressions/property-access";
import { BindingPattern, BindingElement } from "./expressions/binding-pattern";
import { ComponentInput } from "./expressions/component-input";
import { Component } from "./expressions/component";
import { ExpressionWithTypeArguments } from "./expressions/type";
import { getModuleRelativePath } from "./utils/path-utils";
import { Decorator } from "./expressions/decorator";

export default class Generator {
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
        return new NumericLiteral(value);
    }

    createVariableDeclaration(name: Identifier| BindingPattern, type?: TypeExpression, initializer?: Expression) {
        if (initializer) {
            this.addViewFunction(name.toString(), initializer);
        }
        return this.createVariableDeclarationCore(name, type, initializer);
    }

    createVariableDeclarationCore(name: Identifier | BindingPattern, type?: TypeExpression, initializer?: Expression) {
        return new VariableDeclaration(name, type, initializer);
    }

    createVariableDeclarationList(declarations: VariableDeclaration[], flags?: string) {
        return new VariableDeclarationList(declarations, flags);
    }

    createVariableStatement(modifiers: string[]| undefined, declarationList: VariableDeclarationList) {
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

    createObjectLiteral(properties: Array<PropertyAssignment | ShorthandPropertyAssignment | SpreadAssignment>, multiLine: boolean) {
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

    createEmptyStatement() { 
        return new SimpleExpression("");
    }

    createDebuggerStatement() {
        return new SimpleExpression(SyntaxKind.DebuggerKeyword);
    }

    createBlock(statements: Expression[], multiLine: boolean) {
        return new Block(statements, multiLine);
    }

    createFunctionDeclaration(decorators: Decorator[] | undefined, modifiers: string[] | undefined, asteriskToken: string, name: Identifier, typeParameters: any, parameters: Parameter[], type: TypeExpression | undefined, body: Block) {
        const functionDeclaration = this.createFunctionDeclarationCore(decorators, modifiers, asteriskToken, name, typeParameters, parameters, type, body);
        this.addViewFunction(functionDeclaration.name!.toString(), functionDeclaration);
        return functionDeclaration;
    }

    createFunctionDeclarationCore(decorators: Decorator[]|undefined, modifiers: string[]|undefined, asteriskToken: string, name: Identifier|undefined, typeParameters: any, parameters: Parameter[], type: TypeExpression|undefined, body: Block) {
        return new Function(decorators, modifiers, asteriskToken, name, typeParameters, parameters, type, body, this.getContext());
    }

    createParameter(decorators: Decorator[] = [], modifiers: string[] = [], dotDotDotToken: any, name: Identifier|BindingPattern, questionToken?: string, type?: TypeExpression, initializer?: Expression) {
        return new Parameter(decorators, modifiers, dotDotDotToken, name, questionToken, type, initializer);
    }

    createReturn(expression: Expression) {
        return new ReturnStatement(expression);
    }

    createFunctionExpression(modifiers: string[] = [], asteriskToken: string, name: Identifier | undefined, typeParameters: any, parameters: Parameter[], type: TypeExpression|undefined, body: Block) {
        return this.createFunctionDeclarationCore([], modifiers, asteriskToken, name, typeParameters, parameters, type, body);
    }

    createToken(token: string) {
        return token;
    }

    createArrowFunction(modifiers: string[]|undefined, typeParameters: any, parameters: Parameter[], type: TypeExpression|undefined, equalsGreaterThanToken: string, body: Block | Expression) {
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

    createCall(expression: Expression, typeArguments: any, argumentsArray?: Expression[]) {
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

    createImportDeclaration(decorators: Decorator[]|undefined, modifiers: string[]|undefined, importClause: ImportClause=new ImportClause(), moduleSpecifier: StringLiteral) {
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
            const modulePath = path.join(context.dirname, module.endsWith(".tsx") ? module : `${module}.tsx`);
            if (fs.existsSync(modulePath)) {
                compileCode(this, fs.readFileSync(modulePath).toString(), { dirname: context.dirname, path: modulePath });

                this.addComponent(importClause.default, this.cache[modulePath].find((e: any) => e instanceof Component), importClause);
                const componentInputs: ComponentInput[] = this.cache[modulePath].filter((e: any) => e instanceof ComponentInput);
                componentInputs.length && importClause.imports.forEach(i => {
                    const componentInput = componentInputs.find(c => c.name.toString() === i && c.modifiers.indexOf("export") >= 0);
                    if (componentInput) {
                        this.addComponent(i, componentInput);
                    }
                });
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
        return new Decorator(expression, this.getContext());
    }

    createProperty(decorators: Decorator[], modifiers: string[] | undefined, name: Identifier, questionOrExclamationToken?: string, type?: TypeExpression, initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }

    createComponent(componentDecorator: Decorator, modifiers: string[]|undefined, name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) { 
        return new Component(componentDecorator, modifiers, name, typeParameters, heritageClauses, members, this.getContext());
    }

    createComponentBindings(decorators: Decorator[], modifiers: string[]|undefined, name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) { 
        return new ComponentInput(decorators, modifiers, name, typeParameters, heritageClauses, members)
    }

    createClassDeclaration(decorators: Decorator[]=[], modifiers: string[]|undefined, name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) {
        const componentDecorator = decorators.find(d => d.name === "Component");
        let result: Class | Component | ComponentInput;
        if (componentDecorator) {
            result = this.createComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members);
            this.addComponent(name.toString(), result as Component);
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

    createJsxOpeningElement(tagName: Identifier, typeArguments: any[], attributes?: Array<JsxAttribute|JsxSpreadAttribute>) {
        return new JsxOpeningElement(tagName, typeArguments, attributes);
    }

    createJsxSelfClosingElement(tagName: Identifier, typeArguments: any[], attributes?: Array<JsxAttribute|JsxSpreadAttribute>) {
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

    createMethod(decorators: Decorator[] = [], modifiers: string[] = [], asteriskToken: string|undefined, name: Identifier, questionToken: string | undefined, typeParameters: any, parameters: Parameter[], type: TypeExpression | undefined, body: Block) {
        return new Method(decorators, modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body);
    }

    createGetAccessor(decorators: Decorator[]|undefined, modifiers: string[]|undefined, name: Identifier, parameters: Parameter[], type?: TypeExpression, body?: Block) {
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

    createSpread(expression: Expression) { 
        return new Spread(expression);
    }

    createPropertySignature(modifiers: string[] | undefined, name: Identifier, questionToken: string | undefined, type?: TypeExpression, initializer?: Expression) {
        return new PropertySignature(modifiers, name, questionToken, type, initializer);
    }

    createIndexSignature(decorators: Decorator[] | undefined, modifiers: string[]| undefined, parameters: Parameter[], type: TypeExpression) {
        return new IndexSignature(decorators, modifiers, parameters, type);
    }

    createTypeLiteralNode(members: PropertySignature[]) {
        return new TypeLiteralNode(members);
    }

    createLiteralTypeNode(literal: Expression) { 
        return new LiteralTypeNode(literal);
    }

    createTypeAliasDeclaration(decorators: Decorator[]|undefined, modifiers: string[]=[], name: Identifier, typeParameters: any, type: TypeExpression) { 
        return `${modifiers.join(" ")} type ${name} = ${type}`;
    }

    createIntersectionTypeNode(types: TypeExpression[]) {
        return new IntersectionTypeNode(types);
    }

    createUnionTypeNode(types: TypeExpression[]) {
        return new UnionTypeNode(types);
    }

    createTypeQueryNode(exprName: Expression) { 
        return new TypeQueryNode(exprName);
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

    createExpressionWithTypeArguments(typeArguments: TypeReferenceNode[] | undefined, expression: Expression) {
        return new ExpressionWithTypeArguments(typeArguments, expression);
    }

    createTypeOf(expression: Expression) {
        return new TypeOf(expression);
    }

    createParenthesizedType(expression: TypeExpression) { 
        return new ParenthesizedType(expression);
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
    
    createCallChain(expression: Expression, questionDotToken: string | undefined, typeArguments: any, argumentsArray: Expression[] | undefined) {
        return new CallChain(expression, questionDotToken, typeArguments, argumentsArray);
    }

    createAsExpression(expression: Expression, type: TypeExpression) { 
        return new AsExpression(expression, type);
    }

    createRegularExpressionLiteral(text: string) { 
        return new SimpleExpression(text);
    }

    context: GeneratorContext[] = [];

    addComponent(name: string, component: Component| ComponentInput, importClause?:ImportClause) {
        const context = this.getContext();
        context.components = context.components || {};
        context.components[name] = component;
    }

    getInitialContext(): GeneratorContext {
        return {
            defaultOptionsModule: this.defaultOptionsModule && path.resolve(this.defaultOptionsModule)
        };
    }

    getContext() {
        return this.context[this.context.length - 1] || { components: {} };
    }

    setContext(context: GeneratorContext | null) {
        if (!context) {
            this.context.pop();
        } else {
            this.context.push(context);
        }
    }

    addViewFunction(name: string, f: any) {
        if ((f instanceof Function || f instanceof ArrowFunction) && f.isJsx()) {
            const context = this.getContext();
            context.viewFunctions = context.viewFunctions || {};
            context.viewFunctions[name] = f;
        }
    }

    cache: { [name: string]: any } = {};

    destination: string = "";

    defaultOptionsModule?: string;

    generate(factory: any): { path?: string, code: string }[] {
        const result: { path?: string, code: string }[] = []
        const codeFactoryResult = factory(this);
        const { path } = this.getContext()
        if(path) {
            this.cache[path] = codeFactoryResult;
        }
        result.push({ path: path && this.processSourceFileName(path), code: codeFactoryResult.join("\n") })

        return result;
    }
}
