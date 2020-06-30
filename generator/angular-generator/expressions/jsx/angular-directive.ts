import { JsxAttribute } from "./attribute";
import { toStringOptions } from "../../types";

export class AngularDirective extends JsxAttribute { 
    getTemplateContext() { 
        return null;
    }
    toString(options?: toStringOptions) { 
        const initializer = this.compileInitializer(options);
        const value = initializer ? `="${initializer}"` : "";
        return `${this.name}${value}`;
    }
}
