import { Parameter as BaseParameter, variableDeclaration } from "@devextreme-generator/core";

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
