import BaseGenerator, {
  Expression,
  Identifier,
  Decorator,
  Parameter,
  ImportClause,
  StringLiteral,
  Block,
  TypeParameterDeclaration,
  ExpressionWithTypeArguments,
  TypeExpression,
  JsxSpreadAttribute,
  JsxExpression,
} from '@devextreme-generator/core';
import { GetAccessor } from './expressions/class-members/get-accessor';
import { Method } from './expressions/class-members/method';
import { Property } from './expressions/class-members/property';
import { HeritageClause } from './expressions/heritage-clause';
import { ImportDeclaration } from './expressions/import-declaration';
import { JsxAttribute } from './expressions/jsx/jsx-attribute';
import { JsxClosingElement } from './expressions/jsx/jsx-closing-element';
import { JsxElement } from './expressions/jsx/jsx-element';
import { JsxOpeningElement } from './expressions/jsx/jsx-opening-element';
import { JsxSelfClosingElement } from './expressions/jsx/jsx-self-closing-element';
import { PropertyAccess } from './expressions/property-access';
import { ReactComponent } from './expressions/react-component';
import { ComponentInput } from './expressions/react-component-input';
import { TypeReferenceNode } from './expressions/type-reference-node';
import { New, Call } from './expressions/common';

export class ReactGenerator extends BaseGenerator {
  getPlatform(): string {
    return 'react';
  }

  createHeritageClause(token: string, types: ExpressionWithTypeArguments[]) {
    return new HeritageClause(token, types, this.getContext());
  }

  createComponent(
    componentDecorator: Decorator,
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
  ) {
    return new ReactComponent(
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

  createJsxAttribute(name: Identifier, initializer?: Expression) {
    return new JsxAttribute(name, initializer);
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

  createJsxOpeningElement(
    tagName: Identifier,
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
    tagName: Identifier,
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

  createJsxClosingElement(tagName: Identifier) {
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

  createPropertyAccess(expression: Expression, name: Identifier) {
    return new PropertyAccess(expression, name);
  }

  createTypeReferenceNode(
    typeName: Identifier,
    typeArguments: TypeExpression[] = [],
  ) {
    return new TypeReferenceNode(typeName, typeArguments, this.getContext());
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

  createNew(
    expression: Expression,
    typeArguments: TypeExpression[] | undefined,
    argumentsArray: Expression[],
  ) {
    return new New(expression, typeArguments, argumentsArray);
  }

  createCall(
    expression: Expression,
    typeArguments: TypeExpression[] | undefined,
    argumentsArray?: Expression[],
  ) {
    return new Call(expression, typeArguments, argumentsArray);
  }
}
