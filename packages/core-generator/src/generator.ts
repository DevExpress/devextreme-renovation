import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

import { compileCode } from './code-compiler';
import { Decorators } from './decorators';
import { Expression, SimpleExpression } from './expressions/base';
import { BindingElement, BindingPattern } from './expressions/binding-pattern';
import { CallSignature } from './expressions/call-signature';
import { Class, HeritageClause } from './expressions/class';
import {
  Constructor, GetAccessor, Method, Property,
} from './expressions/class-members';
import {
  AsExpression,
  Call,
  CallChain,
  Delete,
  Identifier,
  New,
  NonNullExpression,
  Paren,
  TypeOf,
  Void,
} from './expressions/common';
import { Component } from './expressions/component';
import { ComponentInput, membersFromTypeDeclaration } from './expressions/component-input';
import {
  CaseBlock, CaseClause, Conditional, DefaultClause, If, Switch,
} from './expressions/conditions';
import {
  Do, For, ForIn, While,
} from './expressions/cycle';
import { Decorator } from './expressions/decorator';
import { Enum, EnumMember } from './expressions/enum';
import { ExportDeclaration, ExportSpecifier, NamedExports } from './expressions/export';
import { ArrowFunction, Function, Parameter } from './expressions/functions';
import {
  ImportClause,
  ImportDeclaration,
  ImportSpecifier,
  NamedImportBindings,
  NamedImports,
  NamespaceImport,
} from './expressions/import';
import { Interface } from './expressions/interface';
import {
  JsxAttribute,
  JsxClosingElement,
  JsxElement,
  JsxExpression,
  JsxOpeningElement,
  JsxSelfClosingElement,
  JsxSpreadAttribute,
} from './expressions/jsx';
import {
  ArrayLiteral, NumericLiteral, ObjectLiteral, StringLiteral,
} from './expressions/literal';
import { ModuleDeclaration } from './expressions/module_declaration';
import { Binary, Postfix, Prefix } from './expressions/operators';
import {
  ComputedPropertyName,
  ElementAccess,
  PropertyAccess,
  PropertyAccessChain,
  Spread,
} from './expressions/property-access';
import { PropertyAssignment, ShorthandPropertyAssignment, SpreadAssignment } from './expressions/property-assignment';
import { Block, ReturnStatement } from './expressions/statements';
import { TemplateExpression, TemplateSpan } from './expressions/template';
import { Throw } from './expressions/throw';
import { CatchClause, Try } from './expressions/try-catch';
import {
  ArrayTypeNode,
  ConditionalTypeNode,
  ExpressionWithTypeArguments,
  FunctionTypeNode,
  IndexedAccessTypeNode,
  IndexSignature,
  InferTypeNode,
  IntersectionTypeNode,
  LiteralTypeNode,
  MethodSignature,
  OptionalTypeNode,
  ParenthesizedType,
  PropertySignature,
  QualifiedName,
  SimpleTypeExpression,
  TupleTypeNode,
  TypeAliasDeclaration,
  TypeExpression,
  TypeLiteralNode,
  TypeOperatorNode,
  TypePredicateNode,
  TypeQueryNode,
  TypeReferenceNode,
  UnionTypeNode,
} from './expressions/type';
import { TypeParameterDeclaration } from './expressions/type-parameter-declaration';
import { VariableDeclaration, VariableDeclarationList, VariableStatement } from './expressions/variables';
import { GeneratorAPI, GeneratorResult } from './generator-api';
import { SyntaxKind } from './syntaxKind';
import {
  GeneratorCache, GeneratorContext, GeneratorOptions, VariableExpression,
} from './types';
import { getExpression } from './utils/expressions';
import { getModuleRelativePath, resolveModule } from './utils/path-utils';

