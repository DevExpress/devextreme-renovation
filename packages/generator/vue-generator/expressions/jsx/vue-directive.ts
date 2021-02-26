import { AngularDirective } from "../../../angular-generator/expressions/jsx/angular-directive";
import { toStringOptions } from "../../types";

export class VueDirective extends AngularDirective {
  getTemplateProp(options?: toStringOptions) {
    return this.toString(options);
  }
}
