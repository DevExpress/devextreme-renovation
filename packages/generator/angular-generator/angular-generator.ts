import Generator from "../base-generator";
import { Call } from "../base-generator/expressions/common";
import { Method } from "../base-generator/expressions/class-members";
import { Expression } from "../base-generator/expressions/base";
import { Identifier } from "../base-generator/expressions/common";
import { Block } from "../base-generator/expressions/statements";
import { Parameter } from "../base-generator/expressions/functions";
import { TypeExpression } from "../base-generator/expressions/type";
import { HeritageClause } from "../base-generator/expressions/class";
import { ImportClause } from "../base-generator/expressions/import";
import { ComponentInput as BaseComponentInput } from "../base-generator/expressions/component-input";
import { BindingPattern } from "../base-generator/expressions/binding-pattern";
import { TypeParameterDeclaration } from "../base-generator/expressions/type-parameter-declaration";
import { JsxExpression } from "./expressions/jsx/jsx-expression";
import { JsxAttribute } from "./expressions/jsx/attribute";
import { JsxSpreadAttribute } from "./expressions/jsx/spread-attribute";
import {
  JsxOpeningElement,
  JsxSelfClosingElement,
  JsxClosingElement,
} from "./expressions/jsx/jsx-opening-element";
import { JsxElement } from "./expressions/jsx/elements";
import { Decorator } from "./expressions/decorator";
import { ComponentInput } from "./expressions/component-input";
import { AngularComponent } from "./expressions/component";
import { Property } from "./expressions/class-members/property";
import { GetAccessor } from "./expressions/class-members/get-accessor";
import { VariableDeclaration } from "./expressions/variable-expression";
import { ArrowFunction } from "./expressions/functions/arrow-function";
import { Function } from "./expressions/functions/function";
import { PropertyAccess } from "./expressions/property-access";
import { AsExpression } from "./expressions/as-expression";
import { counter } from "./counter";
import { GeneratorContext } from "../base-generator/types";
import { AngularGeneratorContext } from "./types";
import { NonNullExpression } from "./expressions/non-null-expression";
import { StringLiteral } from "../base-generator/expressions/literal";
import { ImportDeclaration } from "./expressions/import-declaration";
import {
  VariableDeclarationList,
  VariableStatement,
} from "../base-generator/expressions/variables";
import { ContextDeclaration } from "./expressions/context-declaration";
import { PropertyAccessChain } from "./expressions/property-access-chain";
import { TypeReferenceNode } from "./expressions/type-reference-node";

export class AngularGenerator extends Generator {
  createJsxExpression(dotDotDotToken: string = "", expression?: Expression) {
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
    attributes?: Array<JsxAttribute | JsxSpreadAttribute>
  ) {
    return new JsxOpeningElement(
      tagName,
      typeArguments,
      attributes,
      this.getContext()
    );
  }

  createVariableStatement(
    modifiers: string[] | undefined,
    declarationList: VariableDeclarationList
  ) {
    if (
      declarationList.declarations[0].initializer
        ?.toString()
        .startsWith("createContext")
    ) {
      return new ContextDeclaration(modifiers, declarationList);
    }
    return new VariableStatement(modifiers, declarationList);
  }

  createJsxSelfClosingElement(
    tagName: Expression,
    typeArguments?: any,
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
    return new JsxClosingElement(tagName, this.getContext());
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

  createFunctionDeclarationCore(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    asteriskToken: string,
    name: Identifier,
    typeParameters: any,
    parameters: Parameter[],
    type: TypeExpression | undefined,
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

  createArrowFunction(
    modifiers: string[] | undefined,
    typeParameters: any,
    parameters: Parameter[],
    type: TypeExpression | undefined,
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

  createVariableDeclarationCore(
    name: Identifier | BindingPattern,
    type?: TypeExpression,
    initializer?: Expression
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
    decorators: Decorator[],
    modifiers: string[] | undefined,
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

  createComponent(
    componentDecorator: Decorator,
    modifiers: string[],
    name: Identifier,
    typeParameters: any,
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>
  ) {
    return new AngularComponent(
      componentDecorator,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      this.getContext()
    );
  }

  createPropertyAccess(expression: Expression, name: Identifier) {
    return new PropertyAccess(expression, name);
  }

  createPropertyAccessChain(
    expression: Expression,
    questionDotToken: string | undefined,
    name: Expression
  ) {
    return new PropertyAccessChain(expression, questionDotToken, name);
  }

  createAsExpression(expression: Expression, type: TypeExpression) {
    return new AsExpression(expression, type);
  }

  createTypeReferenceNode(
    typeName: Identifier,
    typeArguments?: TypeExpression[]
  ) {
    return new TypeReferenceNode(typeName, typeArguments, this.getContext());
  }

  createNonNullExpression(expression: Expression) {
    return new NonNullExpression(expression);
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
      moduleSpecifier,
      this.getContext()
    );
  }

  context: AngularGeneratorContext[] = [];

  getContext() {
    return super.getContext() as AngularGeneratorContext;
  }

  setContext(context: GeneratorContext | null) {
    !context && counter.reset();
    return super.setContext(context);
  }

  addComponent(
    name: string,
    component: BaseComponentInput | BaseComponentInput,
    importClause?: ImportClause
  ) {
    if (component instanceof AngularComponent) {
      importClause?.add(component.module);
    }
    super.addComponent(name, component, importClause);
  }
}
