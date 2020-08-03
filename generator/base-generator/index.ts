import SyntaxKind from "./syntaxKind";
import fs from "fs";
import path from "path";
import { compileCode } from "../component-compiler";
import {
  ImportDeclaration,
  ImportClause,
  NamedImportBindings,
  NamedImports,
  NamespaceImport,
  ImportSpecifier,
} from "./expressions/import";
import { SimpleExpression, Expression } from "./expressions/base";
import {
  Identifier,
  New,
  Delete,
  Paren,
  Call,
  NonNullExpression,
  TypeOf,
  Void,
  CallChain,
  AsExpression,
} from "./expressions/common";
import {
  JsxExpression,
  JsxAttribute,
  JsxSpreadAttribute,
  JsxOpeningElement,
  JsxSelfClosingElement,
  JsxClosingElement,
  JsxElement,
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
  LiteralTypeNode,
  IndexedAccessTypeNode,
  QualifiedName,
  MethodSignature,
  TypeOperatorNode,
  TypeAliasDeclaration,
  TypePredicateNode,
  InferTypeNode,
  TupleTypeNode,
  ConditionalTypeNode,
} from "./expressions/type";
import {
  Method,
  GetAccessor,
  Property,
  Constructor,
} from "./expressions/class-members";
import { For, ForIn, Do, While } from "./expressions/cycle";
import {
  CaseClause,
  DefaultClause,
  CaseBlock,
  Switch,
  If,
  Conditional,
} from "./expressions/conditions";
import {
  ShorthandPropertyAssignment,
  SpreadAssignment,
  PropertyAssignment,
} from "./expressions/property-assignment";
import { Binary, Prefix, Postfix } from "./expressions/operators";
import { ReturnStatement, Block } from "./expressions/statements";
import { GeneratorContext, GeneratorOptions, GeneratorCache } from "./types";
import {
  VariableDeclaration,
  VariableDeclarationList,
  VariableStatement,
} from "./expressions/variables";
import {
  StringLiteral,
  ArrayLiteral,
  ObjectLiteral,
  NumericLiteral,
} from "./expressions/literal";
import { Class, HeritageClause } from "./expressions/class";
import { TemplateSpan, TemplateExpression } from "./expressions/template";
import {
  ComputedPropertyName,
  PropertyAccess,
  ElementAccess,
  PropertyAccessChain,
  Spread,
} from "./expressions/property-access";
import { BindingPattern, BindingElement } from "./expressions/binding-pattern";
import {
  ComponentInput,
  membersFromTypeDeclaration,
} from "./expressions/component-input";
import { Component } from "./expressions/component";
import { ExpressionWithTypeArguments } from "./expressions/type";
import { getModuleRelativePath, resolveModule } from "./utils/path-utils";
import { Decorator } from "./expressions/decorator";
import { Interface } from "./expressions/interface";
import { Throw } from "./expressions/throw";
import { Decorators } from "../component_declaration/decorators";
import { TypeParameterDeclaration } from "./expressions/type-parameter-declaration";
import prettier from "prettier";
import { GeneratorAPI, GeneratorResult } from "./generator-api";
import {
  ExportDeclaration,
  ExportSpecifier,
  NamedExports,
} from "./expressions/export";
import { Enum, EnumMember } from "./expressions/enum";

export default class Generator implements GeneratorAPI {
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

  createVariableDeclaration(
    name: Identifier | BindingPattern,
    type?: TypeExpression,
    initializer?: Expression
  ) {
    if (initializer) {
      this.addViewFunction(name.toString(), initializer);
    }
    return this.createVariableDeclarationCore(name, type, initializer);
  }

  createVariableDeclarationCore(
    name: Identifier | BindingPattern,
    type?: TypeExpression,
    initializer?: Expression
  ) {
    return new VariableDeclaration(name, type, initializer);
  }

  createVariableDeclarationList(
    declarations: VariableDeclaration[],
    flags?: string
  ) {
    return new VariableDeclarationList(declarations, flags);
  }

  createVariableStatement(
    modifiers: string[] | undefined,
    declarationList: VariableDeclarationList
  ) {
    return new VariableStatement(modifiers, declarationList);
  }

  createStringLiteral(value: string) {
    return new StringLiteral(value);
  }

