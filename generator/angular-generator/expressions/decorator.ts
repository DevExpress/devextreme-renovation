import { Decorator as BaseDecorator } from "../../base-generator/expressions/decorator";
import { toStringOptions } from "../types";
import { Decorators } from "../../component_declaration/decorators";
import { ObjectLiteral } from "../../base-generator/expressions/literal";
import { TemplateExpression } from "../../base-generator/expressions/template";
import { isElement } from "./jsx/elements";
import { getJsxExpression } from "../../base-generator/expressions/jsx";
import { BaseFunction } from "../../base-generator/expressions/functions";
import { Identifier } from "../../base-generator/expressions/common";
import { GeneratorContext } from "../../base-generator/types";
import { getAngularSelector } from "./component";
import { FunctionTypeNode } from "../../base-generator/expressions/type";

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
          const expression = getJsxExpression(options!.variables![i]);
          if (isElement(expression)) {
            template += `
            <ng-template #${i}>
              ${expression.toString(options)}
            </ng-template>
            `;
          }
        });
        const templates = compileDefaultTemplates(options, this.context);
        if (templates?.length) template += templates.join("");
        if (template) {
          parameters.setProperty(
            "template",
            new TemplateExpression(template, [])
          );
        }
      }

      [
        "view",
        "defaultOptionRules",
        "jQuery",
        "isSVG",
        "name",
        "components",
      ].forEach((name) => parameters.removeProperty(name));
    } else if (this.name === Decorators.Event) {
      return "@Output()";
    }
    return super.toString();
  }
}

function compileDefaultTemplates(
  options?: toStringOptions,
  context?: GeneratorContext
): string[] | undefined {
  if (options?.defaultTemplates) {
    return Object.entries(options.defaultTemplates)
      .map((i) => {
        const [name, template] = i;

        if (template.initializer instanceof Identifier && context?.components) {
          const component = context.components[template.initializer.toString()];
          const templateString = `<ng-template #${name}Default ${template.variables
            .map((v) => `let-${v}="${v}"`)
            .join(" ")}><${getAngularSelector(
            component.name
          )} ${template.variables
            .map((v) => {
              const componentProp = component.heritageProperties.find(
                (p) => p.name.toString() === v
              );
              if (componentProp?.type instanceof FunctionTypeNode) {
                return `(${v})="${v} !== undefined ? ${v}($event) : ${component.name}Defaults.${v}($event)"`;
              }
              return `[${v}]="${v} !== undefined ? ${v} : ${component.name}Defaults.${v}"`;
            })
            .join(" ")}></${getAngularSelector(component.name)}>
            </ng-template>`;
          return templateString;
        }
        if (template.initializer instanceof BaseFunction) {
          const templateString = `  <ng-template #${name}Default ${template.variables
            .map((v) => `let-${v}="${v}"`)
            .join(" ")}>
            ${template.initializer.getTemplate({
              members: [],
              newComponentContext: "",
            })}
            </ng-template>`;
          return templateString;
        }
      })
      .filter((s) => s) as string[];
  }
}
