import {
  IPropsGetAccessor,
  JsxOpeningElement as BaseJsxOpeningElement,
} from '@devextreme-generator/angular';
import {
  Identifier,
  Conditional,
  BaseFunction,
  JsxAttribute as BaseJsxAttribute,
  ObjectLiteral,
  SyntaxKind,
  GeneratorContext,
  extractComponentFromType,
  Expression,
  SimpleExpression,
  processComponentContext,
  Property,
  Method,
  PropertyAssignment,
  SpreadAssignment,
  Component,
  getProps,
  getMember,
  getExpression,
} from '@devextreme-generator/core';
import { JsxAttribute } from './attribute';
import { JsxElement } from './element';
import { JsxChildExpression, JsxExpression } from './jsx-expression';
import { JsxSpreadAttribute } from './spread-attribute';
import { VueDirective } from './vue-directive';
import { InitializedTemplateType, toStringOptions } from '../../types';
import { PropsGetAccessor } from '../class-members/props-get-accessor';
import { PropertyAccess } from '../property-access';
import { getEventName } from '../utils';
import { VueComponentInput } from '../vue-component-input';

const createFragment = (
  attributes: (JsxAttribute | JsxSpreadAttribute)[],
  body: string,
  context: GeneratorContext,
): JsxElement => new JsxElement(
  new JsxOpeningElement(
    new Identifier('Fragment'),
    undefined,
    attributes,
    context,
  ),
  [body],
  new JsxClosingElement(new Identifier('Fragment'), context),
);

export class JsxOpeningElement extends BaseJsxOpeningElement {
  attributes: Array<JsxAttribute | JsxSpreadAttribute>;

  constructor(
    tagName: Expression,
    typeArguments: any,
    attributes: Array<JsxAttribute | JsxSpreadAttribute> = [],
    context: GeneratorContext,
  ) {
    super(tagName, typeArguments, attributes, context);
    this.attributes = attributes;
    if (this.component) {
      const components = this.context.components!;
      const name = Object.keys(components).find(
        (k) => components[k] === this.component,
      )!;

      this.tagName = new SimpleExpression(name);
    }
  }

  isPropsGetAccessor(
    member: Property | Method | undefined,
  ): member is IPropsGetAccessor {
    return member instanceof PropsGetAccessor;
  }

  attributesString(options?: toStringOptions) {
    if (this.isPortal()) {
      const containerIndex = this.attributes.findIndex(
        (attr) => attr instanceof JsxAttribute && attr.name.toString() === 'container',
      );
      if (containerIndex > -1) {
        const attr = this.attributes[containerIndex] as JsxAttribute;
        this.attributes[containerIndex] = new JsxAttribute(
          attr.name,
          new SimpleExpression(attr.getRefValue(options)),
        );
      }
    }

    return super.attributesString(options);
  }

  createJsxExpression(statement: Expression) {
    return new JsxExpression(undefined, statement);
  }

  createJsxChildExpression(statement: JsxExpression) {
    return new JsxChildExpression(statement);
  }

  processTagName(tagName: Expression, options?: toStringOptions) {
    if (tagName.toString() === 'Fragment') {
      const expression = options?.isSVG ? 'g' : 'div style="display: contents"';
      return new SimpleExpression(expression);
    }
    if (tagName.toString() === 'Portal') {
      return new SimpleExpression('DxPortal');
    }
    if (this.isDynamicComponent(options)) {
      return new Identifier('component');
    }
    return tagName;
  }

  findDefaultTemplateFromProp(
    initializedTemplate: InitializedTemplateType[] | undefined,
    initializer: Expression | undefined,
  ): Component | undefined {
    if (!initializedTemplate || !initializer) {
      return undefined;
    }
    const templateIndex = initializedTemplate
      ?.findIndex((el) => el.initializer?.toString() === initializer?.toString());
    if (templateIndex === -1) {
      return undefined;
    }
    const sourceProp = this.context?.components
      ? Object.keys(this.context?.components).find((c) => (
        this.context.components?.[c] as VueComponentInput)
        .context?.components?.[initializer.toString()])
      : undefined;
    initializedTemplate[templateIndex].sourceProp = sourceProp;
    return sourceProp
      ? (this.context.components?.[sourceProp] as VueComponentInput)
        .context.components?.[initializer.toString()] as Component
      : undefined;
  }

