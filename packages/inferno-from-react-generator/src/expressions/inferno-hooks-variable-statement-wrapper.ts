import {
  Call,
  Identifier,
  SyntaxKind,
  toStringOptions, VariableDeclaration, VariableDeclarationList, VariableStatement,
} from '@devextreme-generator/core';
import { ComponentInfo } from '../component-info';
import { getInfernoHooksWrapper } from './common/get-inferno-hooks-wrapper';

export class InfernoHooksVariableStatementWrapper extends VariableStatement {
  componentInfo: ComponentInfo;

  hasExport = false;

  pureComponent = false;

  constructor(
    componentInfo: ComponentInfo,
    componentDeclaration: VariableDeclaration,
    modifiers: string[] = [],
    declarationList: VariableDeclarationList,
  ) {
    super([], declarationList);
    this.hasExport = modifiers.indexOf(SyntaxKind.ExportKeyword) !== -1;
    this.componentInfo = componentInfo;
    if (componentDeclaration.initializer instanceof Call) {
      const call = componentDeclaration.initializer;
      const expressionStr = call.expression.toString();
      if (expressionStr === 'forwardRef') {
        componentDeclaration.name = new Identifier(`React${componentDeclaration.name.toString()}`);
      }
      if (expressionStr === 'memo' || expressionStr === 'React.memo') {
        this.pureComponent = true;
      }
      componentDeclaration.initializer = call.argumentsArray[0];
    }
  }

  toString(options?: toStringOptions | undefined): string {
    return `${super.toString(options)}
    ${getInfernoHooksWrapper(this.componentInfo, this.hasExport, this.pureComponent)}`;
  }
}
