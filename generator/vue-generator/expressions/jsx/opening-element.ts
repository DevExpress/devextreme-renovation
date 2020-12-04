import { JsxOpeningElement as BaseJsxOpeningElement } from "../../../angular-generator/expressions/jsx/jsx-opening-element";
import { JsxAttribute } from "./attribute";
import { JsxSpreadAttribute } from "./spread-attribute";
import {
  Expression,
  SimpleExpression,
} from "../../../base-generator/expressions/base";
import { GeneratorContext } from "../../../base-generator/types";
import { toStringOptions } from "../../types";
import { Identifier } from "../../../base-generator/expressions/common";
import {
  Property,
  Method,
} from "../../../base-generator/expressions/class-members";
import {
  PropertyAssignment,
  SpreadAssignment,
} from "../../../base-generator/expressions/property-assignment";
import { ObjectLiteral } from "../../../base-generator/expressions/literal";
import { BaseFunction } from "../../../base-generator/expressions/functions";
import {
  Component,
  getProps,
} from "../../../base-generator/expressions/component";
import { PropertyAccess } from "../property-access";
import { JsxExpression, JsxChildExpression } from "./jsx-expression";
import SyntaxKind from "../../../base-generator/syntaxKind";
import { JsxElement } from "./element";
import {
  getMember,
  getExpression,
} from "../../../base-generator/utils/expressions";
import { VueDirective } from "./vue-directive";
import { Conditional } from "../../../base-generator/expressions/conditions";
import { JsxAttribute as BaseJsxAttribute } from "../../../base-generator/expressions/jsx";
import { getEventName } from "../utils";
import { extractComponentFromType } from "../../../base-generator/utils/component-utils";
import { PropsGetAccessor } from "../class-members/props-get-accessor";
import { IPropsGetAccessor } from "../../../angular-generator/types";

export class JsxOpeningElement extends BaseJsxOpeningElement {
  attributes: Array<JsxAttribute | JsxSpreadAttribute>;
  constructor(
    tagName: Expression,
    typeArguments: any,
    attributes: Array<JsxAttribute | JsxSpreadAttribute> = [],
    context: GeneratorContext
  ) {
    super(tagName, typeArguments, attributes, context);
    this.attributes = attributes;
    if (this.component) {
      const components = this.context.components!;
      const name = Object.keys(components).find(
        (k) => components[k] === this.component
      )!;

      this.tagName = new SimpleExpression(name);
    }
  }

  isPropsGetAccessor(
    member: Property | Method | undefined
  ): member is IPropsGetAccessor {
    return member instanceof PropsGetAccessor;
  }