  createBindingElement(
    dotDotDotToken: string = "",
    propertyName: Identifier | undefined,
    name: string | Identifier | BindingPattern,
    initializer?: Expression
  ) {
    return new BindingElement(dotDotDotToken, propertyName, name, initializer);
  }

  createArrayBindingPattern(elements: Array<BindingElement>) {
    return new BindingPattern(elements, "array");
  }

  createArrayLiteral(elements: Expression[], multiLine: boolean): Expression {
    return new ArrayLiteral(elements, multiLine);
  }

  createObjectLiteral(
    properties: Array<
      PropertyAssignment | ShorthandPropertyAssignment | SpreadAssignment
    >,
    multiLine: boolean
  ) {
    return new ObjectLiteral(properties, multiLine);
  }

  createObjectBindingPattern(elements: BindingElement[]) {
    return new BindingPattern(elements, "object");
  }

  createPropertyAssignment(
    key: Identifier | ComputedPropertyName,
    value: Expression
  ) {
    return new PropertyAssignment(key, value);
  }

  createKeywordTypeNode(kind: string) {
    return new SimpleTypeExpression(kind);
  }

  createArrayTypeNode(elementType: TypeExpression) {
    return new ArrayTypeNode(elementType);
  }

  createTypePredicateNodeWithModifier(
    assertsModifier: string | undefined,
    parameterName: Identifier,
    type: TypeExpression
  ) {
    return new TypePredicateNode(assertsModifier, parameterName, type);
  }

  createInferTypeNode(typeParameter: TypeExpression) {
    return new InferTypeNode(typeParameter);
  }

  createTupleTypeNode(elementTypes: TypeExpression[]) {
    return new TupleTypeNode(elementTypes);
  }

  createConditionalTypeNode(
    checkType: TypeExpression,
    extendsType: TypeExpression,
    trueType: TypeExpression,
    falseType: TypeExpression
  ) {
    return new ConditionalTypeNode(checkType, extendsType, trueType, falseType);
  }

  createFalse() {
    return new SimpleExpression(this.SyntaxKind.FalseKeyword);
  }

  createTrue(): Expression {
    return new SimpleExpression(this.SyntaxKind.TrueKeyword);
  }

