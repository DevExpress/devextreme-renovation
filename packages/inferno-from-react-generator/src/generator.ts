import BaseGenerator, {
  Function as CoreFunction,
  Decorator, Expression, Identifier, ImportClause,
  JsxAttribute, JsxClosingElement, JsxElement, JsxExpression,
  JsxOpeningElement, JsxSelfClosingElement, JsxSpreadAttribute,
  PropertyAccess, SimpleExpression, StringLiteral, VariableDeclarationList,
  VariableStatement, Block, TypeExpression, Parameter,
} from '@devextreme-generator/core';
import { ComponentInfo } from './component-info';
import { ImportDeclaration } from './expressions/import';
import { InfernoHooksFunctionComponentWrapper } from './expressions/inferno-hooks-function-component-wrapper';
import { InfernoHooksVariableStatementWrapper } from './expressions/inferno-hooks-variable-statement-wrapper';

export class InfernoFromReactGenerator extends BaseGenerator {
  private components: { [key: string]: ComponentInfo } = {};

  getPlatform(): string {
    return 'inferno';
  }

  createPropertyAccess(expression: Expression, name: Identifier): PropertyAccess {
    const componentName = expression?.toString();
    const isdefaultProps = name?.toString() === 'defaultProps';
    const componentInfo = this.components[componentName];
    return super.createPropertyAccess(componentInfo && !componentInfo.hasApiMethod && isdefaultProps ? new SimpleExpression(`Hooks${componentName}`) : expression, name);
  }

  createComponentComments(comments: string[]): void {
    comments.forEach((comment) => {
      if (comment.indexOf('Component={') !== -1) {
        const componentInfoString = comment.slice(comment.indexOf('{'));
        const componentInfo: ComponentInfo = JSON.parse(componentInfoString);
        this.components[componentInfo.name] = componentInfo;
      }
    });
  }

  createImportDeclaration(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    importClause: ImportClause = new ImportClause(),
    moduleSpecifier: StringLiteral,
  ): ImportDeclaration {
    return new ImportDeclaration(decorators, modifiers, importClause,
      moduleSpecifier, this.getContext());
  }

  createJsxOpeningFragment(
    _: Expression,
    typeArguments: any[],
    attributes?: Array<JsxAttribute | JsxSpreadAttribute>,
  ): JsxOpeningElement {
    return new JsxOpeningElement(new SimpleExpression(''), typeArguments, attributes, this.getContext());
  }

  createJsxClosingFragment(): JsxClosingElement {
    return new JsxClosingElement(new SimpleExpression(''));
  }

  createJsxFragment(
    openingElement: JsxOpeningElement,
    children: (JsxElement | string | JsxExpression | JsxSelfClosingElement)[],
    closingElement: JsxClosingElement,
  ): JsxElement {
    return new JsxElement(openingElement, children, closingElement);
  }

  createVariableStatement(
    modifiers: string[] | undefined,
    declarationList: VariableDeclarationList,
  ): VariableStatement {
    const componentDeclaration = declarationList.declarations
      .find(({ name }) => this.components[name.toString()]);
    if (componentDeclaration) {
      const componentInfo = this.components[componentDeclaration.name.toString()];
      componentInfo.isGenerated = true;
      return new InfernoHooksVariableStatementWrapper(
        componentInfo,
        componentDeclaration,
        modifiers,
        declarationList,
      );
    }
    return super.createVariableStatement(modifiers, declarationList);
  }

  createFunctionDeclaration(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    asteriskToken: string,
    name: Identifier,
    typeParameters: any,
    parameters: Parameter[],
    type: TypeExpression | string | undefined,
    body: Block | undefined,
  ): CoreFunction {
    const componentInfo = this.components[name.toString()];
    if (componentInfo) {
      componentInfo.isGenerated = true;
      const functionResult = new InfernoHooksFunctionComponentWrapper(
        componentInfo,
        decorators,
        asteriskToken,
        name,
        typeParameters,
        parameters,
        type,
        body,
        this.getContext(),
      );
      return functionResult;
    }
    const functionDeclaration = super.createFunctionDeclaration(
      decorators,
      modifiers,
      asteriskToken,
      name,
      typeParameters,
      parameters,
      type,
      body,
    );
    return functionDeclaration;
  }

  postProcessResult(): void {
    const hasNotProcessedComponents = Object.values(this.components)
      .filter(({ isGenerated }) => (!isGenerated));
    if (hasNotProcessedComponents.length > 0) {
      const componentNames = hasNotProcessedComponents
        .map(({ name }) => (name))
        .join(', ');
      throw new Error(`Not all components were processed: ${componentNames}`);
    }
    this.components = {};
  }
}