  attributesString(options?: toStringOptions) {
    if (this.isPortal()) {
      const containerIndex = this.attributes.findIndex(
        (attr) =>
          attr instanceof JsxAttribute && attr.name.toString() === "container"
      );
      if (containerIndex > -1) {
        const attr = this.attributes[containerIndex] as JsxAttribute;
        this.attributes[containerIndex] = new JsxAttribute(
          attr.name,
          new SimpleExpression(attr.getRefValue(options))
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
    if (tagName.toString() === "Fragment") {
      const expression = options?.isSVG ? "g" : 'div style="display: contents"';
      return new SimpleExpression(expression);
    }
    if (tagName.toString() === "Portal") {
      return new SimpleExpression("DxPortal");
    }
    if (this.isDynamicComponent(options)) {
      return new Identifier("component");
    }
    return tagName;
  }

  compileTemplate(templateProperty: Property, options: toStringOptions) {
    const attributes = this.attributes.map((a) => a.getTemplateProp(options));
    const initializer = templateProperty.initializer;
    const defaultAttrs = this.attributes.filter(
      (a) => a instanceof JsxAttribute && a.name.toString() !== "key"
    ) as JsxAttribute[];

    const initializerComponent =
      initializer instanceof Identifier &&
      this.context.components &&
      this.context.components[initializer.toString()]
        ? this.context.components[initializer.toString()]
        : undefined;

    const keyAttribute = this.attributes.find(
      (a) => a instanceof JsxAttribute && a.name.toString() === "key"
    );

    options.jsxComponent = (initializerComponent as Component) || {
      members: [],
    };

    const componentTag = initializerComponent
      ? `<${initializerComponent.name} ${defaultAttrs
          .map((a) => {
            if (
              options &&
              options.jsxComponent &&
              options.jsxComponent.members.find(
                (m) => m.isEvent && m.name === a.name.toString()
              )
            ) {
              return `@${getEventName(a.name, options.jsxComponent.state)}="${
                templateProperty.name
              }Default.${a.name.toString(options)}"`;
            }
            return `:${a.name.toString()}=${
              templateProperty.name
            }Default.${a.name.toString(options)}`;
          })
          .join(" ")}/>`
      : "";
    let body = componentTag;
    const slotOptions: toStringOptions = {
      newComponentContext: `${templateProperty.name}Default`,
      members: options?.members || [],
    };
    if (initializer instanceof BaseFunction)
      body = initializer.getTemplate(slotOptions);
    if (body) {
      const attrString = keyAttribute
        ? defaultAttrs.map((a) => a.toString(options)).join(" ")
        : attributes.join(" ");
      const slotString = `<slot name="${templateProperty.name}" ${attrString}>
        <div style="display:contents" ${this.createSetAttributes(
          templateProperty,
          defaultAttrs,
          options
        )}>${body}</div>
      </slot>`;
      if (keyAttribute) {
        const ifDirective =
          this.attributes.find(
            (a) => a instanceof VueDirective && a.name.toString() === "v-if"
          ) || "";
        return `<div style="display:contents" ${keyAttribute}${ifDirective}>${slotString}</div>`;
      }
      return slotString;
    }

    return `<slot name="${templateProperty.name}" ${attributes.join(
      " "
    )}></slot>`;
  }
  createSetAttributes(
    templateProperty: Property,
    attrs: BaseJsxAttribute[],
    options?: toStringOptions
  ): string {
    return `:set='${templateProperty.name}Default={${attrs
      .map((a) => {
        return `${a.name.toString(options)}:${a.initializer.toString(
          options?.componentContext === "model"
            ? options
            : { componentContext: "model", members: options!.members }
        )}`;
      })
      .join(",")}}'`;
  }
  createJsxAttribute(name: Identifier, value: Expression) {
    return new JsxAttribute(name, value);
  }

  getPropertyFromSpread(property: Property) {
    return property.isEvent || property.isSlot;
  }

  updateSpreadAttribute(
    spreadAttribute: JsxSpreadAttribute,
    attributes: JsxAttribute[]
  ) {
    if (attributes.length) {
      const propertyAssignments = attributes.map((p) => {
        return new PropertyAssignment(
          p.name,
          new SimpleExpression(SyntaxKind.UndefinedKeyword)
        );
      });

      return new JsxSpreadAttribute(
        undefined,
        new ObjectLiteral(
          [
            new SpreadAssignment(spreadAttribute.expression),
            new SpreadAssignment(new ObjectLiteral(propertyAssignments, false)),
          ],
          false
        )
      );
    }

    return spreadAttribute;
  }

  separateChildrenForDynamicComponent() {
    return null;
  }

  compileDynamicComponent(
    options: toStringOptions,
    expression: Expression
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
    options: toStringOptions
  ): JsxElement {
    const element = func.getTemplate(options, true);

    const paramName = func.parameters[0]?.name.toString(options);

    return new JsxElement(
      new JsxOpeningElement(
        new Identifier(
          `template v-slot:${name}${paramName ? `="${paramName}"` : ""}`
        ),
        undefined,
        [],
        this.context
      ),
      [element],
      new JsxClosingElement(new Identifier("template"), this.context)
    );
  }

  componentToJsxElement(name: string, component: Component): JsxElement {
    const paramName = "slotProps";
    const attributes = getProps(component.members).map(
      (prop) =>
        new JsxAttribute(
          prop._name,
          new PropertyAccess(new Identifier(paramName), prop._name)
        )
    );

    const componentName = Object.keys(this.context.components!).find(
      (k) => this.context.components![k] === component
    )!;
    const element = new JsxSelfClosingElement(
      new Identifier(componentName),
      undefined,
      attributes,
      component.context
    );

    return new JsxElement(
      new JsxOpeningElement(
        new Identifier(`template v-slot:${name}="${paramName}"`),
        undefined,
        [],
        this.context
      ),
      [element],
      new JsxClosingElement(new Identifier("template"), this.context)
    );
  }

  templatePropToJsxElement(
    template: JsxAttribute,
    options?: toStringOptions
  ): JsxElement {
    const destSlotName = this.getTemplateName(template);
    const slotName =
      template.initializer instanceof PropertyAccess
        ? template.initializer.name.toString()
        : getMember(template.initializer, options)!.name;

    return new JsxElement(
      new JsxOpeningElement(
        new Identifier(`template v-slot:${destSlotName}="slotProps"`),
        undefined,
        [],
        this.context
      ),
      [`<slot name=${slotName} v-bind="slotProps"></slot>`],
      new JsxClosingElement(new Identifier("template"), this.context)
    );
  }

  clone() {
    return new JsxOpeningElement(
      this.tagName,
      this.typeArguments,
      this.attributes.slice(),
      this.context
    );
  }

  compileJsxElementsForVariable(
    options?: toStringOptions,
    children: Array<
      JsxElement | string | JsxChildExpression | JsxSelfClosingElement
    > = []
  ): string | undefined {
    const variable = getExpression(this.tagName, options);

    if (variable === this.tagName) {
      return;
    }

    if (variable instanceof Conditional) {
      return this.createJsxElementForVariable(
        new Identifier("component"),
        children,
        [
          new VueDirective(
            new Identifier(":is"),
            new Conditional(
              variable.expression,
              new SimpleExpression(
                `"${variable.thenStatement.toString(options)}"`
              ),
              new SimpleExpression(
                `"${variable.elseStatement.toString(options)}"`
              )
            )
          ),
        ]
      ).toString(options);
    }
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
        .join("")}</${this.processTagName(this.tagName, options)}>`;
    }
    return baseValue.replace(/>$/, "/>");
  }

  clone() {
    return new JsxSelfClosingElement(
      this.tagName,
      this.typeArguments,
      this.attributes.slice(),
      this.context
    );
  }
}

export class JsxClosingElement extends JsxOpeningElement {
  constructor(tagName: Expression, context: GeneratorContext) {
    super(tagName, [], [], context);
  }

  processTagName(tagName: Expression, options?: toStringOptions) {
    if (tagName.toString() === "Fragment") {
      const expression = options?.isSVG ? "g" : "div";
      return new SimpleExpression(expression);
    }

    if (tagName.toString() === "Portal") {
      return new SimpleExpression("DxPortal");
    }

    return tagName;
  }

  compileDynamicComponent() {
    return "</component>";
  }

  toString(options: toStringOptions) {
    if (this.isDynamicComponent(options)) {
      return this.compileDynamicComponent();
    }
    return `</${this.processTagName(this.tagName, options).toString(options)}>`;
  }
}