  createNew(
    expression: Expression,
    typeArguments: TypeExpression[] | undefined,
    argumentsArray: Expression[]
  ) {
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

  createSuper() {
    return new SimpleExpression(this.SyntaxKind.SuperKeyword);
  }

  createThrow(expression: Expression) {
    return new Throw(expression);
  }

  createBreak(label?: string | Identifier) {
    return new SimpleExpression(this.SyntaxKind.BreakKeyword);
  }

  createContinue(label?: string | Identifier) {
    return new SimpleExpression(this.SyntaxKind.ContinueKeyword);
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

  createFunctionDeclaration(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    asteriskToken: string,
    name: Identifier,
    typeParameters: any,
    parameters: Parameter[],
    type: TypeExpression | string | undefined,
    body: Block
  ) {
    const functionDeclaration = this.createFunctionDeclarationCore(
      decorators,
      modifiers,
      asteriskToken,
      name,
      typeParameters,
      parameters,
      type,
      body
    );
    this.addViewFunction(
      functionDeclaration.name!.toString(),
      functionDeclaration
    );
    return functionDeclaration;
  }

  createFunctionDeclarationCore(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    asteriskToken: string,
    name: Identifier | undefined,
    typeParameters: any,
    parameters: Parameter[],
    type: TypeExpression | string | undefined,
    body: Block
  ) {
    return new Function(
      decorators,
      modifiers,
      asteriskToken,
      name,
      typeParameters,
      parameters,
      type,
      body,
      this.getContext()
    );
  }

  createParameter(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    dotDotDotToken: any,
    name: Identifier | BindingPattern,
    questionToken?: string,
    type?: TypeExpression,
    initializer?: Expression
  ) {
    return new Parameter(
      decorators,
      modifiers,
      dotDotDotToken,
      name,
      questionToken,
      type,
      initializer
    );
  }

  createReturn(expression?: Expression) {
    return new ReturnStatement(expression);
  }

  createFunctionExpression(
    modifiers: string[] = [],
    asteriskToken: string,
    name: Identifier | undefined,
    typeParameters: any,
    parameters: Parameter[],
    type: TypeExpression | string | undefined,
    body: Block
  ) {
    return this.createFunctionDeclarationCore(
      [],
      modifiers,
      asteriskToken,
      name,
      typeParameters,
      parameters,
      type,
      body
    );
  }

  createToken(token: string) {
    return token;
  }

  createArrowFunction(
    modifiers: string[] | undefined,
    typeParameters: any,
    parameters: Parameter[],
    type: TypeExpression | string | undefined,
    equalsGreaterThanToken: string,
    body: Block | Expression
  ) {
    return new ArrowFunction(
      modifiers,
      typeParameters,
      parameters,
      type,
      equalsGreaterThanToken,
      body,
      this.getContext()
    );
  }

  createModifier(modifier: string) {
    return modifier;
  }

  createBinary(left: Expression, operator: string, right: Expression) {
    return new Binary(left, operator, right);
  }

  createParen(expression: Expression) {
    return new Paren(expression);
  }

  createCall(
    expression: Expression,
    typeArguments: TypeExpression[] | undefined,
    argumentsArray?: Expression[]
  ) {
    return new Call(expression, typeArguments, argumentsArray);
  }

  createExportAssignment(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    isExportEquals: any,
    expression: Expression
  ) {
    return `export default ${expression}`;
  }

  createShorthandPropertyAssignment(name: Identifier, expression?: Expression) {
    return new ShorthandPropertyAssignment(name, expression);
  }

  createSpreadAssignment(expression: Expression) {
    return new SpreadAssignment(expression);
  }

  createEnumMember(name: Identifier, initializer?: Expression) {
    return new EnumMember(name, initializer);
  }

  createEnumDeclaration(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    name: Identifier,
    members: EnumMember[]
  ) {
    return new Enum(decorators, modifiers, name, members);
  }

  createTypeReferenceNode(
    typeName: Identifier,
    typeArguments?: TypeExpression[]
  ) {
    return new TypeReferenceNode(typeName, typeArguments);
  }

  createIf(
    expression: Expression,
    thenStatement: Expression,
    elseStatement?: Expression
  ) {
    return new If(expression, thenStatement, elseStatement);
  }

  createWhile(expression: Expression, statement: Expression) {
    return new While(expression, statement);
  }

  createNamespaceImport(name: Identifier) {
    return new NamespaceImport(name);
  }

  createImportDeclarationCore(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    importClause: ImportClause,
    moduleSpecifier: StringLiteral
  ) {
    return new ImportDeclaration(
      decorators,
      modifiers,
      importClause,
      moduleSpecifier
    );
  }

  createImportDeclaration(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    importClause: ImportClause = new ImportClause(),
    moduleSpecifier: StringLiteral
  ) {
    if (
      moduleSpecifier.toString().indexOf("component_declaration/common") >= 0
    ) {
      return "";
    }
    const context = this.getContext();
    if (context.defaultOptionsModule && context.dirname) {
      const relativePath = getModuleRelativePath(
        context.dirname,
        context.defaultOptionsModule
      );
      if (relativePath.toString() === moduleSpecifier.valueOf()) {
        context.defaultOptionsImport = new ImportDeclaration(
          decorators,
          modifiers,
          importClause,
          moduleSpecifier
        );
        return context.defaultOptionsImport;
      }
    }

    const module = moduleSpecifier.expression.toString();
    if (context.dirname) {
      const modulePath = resolveModule(
        path.join(context.dirname, module),
        this.cache
      );

      const importedModules = context.importedModules || [];
      const hasModule = importedModules.some((m) => m === modulePath);

      if (modulePath && !hasModule) {
        compileCode(this, fs.readFileSync(modulePath).toString(), {
          dirname: path.dirname(modulePath),
          path: modulePath,
          importedModules: [...importedModules, modulePath],
        });

        if (importClause.default) {
          this.addComponent(
            importClause.default.toString(),
            this.cache[modulePath].find(
              (e: any) =>
                (e instanceof Component || e instanceof ComponentInput) &&
                e.modifiers.find((m) => m === SyntaxKind.DefaultKeyword)
            ),
            importClause
          );
        }

        const componentInputs: ComponentInput[] = this.cache[modulePath].filter(
          (e: any) => e instanceof Component || e instanceof ComponentInput
        );

        importClause.imports?.forEach((i) => {
          const componentInput = componentInputs.find(
            (c) => c.name.toString() === i && c.modifiers.indexOf("export") >= 0
          );

          if (componentInput) {
            this.addComponent(i, componentInput, importClause);
          }
        });
        this.cache.__globals__ &&
          importClause.imports?.forEach((i) => {
            if (this.cache.__globals__[i]) {
              context.globals = {
                ...context.globals,
                [i]: this.cache.__globals__[i],
              };
            }
          });
      }
    }

    return this.createImportDeclarationCore(
      decorators,
      modifiers,
      importClause,
      moduleSpecifier
    );
  }

  createImportSpecifier(
    propertyName: Identifier | undefined,
    name: Identifier
  ) {
    return new ImportSpecifier(propertyName, name);
  }

  createNamedImports(node: ImportSpecifier[]) {
    return new NamedImports(node);
  }

  createImportClause(name?: Identifier, namedBindings?: NamedImportBindings) {
    return new ImportClause(name, namedBindings);
  }

  createExportSpecifier(
    propertyName: Identifier | undefined,
    name: Identifier
  ) {
    return new ExportSpecifier(propertyName, name);
  }

  createNamedExports(elements: ExportSpecifier[]) {
    return new NamedExports(elements);
  }

  createExportDeclaration(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    exportClause: NamedImports | undefined,
    moduleSpecifier?: Expression
  ) {
    return new ExportDeclaration(
      decorators,
      modifiers,
      exportClause,
      moduleSpecifier
    );
  }

  createDecorator(expression: Call) {
    return new Decorator(expression, this.getContext());
  }

  createProperty(
    decorators: Decorator[],
    modifiers: string[] | undefined,
    name: Identifier,
    questionOrExclamationToken?: string,
    type?: TypeExpression,
    initializer?: Expression
  ) {
    return new Property(
      decorators,
      modifiers,
      name,
      questionOrExclamationToken,
      type,
      initializer
    );
  }

  createComponent(
    componentDecorator: Decorator,
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>
  ) {
    return new Component(
      componentDecorator,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      this.getContext()
    );
  }

  createComponentBindings(
    decorators: Decorator[],
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>
  ) {
    return new ComponentInput(
      decorators,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members
    );
  }

  createClassDeclaration(
    decorators: Decorator[] = [],
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>
  ) {
    const componentDecorator = decorators.find(
      (d) => d.name === Decorators.Component
    );
    let result: Class | Component | ComponentInput;
    if (componentDecorator) {
      result = this.createComponent(
        componentDecorator,
        modifiers,
        name,
        typeParameters,
        heritageClauses,
        members
      );
      this.addComponent(name.toString(), result as Component);
    } else if (
      decorators.find((d) => d.name === Decorators.ComponentBindings)
    ) {
      const componentInput = this.createComponentBindings(
        decorators,
        modifiers,
        name,
        typeParameters,
        heritageClauses,
        members
      );
      this.addComponent(name.toString(), componentInput);
      result = componentInput;
    } else {
      result = new Class(
        decorators,
        modifiers,
        name,
        typeParameters,
        heritageClauses,
        members
      );
    }

    return result;
  }

  createInterfaceDeclaration(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: any[] | undefined,
    heritageClauses: HeritageClause[] | undefined,
    members: Array<PropertySignature | MethodSignature>
  ) {
    return new Interface(
      decorators,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members
    );
  }

  createPropertyAccess(expression: Expression, name: Identifier) {
    return new PropertyAccess(expression, name);
  }

  createJsxExpression(dotDotDotToken: string = "", expression?: Expression) {
    return new JsxExpression(dotDotDotToken, expression);
  }

  createJsxAttribute(name: Identifier, initializer?: Expression) {
    return new JsxAttribute(name, initializer);
  }

  createJsxSpreadAttribute(expression: Expression) {
    return new JsxSpreadAttribute(expression);
  }

  createJsxAttributes(properties: Array<JsxAttribute | JsxSpreadAttribute>) {
    return properties;
  }

  createJsxOpeningElement(
    tagName: Expression,
    typeArguments: any[],
    attributes?: Array<JsxAttribute | JsxSpreadAttribute>
  ) {
    return new JsxOpeningElement(
      tagName,
      typeArguments,
      attributes,
      this.getContext()
    );
  }

  createJsxSelfClosingElement(
    tagName: Expression,
    typeArguments: any[],
    attributes?: Array<JsxAttribute | JsxSpreadAttribute>
  ) {
    return new JsxSelfClosingElement(
      tagName,
      typeArguments,
      attributes,
      this.getContext()
    );
  }

  createJsxClosingElement(tagName: Expression) {
    return new JsxClosingElement(tagName);
  }

  createJsxElement(
    openingElement: JsxOpeningElement,
    children: Array<
      JsxElement | string | JsxExpression | JsxSelfClosingElement
    >,
    closingElement: JsxClosingElement
  ) {
    return new JsxElement(openingElement, children, closingElement);
  }

  createJsxText(text: string, containsOnlyTriviaWhiteSpaces: string) {
    return containsOnlyTriviaWhiteSpaces === "true" ? "" : text;
  }

  createFunctionTypeNode(
    typeParameters: any,
    parameters: Parameter[],
    type: TypeExpression
  ) {
    return new FunctionTypeNode(typeParameters, parameters, type);
  }

  createExpressionStatement(expression: Expression) {
    return expression;
  }

  createMethod(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    asteriskToken: string | undefined,
    name: Identifier,
    questionToken: string | undefined,
    typeParameters: TypeParameterDeclaration[] | undefined,
    parameters: Parameter[],
    type: TypeExpression | undefined,
    body: Block
  ) {
    return new Method(
      decorators,
      modifiers,
      asteriskToken,
      name,
      questionToken,
      typeParameters,
      parameters,
      type,
      body
    );
  }

  createGetAccessor(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    name: Identifier,
    parameters: Parameter[],
    type?: TypeExpression,
    body?: Block
  ) {
    return new GetAccessor(decorators, modifiers, name, parameters, type, body);
  }

  createConstructor(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    parameters: Parameter[],
    body: Block | undefined
  ) {
    return new Constructor(decorators, modifiers, parameters, body);
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
    return new ElementAccess(expression, undefined, index);
  }

  createElementAccessChain(
    expression: Expression,
    questionDotToken: string | undefined,
    index: Expression
  ) {
    return new ElementAccess(expression, questionDotToken, index);
  }

  createSpread(expression: Expression) {
    return new Spread(expression);
  }

  createPropertySignature(
    modifiers: string[] | undefined,
    name: Identifier,
    questionToken: string | undefined,
    type?: TypeExpression,
    initializer?: Expression
  ) {
    return new PropertySignature(
      modifiers,
      name,
      questionToken,
      type,
      initializer
    );
  }

  createIndexSignature(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    parameters: Parameter[],
    type: TypeExpression
  ) {
    return new IndexSignature(decorators, modifiers, parameters, type);
  }

  createTypeLiteralNode(members: PropertySignature[]) {
    return new TypeLiteralNode(members);
  }

  createLiteralTypeNode(literal: Expression) {
    return new LiteralTypeNode(literal);
  }

  createIndexedAccessTypeNode(
    objectType: TypeExpression,
    indexType: TypeExpression
  ) {
    return new IndexedAccessTypeNode(objectType, indexType);
  }

  createTypeAliasDeclaration(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: TypeParameterDeclaration[] | undefined,
    type: TypeExpression
  ) {
    const members = membersFromTypeDeclaration(type, this.getContext());

    if (members.length) {
      const componentBindings = this.createComponentBindings(
        [
          this.createDecorator(
            this.createCall(
              this.createIdentifier("ComponentBindings"),
              undefined,
              []
            )
          ),
        ],
        modifiers,
        name,
        [],
        [],
        members
      );

      this.addComponent(name.toString(), componentBindings);

      return componentBindings;
    }

    const result = new TypeAliasDeclaration(
      decorators,
      modifiers,
      name,
      typeParameters,
      type
    );
    return result;
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

  createConditional(
    condition: Expression,
    whenTrue: Expression,
    whenFalse: Expression
  ) {
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

  createFor(
    initializer: Expression | undefined,
    condition: Expression | undefined,
    incrementor: Expression | undefined,
    statement: Expression
  ) {
    return new For(initializer, condition, incrementor, statement);
  }

  createForIn(
    initializer: Expression,
    expression: Expression,
    statement: Expression
  ) {
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

  createExpressionWithTypeArguments(
    typeArguments: TypeReferenceNode[] | undefined,
    expression: Expression
  ) {
    return new ExpressionWithTypeArguments(typeArguments, expression);
  }

  createTypeOf(expression: Expression) {
    return new TypeOf(expression);
  }

  createTypeOperatorNode(type: TypeExpression) {
    return new TypeOperatorNode(type);
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

  createPropertyAccessChain(
    expression: Expression,
    questionDotToken: string | undefined,
    name: Expression
  ) {
    return new PropertyAccessChain(expression, questionDotToken, name);
  }

  createCallChain(
    expression: Expression,
    questionDotToken: string | undefined,
    typeArguments: any,
    argumentsArray: Expression[] | undefined
  ) {
    return new CallChain(
      expression,
      questionDotToken,
      typeArguments,
      argumentsArray
    );
  }

  createAsExpression(expression: Expression, type: TypeExpression) {
    return new AsExpression(expression, type);
  }

  createQualifiedName(left: Expression, right: Identifier) {
    return new QualifiedName(left, right);
  }

  createMethodSignature(
    typeParameters: any,
    parameters: Parameter[],
    type: TypeExpression | undefined,
    name: Identifier,
    questionToken?: string
  ) {
    return new MethodSignature(
      typeParameters,
      parameters,
      type,
      name,
      questionToken
    );
  }

  createTypeParameterDeclaration(
    name: Identifier,
    constraint?: TypeExpression,
    defaultType?: TypeExpression
  ) {
    return new TypeParameterDeclaration(name, constraint, defaultType);
  }

  createRegularExpressionLiteral(text: string) {
    return new SimpleExpression(text);
  }

  context: GeneratorContext[] = [];

  addComponent(
    name: string,
    component: Component | ComponentInput,
    importClause?: ImportClause
  ) {
    const context = this.getContext();
    context.components = context.components || {};
    context.components[name] = component;
  }

  getInitialContext(): GeneratorContext {
    return {
      defaultOptionsModule:
        this.options.defaultOptionsModule &&
        path.resolve(this.options.defaultOptionsModule),
    };
  }

  getContext() {
    return this.context[this.context.length - 1] || { components: {} };
  }

  setContext(context: GeneratorContext | null) {
    if (!context) {
      this.context.pop();
    } else {
      this.context.push({
        ...this.getInitialContext(),
        ...context,
      });
    }
  }

  addViewFunction(name: string, f: any) {
    if ((f instanceof Function || f instanceof ArrowFunction) && f.isJsx()) {
      const context = this.getContext();
      context.viewFunctions = context.viewFunctions || {};
      context.viewFunctions[name] = f;
    }
  }

  cache: GeneratorCache = {};

  meta: { [name: string]: any } = {};

  destination: string = "";

  options: GeneratorOptions = {};

  format(code: string) {
    return prettier.format(code, {
      parser: "typescript",
      htmlWhitespaceSensitivity: "strict",
    });
  }

  removeJQueryBaseModule(codeFactoryResult: Array<any>, component: Component) {
    const jqueryBaseComponentName = component.getJQueryBaseComponentName();
    if (jqueryBaseComponentName) {
      codeFactoryResult.some((node, index) => {
        if (
          node instanceof ImportDeclaration &&
          node.has(jqueryBaseComponentName)
        ) {
          codeFactoryResult.splice(index, 1);
          return true;
        }
      });
    }
  }

  processCodeFactoryResult(codeFactoryResult: Array<any>) {
    const context = this.getContext();
    codeFactoryResult.forEach((e) => {
      if (e instanceof VariableStatement) {
        context.globals = {
          ...context.globals,
          ...context.viewFunctions,
          ...e.getVariableExpressions(),
        };
      }
      if (e instanceof Component) {
        this.removeJQueryBaseModule(codeFactoryResult, e);
      }
    });
    this.cache.__globals__ = context.globals;
    return this.format(codeFactoryResult.join(";\n"));
  }

  generate(factory: any): GeneratorResult[] {
    const result: GeneratorResult[] = [];
    const codeFactoryResult = factory(this);
    const { path } = this.getContext();

    if (path) {
      this.cache[path] = codeFactoryResult;
    }
    if (path && this.context.length === 1) {
      const component = codeFactoryResult.find(
        (e: any) => e instanceof Component
      ) as Component;
      if (component) {
        this.meta[path] = component.getMeta();
      }
    }
    result.push({
      path: path && this.processSourceFileName(path),
      code: this.processCodeFactoryResult(codeFactoryResult),
    });

    return result;
  }

  getComponentsMeta(): any[] {
    return Object.keys(this.meta).reduce(
      (r: any[], path) => [...r, { ...this.meta[path], path }],
      []
    );
  }
}
