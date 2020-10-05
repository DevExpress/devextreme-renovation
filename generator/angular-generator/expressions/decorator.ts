import { Decorator as BaseDecorator } from "../../base-generator/expressions/decorator";
import { toStringOptions } from "../types";
import { Decorators } from "../../component_declaration/decorators";
import { ObjectLiteral } from "../../base-generator/expressions/literal";
import { TemplateExpression } from "../../base-generator/expressions/template";
import { isElement } from "./jsx/elements";

export class Decorator extends BaseDecorator {
  toString(options?: toStringOptions) {
    if (
      this.name === Decorators.OneWay ||
      this.name === Decorators.TwoWay ||
      this.name === Decorators.Template ||
      this.name === Decorators.RefProp ||
      this.name === Decorators.Nested ||
      this.name === Decorators.ForwardRefProp
    ) {
      return "@Input()";
    } else if (
      this.name === Decorators.Effect ||
      this.name === Decorators.Ref ||
      this.name === Decorators.ApiRef ||
      this.name === Decorators.InternalState ||
      this.name === Decorators.Method ||
      this.name === Decorators.ForwardRef
    ) {
      return "";
    } else if (this.name === Decorators.Component) {
      const parameters = this.expression.arguments[0] as ObjectLiteral;
      const viewFunction = this.getViewFunction();
      if (viewFunction) {
        let template = viewFunction.getTemplate(options);
        Object.keys(options?.variables || {}).forEach((i) => {
          if (isElement(options!.variables![i])) {
            template += `
            <ng-template #${i}>
              ${options!.variables![i].toString(options)}
              </ng-template>
            `;
          }
        });
        if (template) {
          parameters.setProperty(
            "template",
            new TemplateExpression(template, [])
          );
        }
      }

      parameters.removeProperty("view");
      parameters.removeProperty("viewModel");
      parameters.removeProperty("defaultOptionRules");
      parameters.removeProperty("jQuery");
    } else if (this.name === Decorators.Event) {
      return "@Output()";
    }
    return super.toString();
  }
}
