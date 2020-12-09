import { Decorator as BaseDecorator } from "../../base-generator/expressions/decorator";
import { toStringOptions } from "../types";
import { Decorators } from "../../component_declaration/decorators";
import { ObjectLiteral } from "../../base-generator/expressions/literal";
import { TemplateExpression } from "../../base-generator/expressions/template";
import { isElement } from "./jsx/elements";
import { getJsxExpression } from "../../base-generator/expressions/jsx";
import { BaseFunction } from "../../base-generator/expressions/functions";
import { Identifier } from "../../base-generator/expressions/common";
import { SimpleExpression } from "../../base-generator/expressions/base";
import { GeneratorContext } from "../../base-generator/types";
import { getAngularSelector } from "./component";
import { getProps } from "../../base-generator/expressions/component";
import { FunctionTypeNode } from "../../base-generator/expressions/type";
import { Property } from "../../base-generator/expressions/class-members";

function isInputDecorator(name: string) {
  return (
    name === Decorators.OneWay ||
    name === Decorators.TwoWay ||
    name === Decorators.Template ||
    name === Decorators.RefProp ||
    name === Decorators.Nested ||
    name === Decorators.ForwardRefProp
  );
}

function isOutputDecorator(name: string) {
  return name === Decorators.Event;
}

function getProperiesName(
  props: Property[],
  specificDecorator: (name: string) => boolean
): string {
  return props
    .filter((prop: Property) => {
      return prop.decorators.some((d) => {
        return specificDecorator(d.name);
      });
    })
    .map((m) => m.name)
    .join();
}

function setComponentProperty(
  componentParameters: ObjectLiteral,
  name: string,
  value: string
) {
  if (value) {
    componentParameters.setProperty(
      name,
      new SimpleExpression(`[${value.replace(/(\w+)/g, '"$1"')}]`)
    );
  }
}

export class Decorator extends BaseDecorator {
  toString(options?: toStringOptions) {
    if (isInputDecorator(this.name)) {
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
      if (options) {
        const props = getProps(options.members);
        const inputs = getProperiesName(props, isInputDecorator);
        const outputs = getProperiesName(props, isOutputDecorator);

        setComponentProperty(parameters, "inputs", inputs);
        setComponentProperty(parameters, "outputs", outputs);
      }

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
    } else if (isOutputDecorator(this.name)) {
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
