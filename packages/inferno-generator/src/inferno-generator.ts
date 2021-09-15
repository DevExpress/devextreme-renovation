import {
  BindingPattern,
  Block,
  Decorator,
  Expression,
  Identifier,
  ImportClause,
  Parameter,
  StringLiteral,
  TypeExpression,
  TypeParameterDeclaration,
} from '@devextreme-generator/core';
import { PreactGenerator } from '@devextreme-generator/preact';
import { HeritageClause } from '@devextreme-generator/react';

import { GetAccessor } from './expressions/class-members/get-accessor';
import { Method } from './expressions/class-members/method';
import { Property } from './expressions/class-members/property';
import { ImportDeclaration } from './expressions/import-declaration';
import { InfernoComponent } from './expressions/inferno-component';
import { JsxClosingElement } from './expressions/jsx/jsx-closing-element';
import { JsxOpeningElement } from './expressions/jsx/jsx-opening-element';
import { PropertyAccess } from './expressions/property-access';
import { TypeReferenceNode } from './expressions/type-reference-node';
import { JsxAttribute } from './expressions/jsx/attribute';
import { VariableDeclaration } from './expressions/variable-declaration';

export class InfernoGenerator extends PreactGenerator {
  getPlatform(): string {
    return 'inferno';
  }

  createComponent(
    componentDecorator: Decorator,
    modifiers: string[],
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
  ) {
    return new InfernoComponent(
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

  createPropertyAccess(expression: Expression, name: Identifier) {
    return new PropertyAccess(expression, name);
  }

  createTypeReferenceNode(
    typeName: Identifier,
    typeArguments: TypeExpression[] = [],
  ) {
    return new TypeReferenceNode(typeName, typeArguments, this.getContext());
  }

  createJsxOpeningElement(
    tagName: Identifier,
    typeArguments: any[],
    attributes: JsxAttribute[] = [],
  ) {
    return new JsxOpeningElement(
      tagName,
      typeArguments,
      attributes,
      this.getContext(),
    );
  }

  createJsxClosingElement(tagName: Identifier) {
    return new JsxClosingElement(tagName);
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

  createJsxAttribute(name: Identifier, initializer?: Expression) {
    return new JsxAttribute(name, initializer);
  }

  createVariableDeclarationCore(
    name: Identifier | BindingPattern,
    type?: TypeExpression,
    initializer?: Expression,
  ) {
    return new VariableDeclaration(name, type, initializer);
  }
}
