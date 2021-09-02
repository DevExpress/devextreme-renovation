import path from 'path';
import prettier from 'prettier';
import BaseGenerator, {
  BindingPattern,
  Block,
  Decorator,
  Expression,
  GeneratorContext,
  HeritageClause,
  Identifier,
  ImportClause,
  Interface,
  StringLiteral,
  TypeParameterDeclaration,
  TypeExpression,
  SimpleTypeExpression,
  ArrayTypeNode,
  UnionTypeNode,
  FunctionTypeNode,
  LiteralTypeNode,
  TypeReferenceNode,
  IndexedAccessTypeNode,
  IntersectionTypeNode,
  ParenthesizedType,
  TypeAliasDeclaration,
  TypeOperatorNode,
  PropertySignature,
  MethodSignature,
} from '@devextreme-generator/core';
import { AsExpression } from './expressions/as-expression';
import { Binary } from './expressions/binary';
import { Call, New } from './expressions/call';
import { CallChain } from './expressions/call-chain';
import { Class } from './expressions/class';
import { GetAccessor } from './expressions/class-members/get-accessor';
import { Method } from './expressions/class-members/method';
import { Property } from './expressions/class-members/property';
import { Enum, EnumMember } from './expressions/enum';
import { ArrowFunction } from './expressions/functions/arrow-function';
import { Function } from './expressions/functions/function';
import { Parameter } from './expressions/functions/parameter';
import { ImportDeclaration } from './expressions/import-declaration';
import { JsxAttribute } from './expressions/jsx/attribute';
import { JsxElement } from './expressions/jsx/element';
import { JsxExpression } from './expressions/jsx/jsx-expression';
import { JsxSpreadAttribute } from './expressions/jsx/spread-attribute';
import { NonNullExpression } from './expressions/non-null-expression';
import { PropertyAccess } from './expressions/property-access';
import { PropertyAccessChain } from './expressions/property-access-chain';
import { VariableDeclaration } from './expressions/variable-declaration';
import { VueComponentInput } from './expressions/vue-component-input';
import { ExpressionWithTypeArguments } from './types';
import {
  VueComponent,
  getComponentListFromContext,
} from './expressions/vue-component';
import {
  JsxOpeningElement,
  JsxSelfClosingElement,
  JsxClosingElement,
} from './expressions/jsx/opening-element';

const emptyToString = () => '';

const addEmptyToString = <T>(e: T): T => {
  (e as any).toString = emptyToString;
  return e as typeof e;
};
export class VueGenerator extends BaseGenerator {
  getPlatform(): string {
    return 'vue';
  }

  createComponentBindings(
    decorators: Decorator[],
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
  ) {
    return new VueComponentInput(
      decorators,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      this.getContext(),
    );
  }

