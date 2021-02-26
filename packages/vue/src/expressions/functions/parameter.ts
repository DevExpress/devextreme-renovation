import { Parameter as BaseParameter } from "../../../base-generator/expressions/functions";
import { variableDeclaration } from "../../../base-generator/utils/string";

export class Parameter extends BaseParameter {
  toString() {
    return variableDeclaration(
      this.name,
      undefined,
      this.initializer,
      undefined,
      this.dotDotDotToken
    );
  }
}
