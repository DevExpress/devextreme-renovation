import { Decorator as BaseDecorator } from "../../base-generator/expressions/decorator";
import { toStringOptions } from "../types";
import { Decorators } from "../../component_declaration/decorators";
import { ObjectLiteral } from "../../base-generator/expressions/literal";
import { TemplateExpression } from "../../base-generator/expressions/template";
import { isElement } from "./jsx/elements";
import { getJsxExpression } from "../../base-generator/expressions/jsx";
import { Property } from "./class-members/property";
import {
  BaseFunction,
  getTemplate,
} from "../../base-generator/expressions/functions";
import {
  FunctionTypeNode,
  PropertySignature,
  TypeLiteralNode,
  TypeReferenceNode,
} from "../../base-generator/expressions/type";
import { Identifier } from "../../base-generator/expressions/common";
import { AngularComponent } from "./component";
import { SimpleExpression } from "../../base-generator/expressions/base";
import { GeneratorContext } from "../../base-generator/types";

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
        if (templates) template += templates;
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

function compileDefaultTemplates(
  options?: toStringOptions,
  context?: GeneratorContext
): string {
  if (options?.members) {
    const defaultTemplateStatements = options.members
      .map((m) => {
        if (m.isTemplate && m instanceof Property) {
          if (m.initializer instanceof BaseFunction) {
            const contextVars = extractContextVarsFromType(m);
            return `<ng-template #${m.name}Default ${
              contextVars ? contextVars.map((v) => `let-${v}="${v}"`) : ""
            }>${m.initializer.getTemplate({
              members: [],
              newComponentContext: "",
            })}</ng-template>`;
          } else if (
            m.initializer instanceof Identifier &&
            context &&
            context.components &&
            context.components[m.initializer.toString()]
          ) {
            const component = context.components[
              m.initializer.toString()
            ] as AngularComponent;
            let contextVars = extractContextVarsFromType(m);
            if (!contextVars.length)
              contextVars = extractPropsFromComponent(component);
            const componentTemplate = getTemplate(
              component.decorator.getViewFunction() ||
                new BaseFunction(
                  [],
                  [],
                  [],
                  undefined,
                  new SimpleExpression(""),
                  context
                )
            );
            return `<ng-template #${m.name}Default ${
              contextVars ? contextVars.map((v) => `let-${v}="${v}"`) : ""
            }>${componentTemplate}</ng-template>`;
          }
        }
      })
      .filter((s) => s) as string[];
    return defaultTemplateStatements.join("\n");
  }
  return "";
}

function extractContextVarsFromType(m: Property): Identifier[] {
  let contextVars: Identifier[] = [];
  if (
    m.type instanceof FunctionTypeNode &&
    m.type.parameters[0].type instanceof TypeLiteralNode &&
    m.type.parameters[0].type.members
  ) {
    contextVars = m.type.parameters[0].type.members.map((m) => m.name);
  }
  if (m.type instanceof TypeReferenceNode) {
    if (m.type.typeArguments) {
      m.type.typeArguments.map((arg) => {
        if (arg instanceof TypeLiteralNode) {
          arg.members.map((m) => {
            if (m instanceof PropertySignature) {
              contextVars.push(m.name);
            }
          });
        }
      });
    }
  }
  return contextVars;
}

function extractPropsFromComponent(component: AngularComponent): Identifier[] {
  const props = component.members.filter(
    (m) => m instanceof Property && m.inherited && !m.isOptional
  );
  return props.map((p) => p._name);
}
