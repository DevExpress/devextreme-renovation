import BaseGenerator, {
  Binary,
  Call,
  Decorator, Expression, Identifier, ImportClause, ExportDeclaration,
  JsxAttribute, JsxClosingElement, JsxElement, JsxExpression,
  JsxOpeningElement, JsxSelfClosingElement, JsxSpreadAttribute, NamedImports,
  PropertyAccess, SimpleExpression, StringLiteral, VariableDeclarationList,
  VariableStatement, GeneratorResult,
} from '@devextreme-generator/core';
import { ImportDeclaration } from './expressions/import';

interface ComponentInfo {
  name: string;
  jQueryRegistered: boolean;
  hasApiMethod: boolean;
  isGenerated: boolean;
}
export class ReactInfernoGenerator extends BaseGenerator {
  private components: { [key: string]: ComponentInfo } = {};

  getPlatform(): string {
    return 'inferno';
  }

  compileHooksWrapper({ name, jQueryRegistered, hasApiMethod }: ComponentInfo): string {
    if (hasApiMethod) {
      return `
      function Hooks${name}(props, ref) {
      return <${jQueryRegistered ? 'InfernoWrapperComponent' : 'HookContainer'} renderFn={
          React${name}
        } renderProps={props} renderRef={ref}/>
      }
      const ${name} = forwardRef(Hooks${name});
      export { ${name} };
    `;
    }
    return `
    function Hooks${name}(props) {
    return <${jQueryRegistered ? 'InfernoWrapperComponent' : 'HookContainer'} renderFn={
      ${name}
      } renderProps={props}/>
    }
    export {Hooks${name} as ${name}}
    `;
  }

  createExpressionStatement(expression: Expression): Expression {
    const expresssionStatement = super.createExpressionStatement(expression);
    if ((expression instanceof Binary)
      && (expression.left instanceof PropertyAccess)) {
      const componentName = expression.left.expression.toString();
      const componentInfo = this.components[componentName];
      if (componentInfo && componentInfo.hasApiMethod) {
        const isdefaultProps = expression.left.name.toString() === 'defaultProps';
        if (isdefaultProps) {
          const expressionStr = expresssionStatement.toString();
          expresssionStatement.toString = () => (`${expressionStr};
            Hooks${componentName}.defaultProps = ${componentName}.defaultProps;`);
        }
      }
    }
    return expresssionStatement;
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

  createExportDeclaration(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    exportClause: NamedImports | undefined,
    moduleSpecifier?: Expression,
  ): ExportDeclaration | string {
    if (exportClause) {
      const componentInfo = Object.entries(this.components)
        .find(([key]) => exportClause.has(key));
      if (componentInfo) {
        componentInfo[1].isGenerated = true;
        return `
      ${this.compileHooksWrapper(componentInfo[1])}`;
      }
    }
    return super.createExportDeclaration(decorators, modifiers, exportClause, moduleSpecifier);
  }

  createExportAssignment(
    _decorators: Decorator[] = [],
    _modifiers: string[] = [],
    _isExportEquals: any,
    expression: Expression,
  ): string {
    return `export default ${expression}`;
  }

  createVariableStatement(
    modifiers: string[] | undefined,
    declarationList: VariableDeclarationList,
  ): VariableStatement {
    const componentDeclaration = declarationList.declarations
      .find(({ name }) => this.components[name.toString()]);
    if (componentDeclaration) {
      componentDeclaration.name = new Identifier(`React${componentDeclaration.name.toString()}`);
      componentDeclaration.initializer = (componentDeclaration.initializer as Call)
        .argumentsArray[0];
    }
    return super.createVariableStatement(modifiers, declarationList);
  }

  postProcessResult(results: GeneratorResult[]): void {
    const hasNotProcessedComponents = Object.values(this.components)
      .filter(({ isGenerated }) => (!isGenerated));
    if (hasNotProcessedComponents.length > 0) {
      throw new Error(`Not all components were processed: ${hasNotProcessedComponents.map(({ name }) => (name))}`);
    }
    const hasAbsentDefaultExport = Object.values(this.components)
      .filter(({ name, jQueryRegistered }) => jQueryRegistered && results[0].code.indexOf(`export default ${name}`) === -1);
    if (hasAbsentDefaultExport.length > 0) {
      throw new Error(`Not all jQuery registred components were default export: ${hasAbsentDefaultExport.map(({ name }) => (name))}`);
    }
    this.components = {};
  }
}
