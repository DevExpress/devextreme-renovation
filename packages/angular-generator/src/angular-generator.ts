import Generator, {
  StringLiteral,
  GeneratorContext,
  Method,
  Expression,
  Identifier,
  Block,
  Parameter,
  TypeExpression,
  HeritageClause,
  ImportClause,
  ComponentInput as BaseComponentInput,
  BindingPattern,
  TypeParameterDeclaration,
  VariableDeclarationList,
  VariableStatement,
} from '@devextreme-generator/core';
import { counter } from './counter';
import { AsExpression } from './expressions/as-expression';
import { GetAccessor } from './expressions/class-members/get-accessor';
import { Property } from './expressions/class-members/property';
import { AngularComponent } from './expressions/component';
import { ComponentInput } from './expressions/component-input';
import { ContextDeclaration } from './expressions/context-declaration';
import { Decorator } from './expressions/decorator';
import { ArrowFunction } from './expressions/functions/arrow-function';
import { Function } from './expressions/functions/function';
import { ImportDeclaration } from './expressions/import-declaration';
import { JsxAttribute } from './expressions/jsx/attribute';
import { JsxElement } from './expressions/jsx/elements';
import { JsxExpression } from './expressions/jsx/jsx-expression';
import { JsxSpreadAttribute } from './expressions/jsx/spread-attribute';
import { NonNullExpression } from './expressions/non-null-expression';
import { PropertyAccess } from './expressions/property-access';
import { PropertyAccessChain } from './expressions/property-access-chain';
import { TypeReferenceNode } from './expressions/type-reference-node';
import { VariableDeclaration } from './expressions/variable-expression';
import { Call } from './expressions/common';
import { AngularGeneratorContext } from './types';
import {
  JsxOpeningElement,
  JsxSelfClosingElement,
  JsxClosingElement,
} from './expressions/jsx/jsx-opening-element';

export class AngularGenerator extends Generator {
  getPlatform(): string {
    return 'angular';
  }

  createJsxExpression(dotDotDotToken = '', expression?: Expression) {
    return new JsxExpression(dotDotDotToken, expression);
  }

  createJsxAttribute(name: Identifier, initializer?: Expression) {
    return new JsxAttribute(name, initializer);
  }

  createJsxSpreadAttribute(expression: Expression) {
    return new JsxSpreadAttribute(undefined, expression);
  }

  createJsxAttributes(properties: JsxAttribute[]) {
    return properties;
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

  createVariableStatement(
    modifiers: string[] | undefined,
    declarationList: VariableDeclarationList,
  ) {
    if (
      declarationList.declarations[0].initializer
        ?.toString()
        .startsWith('createContext')
    ) {
      return new ContextDeclaration(modifiers, declarationList);
    }
    return new VariableStatement(modifiers, declarationList);
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
    type: TypeExpression | undefined,
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

  createDecorator(expression: Call) {
    return new Decorator(expression, this.getContext());
  }

  createComponentBindings(
    decorators: Decorator[],
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
  ) {
    return new ComponentInput(
      decorators,
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

  createCall(
    expression: Expression,
    typeArguments: TypeExpression[] | undefined,
    argumentsArray?: Expression[],
  ) {
    return new Call(expression, typeArguments, argumentsArray);
  }

  createMethod(
    decorators: Decorator[],
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

  createComponent(
    componentDecorator: Decorator,
    modifiers: string[],
    name: Identifier,
    typeParameters: any,
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
  ) {
    return new AngularComponent(
      componentDecorator,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      this.getContext(),
    );
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

  createAsExpression(expression: Expression, type: TypeExpression) {
    return new AsExpression(expression, type);
  }

  createTypeReferenceNode(
    typeName: Identifier,
    typeArguments: TypeExpression[] = [],
  ) {
    return new TypeReferenceNode(typeName, typeArguments, this.getContext());
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

  context: AngularGeneratorContext[] = [];

  getContext() {
    return super.getContext() as AngularGeneratorContext;
  }

  setContext(context: GeneratorContext | null) {
    if (!context) {
      counter.reset();
    }
    return super.setContext(context);
  }

  addComponent(
    name: string,
    component: BaseComponentInput,
    importClause?: ImportClause,
  ) {
    if (component instanceof AngularComponent) {
      importClause?.add(component.module);
    }
    super.addComponent(name, component, importClause);
  }
}
