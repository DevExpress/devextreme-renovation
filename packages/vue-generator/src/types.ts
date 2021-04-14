import { toStringOptions as BaseToStringOptions } from '@devextreme-generator/angular';
import { ExpressionWithTypeArguments as BaseExpressionWithTypeArguments } from '@devextreme-generator/core';

export declare type toStringOptions = BaseToStringOptions;

export class ExpressionWithTypeArguments extends BaseExpressionWithTypeArguments {
  toString() {
    return `${this.expression}`;
  }
}
