import { AngularDirective } from "@devextreme-generator/angular";
import { toStringOptions } from "../../types";

export class VueDirective extends AngularDirective {
  getTemplateProp(options?: toStringOptions) {
    return this.toString(options);
  }
}
