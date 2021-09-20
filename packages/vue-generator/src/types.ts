import { toStringOptions as BaseToStringOptions } from '@devextreme-generator/angular';
import { Expression, ExpressionWithTypeArguments as BaseExpressionWithTypeArguments } from '@devextreme-generator/core';

export declare type InitializedTemplateType = {
  propName: string;
  defaultName: string;
  initializer?: Expression | undefined;
  sourceProp?: string | undefined;
};
export interface toStringOptions extends BaseToStringOptions {
  initializedTemplate?: Array<InitializedTemplateType>;
}

export class ExpressionWithTypeArguments extends BaseExpressionWithTypeArguments {
  toString() {
    return `${this.expression}`;
  }
}
