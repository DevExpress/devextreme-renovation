import { VariableDeclaration as BaseVariableDeclaration } from "../../angular-generator/expressions/variable-expression";
import { Call } from "../../base-generator/expressions/common";
import { toStringOptions } from "../types";

export class VariableDeclaration extends BaseVariableDeclaration {
  toString(options?: toStringOptions) {
    if (
      this.initializer instanceof Call &&
      this.initializer.toString().startsWith("createContext")
    ) {
      return `${this.name} = (value=${this.initializer.arguments[0]})=>{
              return {
                value
              }
            }`;
    }
    return super.toString(options);
  }
}
