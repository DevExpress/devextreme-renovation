import {
  Function as CoreFunction,
  Decorator, Identifier, Block, TypeExpression, Parameter,
  toStringOptions, TypeParameterDeclaration, GeneratorContext,
} from '@devextreme-generator/core';
import { ComponentInfo } from '../component-info';
import { getInfernoHooksWrapper } from './common/get-inferno-hooks-wrapper';

export class InfernoHooksFunctionComponentWrapper extends CoreFunction {
  componentInfo: ComponentInfo;

  constructor(
    componentInfo: ComponentInfo,
    decorators: Decorator[] = [],
    asteriskToken: string,
    name: Identifier | undefined,
    typeParameters: TypeParameterDeclaration[] | undefined,
    parameters: Parameter[],
    type: TypeExpression | string | undefined,
    body: Block | undefined,
    context: GeneratorContext,
  ) {
    super(decorators, [], asteriskToken, name, typeParameters, parameters, type, body, context);
    this.componentInfo = componentInfo;
  }

  toString(options?: toStringOptions | undefined): string {
    const result = `${super.toString(options)}
    ${getInfernoHooksWrapper(this.componentInfo)}`;

    return result;
  }
}
