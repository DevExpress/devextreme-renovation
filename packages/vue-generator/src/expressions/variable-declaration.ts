import { toStringOptions } from '../types';
import { VariableDeclaration as BaseVariableDeclaration } from '@devextreme-generator/angular';
import { Call } from '@devextreme-generator/core';

export class VariableDeclaration extends BaseVariableDeclaration {
  toString(options?: toStringOptions) {
    if (
      this.initializer instanceof Call &&
      this.initializer.toString().startsWith("createContext")
    ) {
      return `${this.name} = (value=${this.initializer.arguments[0]})=>{
              return Vue.observable({
                value
              })
            }`;
    }
    return super.toString(options);
  }
}
