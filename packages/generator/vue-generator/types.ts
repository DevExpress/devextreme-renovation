import { toStringOptions as BaseToStringOptions } from "../angular-generator/types";
import { ExpressionWithTypeArguments as BaseExpressionWithTypeArguments } from "../base-generator/expressions/type";
export declare type toStringOptions = BaseToStringOptions;

export class ExpressionWithTypeArguments extends BaseExpressionWithTypeArguments {
  toString() {
    return `${this.expression}`;
  }
}