  compileTemplate(templateProperty: Property, options: toStringOptions) {
    const attributes = this.attributes.map((a) => a.getTemplateProp(options));
    const initializer = templateProperty.initializer;
    const defaultAttrs = this.attributes.filter(
      (a) => a instanceof JsxAttribute && a.name.toString() !== 'key',
    ) as JsxAttribute[];

    const initializerComponent: Component | undefined = initializer instanceof Identifier
      && this.context.components
      && this.context.components[initializer.toString()] instanceof Component
      ? (this.context.components[initializer.toString()] as Component)
      : undefined;
    const initializerComponentFromProp = !initializerComponent
      ? this.findDefaultTemplateFromProp(options.initializedTemplate, initializer)
      : undefined;
    const keyAttribute = this.attributes.find(
      (a) => a instanceof JsxAttribute && a.name.toString() === 'key',
    );

    if (initializerComponent) {
      options = {
        ...options,
        jsxComponent: initializerComponent,
      };
    }

    const componentTag = (initializerComponent || initializerComponentFromProp)
      ? `<${initializerComponent
        ? initializerComponent.name
        : `${initializerComponentFromProp?.name}Default`} ${defaultAttrs
        .map((a) => {
          if (initializerComponent
            ? initializerComponent.members.find(
              (m) => m.isEvent && m.name === a.name.toString(),
            )
            : initializerComponentFromProp?.members.find(
              (m) => m.isEvent && m.name === a.name.toString(),
            )
          ) {
            return `@${getEventName(a.name, initializerComponent
              ? initializerComponent.state
              : initializerComponentFromProp?.state)}="${
              templateProperty.name
            }Default.${a.name.toString(options)}"`;
          }
          return `:${a.name.toString()}=${
            templateProperty.name
          }Default.${a.name.toString(options)}`;
        })
        .join(' ')}/>`
      : '';
    let body = componentTag;
    const slotOptions: toStringOptions = {
      newComponentContext: `${templateProperty.name}Default`,
      members: options?.members || [],
    };
    if (initializer instanceof BaseFunction) { body = initializer.getTemplate(slotOptions); }
    if (body) {
      const attrString = keyAttribute
        ? defaultAttrs.map((a) => a.toString(options))
        : attributes;

      const fragment = createFragment(
        [this.createSetAttributes(templateProperty, defaultAttrs, options)],
        body,
        this.context,
      );

      const slotString = `<slot :name="${
        templateProperty.name
      }" ${attrString.join(' ')}>
        ${fragment.toString(options)}
      </slot>`;
      if (keyAttribute) {
        const ifDirective = this.attributes.find(
          (a) => a instanceof VueDirective && a.name.toString() === 'v-if',
        );

        const fragmentAttributes: (JsxAttribute | JsxSpreadAttribute)[] = [
          keyAttribute,
        ];

        if (ifDirective) {
          fragmentAttributes.push(ifDirective);
        }

        return createFragment(
          fragmentAttributes,
          slotString,
          this.context,
        ).toString(options);
      }
      return slotString;
    }

    return `<slot :name="${templateProperty.name}" ${attributes.join(
      ' ',
    )}></slot>`;
  }

  getTemplateProperty(options?: toStringOptions) {
    const tagName = getExpression(this.tagName, options).toString(options);
    const contextExpr = processComponentContext(options?.newComponentContext);
    return options?.members
      .filter((m) => m.isTemplate)
      .find((s) => {
        const value = `${contextExpr}${s.name.toString()}`;
        return tagName.endsWith(`${value}`) || tagName.endsWith(`${value}]`);
      });
  }

  createSetAttributes(
    templateProperty: Property,
    attrs: BaseJsxAttribute[],
    options?: toStringOptions,
  ): VueDirective {
    return new VueDirective(
      new Identifier(':set'),
      new SimpleExpression(
        `${templateProperty.name}Default={${attrs
          .map((a) => `${a.name.toString(options)}:${a.initializer.toString(
            options?.componentContext === 'model'
              ? options
              : { componentContext: 'model', members: options!.members },
          )}`)
          .join(',')}}`,
      ),
    );
  }

  createJsxAttribute(name: Identifier, value: Expression) {
    return new JsxAttribute(name, value);
  }

  getPropertyFromSpread(property: Property) {
    return property.isEvent || property.isSlot;
  }

  updateSpreadAttribute(
    spreadAttribute: JsxSpreadAttribute,
    attributes: JsxAttribute[],
  ) {
    if (attributes.length) {
      const propertyAssignments = attributes.map((p) => new PropertyAssignment(
        p.name,
        new SimpleExpression(SyntaxKind.UndefinedKeyword),
      ));

      return new JsxSpreadAttribute(
        undefined,
        new ObjectLiteral(
          [
            new SpreadAssignment(spreadAttribute.expression),
            new SpreadAssignment(new ObjectLiteral(propertyAssignments, false)),
          ],
          false,
        ),
      );
    }

    return spreadAttribute;
  }

  separateChildrenForDynamicComponent() {
    return null;
  }

  compileDynamicComponent(
    options: toStringOptions,
    expression: Expression,
  ): string {
    const member = getMember(expression, options);
    const component = extractComponentFromType(member?.type, this.context);
    this.component = component;

    const attributesOptions: toStringOptions = component
      ? {
        ...options,
        jsxComponent: component,
      }
      : options;

    return `<component
              v-bind:is="${this.tagName.toString(options)}"
              ${this.attributesString(attributesOptions)}
            >`;
  }

  processSpreadAttributesOnNativeElement() {}

  getTemplateName(attribute: JsxAttribute) {
    return attribute.name.toString();
  }

  functionToJsxElement(
    name: string,
    func: BaseFunction,
    options: toStringOptions,
  ): JsxElement {
    const element = func.getTemplate(options, true);

    const paramName = func.parameters[0]?.name.toString(options);

    return new JsxElement(
      new JsxOpeningElement(
        new Identifier(
          `template v-slot:${name}${paramName ? `="${paramName}"` : ''}`,
        ),
        undefined,
        [],
        this.context,
      ),
      [element],
      new JsxClosingElement(new Identifier('template'), this.context),
    );
  }

  componentToJsxElement(name: string, component: Component): JsxElement {
    const paramName = 'slotProps';
    const attributes = getProps(component.members).map(
      (prop) => new JsxAttribute(
        prop._name,
        new PropertyAccess(new Identifier(paramName), prop._name),
      ),
    );

    const componentName = Object.keys(this.context.components!).find(
      (k) => this.context.components![k] === component,
    )!;
    const element = new JsxSelfClosingElement(
      new Identifier(componentName),
      undefined,
      attributes,
      component.context,
    );

    return new JsxElement(
      new JsxOpeningElement(
        new Identifier(`template v-slot:${name}="${paramName}"`),
        undefined,
        [],
        this.context,
      ),
      [element],
      new JsxClosingElement(new Identifier('template'), this.context),
    );
  }

  templatePropToJsxElement(
    template: JsxAttribute,
    options?: toStringOptions,
  ): JsxElement {
    const destSlotName = this.getTemplateName(template);
    const slotName = template.initializer instanceof PropertyAccess
      ? template.initializer.name.toString()
      : getMember(template.initializer, options)!.name;

    return new JsxElement(
      new JsxOpeningElement(
        new Identifier(`template v-slot:${destSlotName}="slotProps"`),
        undefined,
        [],
        this.context,
      ),
      [`<slot :name=${slotName} v-bind="slotProps"></slot>`],
      new JsxClosingElement(new Identifier('template'), this.context),
    );
  }

  clone() {
    return new JsxOpeningElement(
      this.tagName,
      this.typeArguments,
      this.attributes.slice(),
      this.context,
    );
  }

  compileJsxElementsForVariable(
    options?: toStringOptions,
    children: Array<
    JsxElement | string | JsxChildExpression | JsxSelfClosingElement
    > = [],
  ): string | undefined {
    const variable = getExpression(this.tagName, options);

    if (variable === this.tagName) {
      return undefined;
    }

    if (variable instanceof Conditional) {
      return this.createJsxElementForVariable(
        new Identifier('component'),
        children,
        [
          new VueDirective(
            new Identifier(':is'),
            new Conditional(
              variable.expression,
              new SimpleExpression(
                `"${variable.thenStatement.toString(options)}"`,
              ),
              new SimpleExpression(
                `"${variable.elseStatement.toString(options)}"`,
              ),
            ),
          ),
        ],
      ).toString(options);
    }

    return undefined;
  }

  getArrowFunctionGeneratedName(templateName: string) {
    return templateName;
  }
}

export class JsxSelfClosingElement extends JsxOpeningElement {
  toString(options?: toStringOptions) {
    if (this.getTemplateProperty(options)) {
      return super.toString(options);
    }

    const elementString = this.compileJsxElementsForVariable(options);
    if (elementString) {
      return elementString;
    }

    const baseValue = super.toString(options);

    const children = [
      ...this.getSlotsFromAttributes(options),
      ...this.getTemplatesFromAttributes(options),
    ];

    if (children.length) {
      return `${baseValue}${children
        .map((c) => c.toString(options))
        .join('')}</${this.processTagName(this.tagName, options)}>`;
    }
    return baseValue.replace(/>$/, '/>');
  }

  clone() {
    return new JsxSelfClosingElement(
      this.tagName,
      this.typeArguments,
      this.attributes.slice(),
      this.context,
    );
  }
}

export class JsxClosingElement extends JsxOpeningElement {
  constructor(tagName: Expression, context: GeneratorContext) {
    super(tagName, [], [], context);
  }

  processTagName(tagName: Expression, options?: toStringOptions) {
    if (tagName.toString() === 'Fragment') {
      const expression = options?.isSVG ? 'g' : 'div';
      return new SimpleExpression(expression);
    }

    if (tagName.toString() === 'Portal') {
      return new SimpleExpression('DxPortal');
    }

    return tagName;
  }

  compileDynamicComponent() {
    return '</component>';
  }

  toString(options: toStringOptions) {
    if (this.isDynamicComponent(options)) {
      return this.compileDynamicComponent();
    }
    return `</${this.processTagName(this.tagName, options).toString(
      this.getJsxOptions(options),
    )}>`;
  }
}