  createComponent(
    componentDecorator: Decorator,
    modifiers: string[],
    name: Identifier,
    typeParameters: any,
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
  ) {
    return new VueComponent(
      componentDecorator,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      this.getContext(),
    );
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

  createMethod(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    asteriskToken: string | undefined,
    name: Identifier,
    questionToken: string | undefined,
    typeParameters: TypeParameterDeclaration[] | undefined,
    parameters: Parameter[],
    type: TypeExpression | undefined,
    body: Block | undefined,
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

  createFunctionDeclarationCore(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    asteriskToken: string,
    name: Identifier,
    typeParameters: any,
    parameters: Parameter[],
    type: TypeExpression | undefined,
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

  createVariableDeclarationCore(
    name: Identifier | BindingPattern,
    type?: TypeExpression,
    initializer?: Expression,
  ) {
    return new VariableDeclaration(name, type, initializer);
  }

  createCallChain(
    expression: Expression,
    questionDotToken: string | undefined,
    _typeArguments: TypeExpression[] | undefined,
    argumentsArray: Expression[] | undefined,
  ) {
    return new CallChain(
      expression,
      questionDotToken,
      undefined,
      argumentsArray,
    );
  }

  createCall(
    expression: Expression,
    typeArguments: TypeExpression[] | undefined,
    argumentsArray?: Expression[],
  ) {
    return new Call(expression, typeArguments, argumentsArray);
  }

  createNew(
    expression: Expression,
    typeArguments: TypeExpression[] | undefined,
    argumentsArray: Expression[],
  ) {
    return new New(expression, typeArguments, argumentsArray);
  }

  createParameter(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    dotDotDotToken: string | undefined,
    name: Identifier | BindingPattern,
    questionToken?: string,
    type?: TypeExpression,
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

  processSourceFileName(name: string) {
    const ext = getComponentListFromContext(this.getContext()).length
      ? '.vue'
      : '.js';
    return name.replace(path.extname(name), ext);
  }

  format(code: string) {
    if (code.indexOf('<script>') === -1) {
      return code;
    }
    return prettier.format(code, {
      parser: 'vue',
      htmlWhitespaceSensitivity: 'strict',
    });
  }

  processCodeFactoryResult(
    codeFactoryResult: Array<any>,
    createFactoryOnly: boolean,
  ) {
    const code = super.processCodeFactoryResult(
      codeFactoryResult,
      createFactoryOnly,
    );
    if (getComponentListFromContext(this.getContext()).length === 0) {
      return prettier.format(code, { parser: 'babel' });
    }
    const template = codeFactoryResult.find((r) => r instanceof VueComponent)
      ?.template;
    return this.format(`
            ${
  template
    ? `
            <template>
            ${template}
            </template>`
    : ''
}
            ${'<script>'}
            ${code}
            ${'</script>'}
        `);
  }

  createPropertyAccess(expression: Expression, name: Identifier) {
    return new PropertyAccess(expression, name);
  }

  createPropertyAccessChain(
    expression: Expression,
    questionDotToken: string | undefined,
    name: Expression,
  ) {
    return new PropertyAccessChain(expression, questionDotToken, name);
  }

  createJsxExpression(dotDotDotToken = '', expression?: Expression) {
    return new JsxExpression(dotDotDotToken, expression);
  }

  createJsxOpeningElement(
    tagName: Expression,
    typeArguments?: any,
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
    typeArguments?: any,
    attributes?: Array<JsxAttribute | JsxSpreadAttribute>,
  ) {
    return new JsxSelfClosingElement(
      tagName,
      typeArguments,
      attributes,
      this.getContext(),
    );
  }

  createJsxAttributes(properties: Array<JsxAttribute | JsxSpreadAttribute>) {
    return properties;
  }

  createJsxClosingElement(tagName: Expression) {
    return new JsxClosingElement(tagName, this.getContext());
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

  createJsxAttribute(name: Identifier, initializer?: Expression) {
    return new JsxAttribute(name, initializer);
  }

  createAsExpression(expression: Expression, type: TypeExpression) {
    return new AsExpression(expression, type);
  }

  createJsxSpreadAttribute(expression: Expression) {
    return new JsxSpreadAttribute(undefined, expression);
  }

  createNonNullExpression(expression: Expression) {
    return new NonNullExpression(expression);
  }

  createImportDeclarationCore(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
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

  createExpressionWithTypeArguments(
    typeArguments: TypeReferenceNode[] | undefined,
    expression: Expression,
  ) {
    return new ExpressionWithTypeArguments(typeArguments, expression);
  }

  createKeywordTypeNode(kind: string) {
    return addEmptyToString<SimpleTypeExpression>(
      super.createKeywordTypeNode(kind),
    );
  }

  createArrayTypeNode(elementType: TypeExpression) {
    return addEmptyToString<ArrayTypeNode>(
      super.createArrayTypeNode(elementType),
    );
  }

  createLiteralTypeNode(literal: Expression) {
    return addEmptyToString<LiteralTypeNode>(
      super.createLiteralTypeNode(literal),
    );
  }

  createIndexedAccessTypeNode(
    objectType: TypeExpression,
    indexType: TypeExpression,
  ) {
    return addEmptyToString<IndexedAccessTypeNode>(
      super.createIndexedAccessTypeNode(objectType, indexType),
    );
  }

  createIntersectionTypeNode(types: TypeExpression[]) {
    return addEmptyToString<IntersectionTypeNode>(
      super.createIntersectionTypeNode(types),
    );
  }

  createUnionTypeNode(types: TypeExpression[]) {
    return addEmptyToString<UnionTypeNode>(super.createUnionTypeNode(types));
  }

  createParenthesizedType(expression: TypeExpression) {
    return addEmptyToString<ParenthesizedType>(
      super.createParenthesizedType(expression),
    );
  }

  createFunctionTypeNode(
    typeParameters: any,
    parameters: Parameter[],
    type: TypeExpression,
  ) {
    return addEmptyToString<FunctionTypeNode>(
      super.createFunctionTypeNode(typeParameters, parameters, type),
    );
  }

  createTypeAliasDeclaration(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: any,
    type: TypeExpression,
  ) {
    const base = super.createTypeAliasDeclaration(
      decorators,
      modifiers,
      name,
      typeParameters,
      type,
    );

    if (base instanceof TypeAliasDeclaration) {
      return addEmptyToString<TypeAliasDeclaration>(base);
    }

    return base;
  }

  createTypeOperatorNode(type: TypeExpression) {
    return addEmptyToString<TypeOperatorNode>(
      super.createTypeOperatorNode(type),
    );
  }

  createTypeReferenceNode(
    typeName: Identifier,
    typeArguments?: TypeExpression[],
  ) {
    return addEmptyToString<TypeReferenceNode>(
      super.createTypeReferenceNode(typeName, typeArguments),
    );
  }

  createInterfaceDeclaration(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: any[] | undefined,
    heritageClauses: HeritageClause[] | undefined,
    members: Array<PropertySignature | MethodSignature>,
  ) {
    return addEmptyToString<Interface>(
      super.createInterfaceDeclaration(
        decorators,
        modifiers,
        name,
        typeParameters,
        heritageClauses,
        members,
      ),
    );
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

  createBinary(left: Expression, operator: string, right: Expression) {
    return new Binary(left, operator, right);
  }

  createClassDeclarationCore(
    decorators: Decorator[] = [],
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: string[],
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

  addComponent(
    name: string,
    component: VueComponent | VueComponentInput,
    importClause?: ImportClause,
  ) {
    if (
      component instanceof VueComponent
      && importClause?.default?.toString() !== name
    ) {
      importClause?.remove(name);
      importClause?.add(name, component.exportedName);
    }

    super.addComponent(name, component, importClause);
  }
}