export class Generator implements GeneratorAPI {
  NodeFlags = {
    Const: 'const',
    Let: 'let',
    None: 'var',
    LessThanEqualsToken: '<=',
    MinusEqualsToken: '-=',
    ConstructorKeyword: 'constructor',

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

  getPlatform(): string {
    return 'base';
  }

  processSourceFileName(name: string) {
    return name;
  }

  createIdentifier(name: string): Identifier {
    return new Identifier(name);
  }

  createNumericLiteral(value: string, _numericLiteralFlags = ''): Expression {
    return new NumericLiteral(value);
  }

  createCallSignature(typeParameters: TypeExpression[], parameters: Parameter[], type: TypeExpression | string) {
    return new CallSignature(typeParameters, parameters, type);
  }

  createVariableDeclaration(
    name: Identifier | BindingPattern,
    type?: TypeExpression,
    initializer?: Expression,
  ) {
    if (initializer) {
      this.addViewFunction(name.toString(), initializer);
    }
    return this.createVariableDeclarationCore(name, type, initializer);
  }

  createVariableDeclarationCore(
    name: Identifier | BindingPattern,
    type?: TypeExpression,
    initializer?: Expression,
  ) {
    return new VariableDeclaration(name, type, initializer);
  }

  createVariableDeclarationList(
    declarations: VariableDeclaration[],
    flags?: string,
  ) {
    return new VariableDeclarationList(declarations, flags);
  }

  createVariableStatement(
    modifiers: string[] | undefined,
    declarationList: VariableDeclarationList,
  ) {
    return new VariableStatement(modifiers, declarationList);
  }

  createStringLiteral(value: string) {
    return new StringLiteral(value);
  }

  createBindingElement(
    dotDotDotToken = '',
    propertyName: Identifier | undefined,
    name: string | Identifier | BindingPattern,
    initializer?: Expression,
  ) {
    return new BindingElement(dotDotDotToken, propertyName, name, initializer);
  }

  createArrayBindingPattern(elements: Array<BindingElement>) {
    return new BindingPattern(elements, 'array');
  }

  createArrayLiteral(elements: Expression[], multiLine: boolean): Expression {
    return new ArrayLiteral(elements, multiLine);
  }

  createObjectLiteral(
    properties: Array<
    PropertyAssignment | ShorthandPropertyAssignment | SpreadAssignment
    >,
    multiLine: boolean,
  ) {
    return new ObjectLiteral(properties, multiLine);
  }

  createObjectBindingPattern(elements: BindingElement[]) {
    return new BindingPattern(elements, 'object');
  }

  createPropertyAssignment(
    key: Identifier | ComputedPropertyName,
    value: Expression,
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
    type: TypeExpression,
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
    falseType: TypeExpression,
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
    argumentsArray: Expression[],
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

  createTry(tryBlock: Block, catchClause?: CatchClause, finallyBlock?: Block) {
    return new Try(tryBlock, catchClause, finallyBlock);
  }

  createCatchClause(
    variableDeclaration: Expression | undefined,
    expression: Block,
  ) {
    return new CatchClause(variableDeclaration, expression);
  }

  createBreak() {
    return new SimpleExpression(this.SyntaxKind.BreakKeyword);
  }

  createContinue() {
    return new SimpleExpression(this.SyntaxKind.ContinueKeyword);
  }

  createEmptyStatement() {
    return new SimpleExpression('');
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
    body: Block,
  ) {
    const functionDeclaration = this.createFunctionDeclarationCore(
      decorators,
      modifiers,
      asteriskToken,
      name,
      typeParameters,
      parameters,
      type,
      body,
    );
    this.addViewFunction(
      functionDeclaration.name!.toString(),
      functionDeclaration,
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
    body: Block,
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
      this.getContext(),
    );
  }

  createParameter(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    dotDotDotToken: any,
    name: Identifier | BindingPattern,
    questionToken?: string,
    type?: TypeExpression | string,
    initializer?: Expression,
  ) {
    return new Parameter(
      decorators,
      modifiers,
      dotDotDotToken,
      name,
      questionToken,
      type,
      initializer,
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
    body: Block,
  ) {
    return this.createFunctionDeclarationCore(
      [],
      modifiers,
      asteriskToken,
      name,
      typeParameters,
      parameters,
      type,
      body,
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
    body: Block | Expression,
  ) {
    return new ArrowFunction(
      modifiers,
      typeParameters,
      parameters,
      type,
      equalsGreaterThanToken,
      body,
      this.getContext(),
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
    argumentsArray?: Expression[],
  ) {
    return new Call(expression, typeArguments, argumentsArray);
  }

  createExportAssignment(
    _decorators: Decorator[] = [],
    _modifiers: string[] = [],
    _isExportEquals: any,
    expression: Expression,
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
    members: EnumMember[],
  ) {
    return new Enum(decorators, modifiers, name, members);
  }

  createTypeReferenceNode(
    typeName: Identifier,
    typeArguments?: TypeExpression[],
  ) {
    return new TypeReferenceNode(typeName, typeArguments, this.getContext());
  }

  createIf(
    expression: Expression,
    thenStatement: Expression,
    elseStatement?: Expression,
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
    moduleSpecifier: StringLiteral,
  ) {
    return new ImportDeclaration(
      decorators,
      modifiers,
      importClause,
      moduleSpecifier,
      this.getContext(),
    );
  }

  createImportDeclaration(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    importClause: ImportClause = new ImportClause(),
    moduleSpecifier: StringLiteral,
  ) {
    const context = this.getContext();
    if (context.defaultOptionsModule && context.dirname) {
      const relativePath = getModuleRelativePath(
        context.dirname,
        context.defaultOptionsModule,
      );
      if (relativePath.toString() === moduleSpecifier.valueOf()) {
        context.defaultOptionsImport = new ImportDeclaration(
          decorators,
          modifiers,
          importClause,
          moduleSpecifier,
          this.getContext(),
        );
        return context.defaultOptionsImport;
      }
    }

    const module = moduleSpecifier.expression.toString();
    if (
      context.dirname
      && module.indexOf('@devextreme-generator/declarations') === -1
    ) {
      const modulePath = resolveModule(
        path.join(context.dirname, module),
        this.cache,
      );

      if (modulePath) {
        const relativePath = getModuleRelativePath(context.dirname, modulePath);
        context.imports = context.imports || {};
        context.imports[relativePath] = importClause;
      }

      const importedModules = context.importedModules || [];
      const hasModule = importedModules.some((m) => m === modulePath);

      if (modulePath && !hasModule) {
        compileCode(
          this,
          fs.readFileSync(modulePath).toString(),
          {
            dirname: path.dirname(modulePath),
            path: modulePath,
            importedModules: [...importedModules, modulePath],
          },
          false,
          true,
        );

        if (importClause.default) {
          this.addComponent(
            importClause.default.toString(),
            this.cache[modulePath].find(
              (e: any) => (e instanceof Component || e instanceof ComponentInput)
                && e.modifiers.find((m) => m === SyntaxKind.DefaultKeyword),
            ),
            importClause,
          );
        }

        importClause.imports?.forEach((name) => {
          const originalName = importClause.resolveImport(name);
          this.addToContext(name, originalName, importClause, modulePath);
        });
        if (this.cache.__globals__) {
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
    }

    return this.createImportDeclarationCore(
      decorators,
      modifiers,
      importClause,
      moduleSpecifier,
    );
  }

  createImportSpecifier(
    propertyName: Identifier | undefined,
    name: Identifier,
  ) {
    return new ImportSpecifier(propertyName, name);
  }

  createNamedImports(node: ImportSpecifier[]) {
    return new NamedImports(node);
  }

  createImportClause(
    name?: Identifier,
    namedBindings?: NamedImportBindings,
    isTypeOnly?: boolean,
  ) {
    return new ImportClause(name, namedBindings, isTypeOnly);
  }

  createExportSpecifier(
    propertyName: Identifier | undefined,
    name: Identifier,
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
    moduleSpecifier?: Expression,
  ) {
    return new ExportDeclaration(
      decorators,
      modifiers,
      exportClause,
      moduleSpecifier,
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
    initializer?: Expression,
  ) {
    return new Property(
      decorators,
      modifiers,
      name,
      questionOrExclamationToken,
      type,
      initializer,
    );
  }

  createComponent(
    componentDecorator: Decorator,
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: TypeExpression[] | string[] | undefined,
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
  ) {
    return new Component(
      componentDecorator,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      this.getContext(),
    );
  }

  createComponentBindings(
    decorators: Decorator[],
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: TypeExpression[] | string[] | undefined,
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
    fromType = false,
  ) {
    return new ComponentInput(
      decorators,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      this.getContext(),
      fromType,
    );
  }

  createClassDeclarationCore(
    decorators: Decorator[] = [],
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: TypeExpression[] | string[] | undefined,
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
    context: GeneratorContext,
  ) {
    return new Class(
      decorators,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      context,
    );
  }

  createClassDeclaration(
    decorators: Decorator[] = [],
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: TypeExpression[] | string[] | undefined,
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
  ) {
    const componentDecorator = decorators.find(
      (d) => d.name === Decorators.Component,
    );
    let result: Class | Component | ComponentInput;
    if (componentDecorator) {
      result = this.createComponent(
        componentDecorator,
        modifiers,
        name,
        typeParameters,
        heritageClauses,
        members,
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
        members,
      );
      this.addComponent(name.toString(), componentInput);
      result = componentInput;
    } else {
      result = this.createClassDeclarationCore(
        decorators,
        modifiers,
        name,
        typeParameters,
        heritageClauses,
        members,
        this.getContext(),
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
    members: Array<PropertySignature | MethodSignature>,
  ) {
    const result = new Interface(
      decorators,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
    );

    const context = this.getContext();
    context.interfaces = context.interfaces || {};
    context.interfaces[name.toString()] = result;

    return result;
  }

  createPropertyAccess(expression: Expression, name: Identifier) {
    return new PropertyAccess(expression, name);
  }

  createJsxExpression(dotDotDotToken = '', expression?: Expression) {
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
    attributes?: Array<JsxAttribute | JsxSpreadAttribute>,
  ) {
    return new JsxOpeningElement(
      tagName,
      typeArguments,
      attributes,
      this.getContext(),
    );
  }

  createJsxSelfClosingElement(
    tagName: Expression,
    typeArguments: any[],
    attributes?: Array<JsxAttribute | JsxSpreadAttribute>,
  ) {
    return new JsxSelfClosingElement(
      tagName,
      typeArguments,
      attributes,
      this.getContext(),
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
    closingElement: JsxClosingElement,
  ) {
    return new JsxElement(openingElement, children, closingElement);
  }

  createJsxText(text: string, containsOnlyTriviaWhiteSpaces: string) {
    return containsOnlyTriviaWhiteSpaces === 'true' ? '' : text;
  }

  createFunctionTypeNode(
    typeParameters: any,
    parameters: Parameter[],
    type: TypeExpression | string,
  ) {
    return new FunctionTypeNode(typeParameters, parameters, type);
  }

  createOptionalTypeNode(type: TypeExpression) {
    return new OptionalTypeNode(type);
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
    body: Block,
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
      body,
    );
  }

  createGetAccessor(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    name: Identifier,
    parameters: Parameter[],
    type?: TypeExpression,
    body?: Block,
  ) {
    return new GetAccessor(decorators, modifiers, name, parameters, type, body);
  }

  createConstructor(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    parameters: Parameter[],
    body: Block | undefined,
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
    index: Expression,
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
    initializer?: Expression,
  ) {
    return new PropertySignature(
      modifiers,
      name,
      questionToken,
      type,
      initializer,
    );
  }

  createIndexSignature(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    parameters: Parameter[],
    type: TypeExpression,
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
    indexType: TypeExpression,
  ) {
    return new IndexedAccessTypeNode(objectType, indexType);
  }

  createTypeAliasDeclaration(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: TypeParameterDeclaration[] | undefined,
    type: TypeExpression,
  ) {
    const members = membersFromTypeDeclaration(type, this.getContext());

    if (members.length) {
      const componentBindings = this.createComponentBindings(
        [
          this.createDecorator(
            this.createCall(
              this.createIdentifier('ComponentBindings'),
              undefined,
              [],
            ),
          ),
        ],
        modifiers,
        name,
        [],
        [],
        members,
        true,
      );

      this.addComponent(name.toString(), componentBindings);

      return componentBindings;
    }

    const context = this.getContext();
    context.types = context.types || {};
    context.types[name.toString()] = type;

    return new TypeAliasDeclaration(
      decorators,
      modifiers,
      name,
      typeParameters,
      type,
    );
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
    whenFalse: Expression,
  ) {
    return new Conditional(condition, whenTrue, whenFalse);
  }

  createTemplateHead(text: string) {
    return text;
  }

  createTemplateMiddle(text: string) {
    return text;
  }

  createTemplateTail(text: string) {
    return text;
  }

  createTemplateSpan(expression: Expression, literal: string) {
    return new TemplateSpan(expression, literal);
  }

  createTemplateExpression(head: string, templateSpans: TemplateSpan[]) {
    return new TemplateExpression(head, templateSpans);
  }

  createNoSubstitutionTemplateLiteral(text: string) {
    return new TemplateExpression(text, []);
  }

  createFor(
    initializer: Expression | undefined,
    condition: Expression | undefined,
    incrementor: Expression | undefined,
    statement: Expression,
  ) {
    return new For(initializer, condition, incrementor, statement);
  }

  createForIn(
    initializer: Expression,
    expression: Expression,
    statement: Expression,
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
    expression: Expression,
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
    name: Expression,
  ) {
    return new PropertyAccessChain(expression, questionDotToken, name);
  }

  createCallChain(
    expression: Expression,
    questionDotToken: string | undefined,
    typeArguments: any,
    argumentsArray: Expression[] | undefined,
  ) {
    return new CallChain(
      expression,
      questionDotToken,
      typeArguments,
      argumentsArray,
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
    questionToken?: string,
  ) {
    return new MethodSignature(
      typeParameters,
      parameters,
      type,
      name,
      questionToken,
    );
  }

  createTypeParameterDeclaration(
    name: Identifier,
    constraint?: TypeExpression,
    defaultType?: TypeExpression,
  ) {
    return new TypeParameterDeclaration(name, constraint, defaultType);
  }

  createRegularExpressionLiteral(text: string) {
    return new SimpleExpression(text);
  }

  createModuleDeclaration(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    name: StringLiteral,
    body: Block | undefined,
    _flags?: never, // These flags are NodeFlag which different of our and don't used now
  ): ModuleDeclaration {
    return new ModuleDeclaration(decorators, modifiers, name, body);
  }

  createModuleBlock(statements: Expression[]): Block {
    return new Block(statements, true);
  }

  context: GeneratorContext[] = [];

  addComponent(
    name: string,
    component: Component | ComponentInput,
    _importClause?: ImportClause,
  ) {
    const context = this.getContext();
    context.components = context.components || {};
    context.components[name] = component;
  }

  addInterface(name: string, _interface: Interface) {
    const context = this.getContext();
    context.externalInterfaces = context.externalInterfaces || {};
    context.externalInterfaces[name] = _interface;
  }

  addType(name: string, _type: TypeLiteralNode) {
    const context = this.getContext();
    context.externalTypes = context.externalTypes || {};
    context.externalTypes[name] = _type;
  }

  addToContext(
    name: string,
    originalName: string | undefined,
    importClause: ImportClause,
    modulePath: string,
  ) {
    const externalFile = this.cache[modulePath];
    const isImported = (i: {
      name: Identifier | string;
      modifiers: string[];
    }): boolean => {
      const name = i.name instanceof Identifier ? i.name.toString() : i.name;
      return name === originalName && i.modifiers.indexOf('export') >= 0;
    };

    const externalElement = externalFile.find(isImported);

    if (
      externalElement instanceof Component
      || externalElement instanceof ComponentInput
    ) {
      this.addComponent(name, externalElement, importClause);
    }
    if (externalElement instanceof Interface) {
      this.addInterface(name, externalElement);
    } else if (externalElement instanceof Class) {
      this.addInterface(
        name,
        new Interface(
          externalElement.decorators,
          externalElement.modifiers,
          new Identifier(name),
          externalElement.typeParameters,
          externalElement.heritageClauses,
          externalElement.members
            .filter((m) => m instanceof Property)
            .map(
              (p) => new PropertySignature(
                p.modifiers,
                p._name,
                '',
                p.type instanceof TypeExpression ? p.type : undefined,
                undefined,
              ),
            ),
        ),
      );
    } else if (
      externalElement instanceof TypeAliasDeclaration
      && externalElement.type instanceof TypeLiteralNode
    ) {
      this.addType(name, externalElement.type);
    }
  }

  getInitialContext(): GeneratorContext {
    return {
      defaultOptionsModule: this.options.defaultOptionsModule,
      // this.options.defaultOptionsModule &&
      // path.resolve(this.options.defaultOptionsModule),
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

  resetCache() {
    this.cache = {};
  }

  meta: { [name: string]: any } = {};

  destination = '';

  options: GeneratorOptions = {};

  format(code: string) {
    return prettier.format(code, {
      parser: 'typescript',
      htmlWhitespaceSensitivity: 'strict',
    });
  }

  removeJQueryBaseModule(codeFactoryResult: Array<any>, component: Component) {
    const jqueryBaseComponentName = component.getJQueryBaseComponentName();
    if (jqueryBaseComponentName) {
      codeFactoryResult.some((node, index) => {
        if (
          node instanceof ImportDeclaration
          && node.has(jqueryBaseComponentName)
        ) {
          codeFactoryResult.splice(index, 1);
          return true;
        }
        return undefined;
      });
    }
  }

  processCodeFactoryResult(
    codeFactoryResult: Array<any>,
    createFactoryOnly: boolean,
  ) {
    const context = this.getContext();
    const functions: Function[] = [];
    codeFactoryResult.forEach((e) => {
      if (e instanceof VariableStatement || e instanceof ImportDeclaration) {
        const variables = e.getVariableExpressions();
        context.globals = {
          ...context.globals,
          ...Object.keys(variables).reduce(
            (result: VariableExpression, key) => {
              if (context.components?.[key]) {
                return result;
              }
              return {
                ...result,
                [key]: variables[key],
              };
            },
            {},
          ),
        };
      }

      if (e instanceof Component) {
        this.removeJQueryBaseModule(codeFactoryResult, e);
      }
      if (e instanceof Function) {
        functions.push(e);
      }
    });

    context.globals = {
      ...context.globals,
      ...context.viewFunctions,
    };

    codeFactoryResult.forEach((e) => {
      if (e instanceof Component) {
        const name = e.view.toString();
        const globalView = context.globals?.[name]
          || functions.find((f) => f.name!.toString() === name);
        if (!context.viewFunctions?.[name] && globalView) {
          const viewFunction = getExpression(globalView);
          viewFunction.isJsx = () => true;
          this.addViewFunction(name, viewFunction);
        }
      }
    });
    this.cache.__globals__ = context.globals;
    if (createFactoryOnly) {
      return '';
    }
    return this.format(codeFactoryResult.join(';\n'));
  }

  generate(factory: any, createFactoryOnly = false): GeneratorResult[] {
    const result: GeneratorResult[] = [];
    const codeFactoryResult = factory(this);
    const { path } = this.getContext();

    if (path) {
      this.cache[path] = codeFactoryResult;
    }
    if (path && this.context.length === 1) {
      const component = codeFactoryResult.find(
        (e: any) => e instanceof Component,
      ) as Component;
      if (component) {
        this.meta[path] = component.getMeta();
      }
    }

    result.push({
      path: path && this.processSourceFileName(path),
      code: this.processCodeFactoryResult(codeFactoryResult, createFactoryOnly),
    });

    return result;
  }

  getComponentsMeta(): any[] {
    return Object.keys(this.meta).reduce(
      (r: any[], path) => [...r, { ...this.meta[path], path }],
      [],
    );
  }
}
