import {
  ArrayLiteral,
  BaseFunction,
  Decorator as BaseDecorator,
  Decorators,
  FunctionTypeNode,
  GeneratorContext,
  getJsxExpression,
  getProps,
  Identifier,
  ObjectLiteral,
  Property,
  SimpleExpression,
  StringLiteral,
  TemplateExpression,
} from '@devextreme-generator/core';

import { toStringOptions } from '../types';
import { Call } from './common';
import { getAngularSelector, AngularComponent } from './component';
import { isElement } from './jsx/elements';

function isInputDecorator(name: string): boolean {
  return (
    name === Decorators.OneWay
    || name === Decorators.TwoWay
    || name === Decorators.Template
    || name === Decorators.RefProp
    || name === Decorators.Nested
    || name === Decorators.ForwardRefProp
  );
}

function isOutputDecorator(name: string): boolean {
  return name === Decorators.Event;
}

function getPropertiesName(
  props: Property[],
  specificDecorator: (name: string) => boolean,
): StringLiteral[] {
  return props
    .filter(({ decorators }) => decorators.some(({ name }) => specificDecorator(name)))
    .map((m) => new StringLiteral(m.name));
}

function setComponentProperty(
  componentParameters: ObjectLiteral,
  name: string,
  value: StringLiteral[],
) {
  if (value.length) {
    componentParameters.setProperty(name, new ArrayLiteral(value, false));
  }
}

function isInnerComponent(decorator: Decorator): boolean {
  const parameters = decorator.expression.arguments[0] as ObjectLiteral;
  return !(parameters?.getProperty?.<ObjectLiteral>('jQuery')?.getProperty?.('register')?.toString() === 'true');
}

export class Decorator extends BaseDecorator {
  readonly isWrappedByTemplate: boolean;

  constructor(expression: Call, context: GeneratorContext) {
    super(expression, context);
    this.isWrappedByTemplate = isInnerComponent(this) && !this.isSvg;
  }

  toString(options?: toStringOptions) {
    if (isInputDecorator(this.name)) {
      return '@Input()';
    }
    if (
      this.name === Decorators.Effect
      || this.name === Decorators.Ref
      || this.name === Decorators.ApiRef
      || this.name === Decorators.InternalState
      || this.name === Decorators.Method
      || this.name === Decorators.ForwardRef
      || this.name === Decorators.Mutable
    ) {
      return '';
    }
    if (this.name === Decorators.Component) {
      const parameters = this.expression.arguments[0] as ObjectLiteral;
      if (options) {
        const props = getProps(options.members);
        const inputs = getPropertiesName(props, isInputDecorator);
        const outputs = getPropertiesName(props, isOutputDecorator);

        setComponentProperty(parameters, 'inputs', inputs);
        setComponentProperty(parameters, 'outputs', outputs);
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
        if (templates?.length) template += templates.join('');
        const slots = compileSlots(options);
        if (slots?.length) template += slots.join('');
        if (template) {
          parameters.setProperty(
            'template',
            new TemplateExpression(this.isWrappedByTemplate ? `<ng-template #widgetTemplate>${template}</ng-template>` : template, []),
          );
        }
      }

      [
        'view',
        'defaultOptionRules',
        'jQuery',
        'isSVG',
        'name',
        'components',
      ].forEach((name) => parameters.removeProperty(name));
    } else if (isOutputDecorator(this.name)) {
      return '@Output()';
    }
    return super.toString();
  }
}

function compileDefaultTemplates(
  options?: toStringOptions,
  context?: GeneratorContext,
): string[] | undefined {
  if (options?.defaultTemplates) {
    return Object.entries(options.defaultTemplates)
      .map((i) => {
        const [name, template] = i;

        if (template.initializer instanceof Identifier && context?.components) {
          const component = context.components[template.initializer.toString()] as AngularComponent;
          const ref = 'compRef';
          const componentName = getAngularSelector(component.name);
          const templateVariables = template.variables.map((v) => {
            const componentProp = component.heritageProperties.find(
              (p) => p.name.toString() === v,
            );
            if (componentProp?.type instanceof FunctionTypeNode) {
              return `(${v})="${v} !== undefined ? ${v}($event) : ${component.name}Defaults.${v}($event)"`;
            }
            return `[${v}]="${v} !== undefined ? ${v} : ${component.name}Defaults.${v}"`;
          })
            .join(' ');
          const templateOutlete = component.decorator.isWrappedByTemplate ? component.getContentTemplateOutlet(ref) : '';
          const templateString = `<ng-template #${name}Default ${template.variables
            .map((v) => `let-${v}="${v}"`)
            .join(' ')}>
            <${componentName} #${ref} ${templateVariables}></${componentName}>
            ${templateOutlete}
            </ng-template>`;
          return templateString;
        }
        const templateString = `  <ng-template #${name}Default ${template.variables
          .map((v) => `let-${v}="${v}"`)
          .join(' ')}>
            ${(template.initializer as BaseFunction).getTemplate({
    members: [],
    newComponentContext: '',
  })}
            </ng-template>`;
        return templateString;
      })
      .filter((s) => s) as string[];
  }
  return undefined;
}

function compileSlots(options?: toStringOptions): string[] {
  return (
    options?.members
      .filter((m) => m instanceof Property && m.isSlot)
      .map((slot) => {
        const cssSelector = slot.getDecoratorParameter<SimpleExpression>(Decorators.Slot, 'selector')?.expression
        || `[data-${slot.name.toLocaleLowerCase()}]`;
        const selector = slot.name.toString() === 'children' ? '' : `select="${cssSelector}"`;
        return `<ng-template #dx${slot.name}><ng-content ${selector}></ng-content></ng-template>`;
      }) || []
  );
}
