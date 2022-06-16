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

  constructor(
    componentInfo: ComponentInfo,
    componentDeclaration: VariableDeclaration,
    modifiers: string[] = [],
    declarationList: VariableDeclarationList,
  ) {
    super([], declarationList);
    this.hasExport = modifiers.indexOf(SyntaxKind.ExportKeyword) !== -1;
    this.componentInfo = componentInfo;
    componentDeclaration.name = new Identifier(`React${componentDeclaration.name.toString()}`);
    componentDeclaration.initializer = (componentDeclaration.initializer as Call)
      .argumentsArray[0];
  }

  toString(options?: toStringOptions | undefined): string {
    return `${super.toString(options)}
    ${getInfernoHooksWrapper(this.componentInfo, this.hasExport)}`;
  }
}
