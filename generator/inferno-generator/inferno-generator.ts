import { PreactGenerator, JsxAttribute } from "../preact-generator";
import { Decorator } from "../base-generator/expressions/decorator";
import { Identifier } from "../base-generator/expressions/common";
import { HeritageClause } from "../react-generator/expressions/heritage-clause";
import { InfernoComponent } from "./expressions/inferno-component";
import { TypeExpression } from "../base-generator/expressions/type";
import { Expression } from "../base-generator/expressions/base";
import { Property } from "./expressions/class-members/property";
import { PropertyAccess } from "./expressions/property-access";
import { Parameter } from "../base-generator/expressions/functions";
import { Block } from "../base-generator/expressions/statements";
import { GetAccessor } from "./expressions/class-members/get-accessor";
import { TypeReferenceNode } from "./expressions/type-reference-node";
import { ComponentInput } from "../preact-generator";
import { TypeParameterDeclaration } from "../base-generator/expressions/type-parameter-declaration";
import { Method } from "./expressions/class-members/method";
import { JsxOpeningElement } from "./expressions/jsx/jsx-opening-element";
import { JsxClosingElement } from "./expressions/jsx/jsx-closing-element";
import { ImportDeclaration } from "./expressions/import-declaration";
import { ImportClause } from "../base-generator/expressions/import";
import { StringLiteral } from "../base-generator/expressions/literal";

export class InfernoGenerator extends PreactGenerator {
  // format(code: string) {
  //     return code;
  // }
  createComponent(
    componentDecorator: Decorator,
    modifiers: string[],
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>
  ) {
    return new InfernoComponent(
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
      members,
      this.getContext()
    );
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

  createPropertyAccess(expression: Expression, name: Identifier) {
    return new PropertyAccess(expression, name);
  }

  createTypeReferenceNode(
    typeName: Identifier,
    typeArguments?: TypeExpression[]
  ) {
    return new TypeReferenceNode(typeName, typeArguments, this.getContext());
  }

  createJsxOpeningElement(
    tagName: Identifier,
    typeArguments: any[],
    attributes: JsxAttribute[] = []
  ) {
    return new JsxOpeningElement(
      tagName,
      typeArguments,
      attributes,
      this.getContext()
    );
  }

  createJsxClosingElement(tagName: Identifier) {
    return new JsxClosingElement(tagName);
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
}
