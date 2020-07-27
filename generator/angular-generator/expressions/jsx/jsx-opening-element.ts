import {
  JsxOpeningElement as BaseJsxOpeningElement,
  JsxClosingElement,
} from "../../../base-generator/expressions/jsx";
import { JsxSpreadAttributeMeta, JsxSpreadAttribute } from "./spread-attribute";
import { JsxAttribute } from "./attribute";
import {
  Component,
  getProps,
} from "../../../base-generator/expressions/component";
import {
  BaseFunction,
  isFunction,
} from "../../../base-generator/expressions/functions";
import { Identifier, Paren } from "../../../base-generator/expressions/common";
import {
  TypeLiteralNode,
  PropertySignature,
} from "../../../base-generator/expressions/type";
import { toStringOptions } from "../../types";
import {
  Property,
  GetAccessor,
  Method,
} from "../../../base-generator/expressions/class-members";
import { PropertyAccess } from "../../../base-generator/expressions/property-access";
import {
  SimpleExpression,
  Expression,
} from "../../../base-generator/expressions/base";
import { AngularDirective } from "./angular-directive";
import { ObjectLiteral } from "../../../base-generator/expressions/literal";
import { PropertyAssignment } from "../../../base-generator/expressions/property-assignment";
import { processComponentContext } from "../../../base-generator/utils/string";
import { JsxExpression } from "./jsx-expression";
import { JsxChildExpression } from "./jsx-child-expression";
import { JsxElement } from "./elements";
import { GeneratorContext } from "../../../base-generator/types";
import { AngularComponent } from "../component";
import { getExpression, counter, getMember } from "../../utils";
import { Conditional } from "../../../base-generator/expressions/conditions";
import { Prefix } from "../../../base-generator/expressions/operators";
import SyntaxKind from "../../../base-generator/syntaxKind";

export function processTagName(tagName: Expression, context: GeneratorContext) {
  const component = context.components?.[tagName.toString()];
  if (component) {
    const selector = (component as AngularComponent).selector;
    return new Identifier(selector);
  }
  return tagName;
}

function pickSpreadValue(first: string, second: string): string {
  return `(${second}!==undefined?${second}:${first})`;
}

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
  }

  processTagName(tagName: Expression) {
    if (this.component instanceof AngularComponent) {
      const selector = this.component.selector;
      return new Identifier(selector);
    }
    return super.processTagName(tagName);
  }

  getTemplateProperty(options?: toStringOptions) {
    const tagName = this.tagName.toString(options);
    const contextExpr = processComponentContext(options?.newComponentContext);
    return options?.members
      .filter((m) => m.isTemplate)
      .find((s) => tagName.endsWith(`${contextExpr}${s.name.toString()}`));
  }

  getPropertyFromSpread(property: Property) {
    return true;
  }

  spreadToArray(
    spreadAttribute: JsxSpreadAttribute,
    options?: toStringOptions
  ) {
    const component = this.component;
    const properties =
      (component &&
        getProps(component.members).filter(this.getPropertyFromSpread)) ||
      [];

    const spreadAttributesExpression = getExpression(
      spreadAttribute.expression,
      options
    );

    if (spreadAttributesExpression instanceof PropertyAccess) {
      const member = spreadAttributesExpression.getMember(options);
      if (
        member instanceof GetAccessor &&
        member._name.toString() === "restAttributes"
      ) {
        return [];
      }
    }

    return properties.reduce((acc, prop: Method | Property) => {
      const propName = prop._name;
      const spreadValueExpression = new PropertyAccess(
        spreadAttributesExpression,
        propName
      );

      const isPropsScope = spreadValueExpression.isPropsScope(options);
      const members = spreadValueExpression.getMembers(options);
      const hasMember = members?.some(
        (m) => m._name.toString() === propName.toString()
      );
      if (isPropsScope && !hasMember) {
        return acc;
      }

      const spreadValue = spreadValueExpression.toString(options);
      const attr = this.attributes.find(
        (a) =>
          a instanceof JsxAttribute && a.name.toString() === propName.toString()
      ) as JsxAttribute;
      let value = spreadValue;
      if (attr) {
        const spreadIndex = this.attributes.indexOf(spreadAttribute);
        const attrIndex = this.attributes.indexOf(attr);
        const attrValue = attr.initializer.toString(options);
        const member = getMember(attr.initializer, options);
        if (
          member instanceof Method &&
          !(member instanceof GetAccessor) &&
          attrIndex > spreadIndex
        ) {
          value = attrValue;
        } else {
          if (spreadIndex < attrIndex) {
            value = pickSpreadValue(spreadValue, attrValue);
          } else {
            value = pickSpreadValue(attrValue, spreadValue);
          }
        }
      }

      acc.push(this.createJsxAttribute(propName, new SimpleExpression(value)));
      return acc;
    }, [] as JsxAttribute[]);
  }

  createJsxAttribute(name: Identifier, value: Expression) {
    return new JsxAttribute(name, value);
  }

  processSpreadAttributesOnNativeElement() {
    const ref = this.attributes.find(
      (a) => a instanceof JsxAttribute && a.name.toString() === "ref"
    );
    if (!ref && !this.component) {
      this.attributes.push(
        new JsxAttribute(
          new Identifier("ref"),
          new SimpleExpression(`_auto_ref_${counter.get()}`)
        )
      );
    }
  }

  updateSpreadAttribute(
    spreadAttribute: JsxSpreadAttribute,
    attributes: JsxAttribute[]
  ) {
    return spreadAttribute;
  }

  processSpreadAttributes(options?: toStringOptions) {
    const spreadAttributes = this.attributes.filter(
      (a) => a instanceof JsxSpreadAttribute
    ) as JsxSpreadAttribute[];
    if (spreadAttributes.length) {
      spreadAttributes.forEach((spreadAttr) => {
        const attributes = this.spreadToArray(spreadAttr, options);

        const updatedSpreadAttribute = this.updateSpreadAttribute(
          spreadAttr,
          attributes
        );

        if (updatedSpreadAttribute !== spreadAttr) {
          const oldAttrIndex = this.attributes.findIndex(
            (a) => a === spreadAttr
          );
          if (oldAttrIndex > -1) {
            this.attributes.splice(oldAttrIndex, 1);
          }
          this.attributes.push(updatedSpreadAttribute);
        }

        attributes.forEach((attr) => {
          const oldAttrIndex = this.attributes.findIndex(
            (a) =>
              a instanceof JsxAttribute &&
              a.name.toString() === attr.name.toString()
          );
          if (oldAttrIndex > -1) {
            this.attributes.splice(oldAttrIndex, 1);
          }
          this.attributes.push(attr);
        });
      });

      this.processSpreadAttributesOnNativeElement();
    }
  }

  attributesString(options?: toStringOptions) {
    this.processSpreadAttributes(options);
    return super.attributesString(options);
  }

  compileTemplate(templateProperty: Property, options?: toStringOptions) {
    const contextExpr = processComponentContext(options?.newComponentContext);
    const contextElements = this.attributes.reduce(
      (elements: PropertyAssignment[], a) => {
        const contextElements = a.getTemplateContext(
          options,
          this.context.components
        );
        return elements.concat(contextElements);
      },
      []
    );

    const contextString = contextElements.length
      ? `; context:${new ObjectLiteral(contextElements, false)
          .toString(options)
          .replace(/"/gi, "'")}`
      : "";
    const attributes = this.attributes
      .filter((a) => a instanceof AngularDirective)
      .map((a) => a.toString(options))
      .join("\n");

    const elementString = `<ng-container *ngTemplateOutlet="${contextExpr}${templateProperty.name}${contextString}"></ng-container>`;

    if (attributes.length) {
      return `<ng-container ${attributes}>
                    ${elementString}
                </ng-container>`;
    }

    return elementString;
  }

  toString(options?: toStringOptions) {
    const templateProperty = this.getTemplateProperty(options) as Property;
    if (templateProperty) {
      return this.compileTemplate(templateProperty, options);
    }

    return super.toString(options);
  }

  clone() {
    return new JsxOpeningElement(
      this.tagName,
      this.typeArguments,
      (this.attributes as JsxAttribute[]).slice(),
      this.context
    );
  }

  createJsxExpression(statement: Expression) {
    return new JsxExpression(undefined, statement);
  }

  createJsxChildExpression(statement: JsxExpression) {
    return new JsxChildExpression(statement);
  }

  getSlotsFromAttributes(options?: toStringOptions) {
    if (this.component) {
      const slots = this.attributes.filter(
        (a) =>
          a instanceof JsxAttribute &&
          a.isSlotAttribute({
            members: [],
            ...options,
            jsxComponent: this.component,
          })
      ) as JsxAttribute[];

      return slots.map((s) =>
        this.createJsxChildExpression(this.createJsxExpression(s.initializer))
      );
    }
    return [];
  }

  getTemplateName(attribute: JsxAttribute) {
    return attribute.initializer.toString();
  }

  componentToJsxElement(name: string, component: Component) {
    const attributes = getProps(component.members).map(
      (prop) => new JsxAttribute(prop._name, prop._name)
    );
    const element = new JsxSelfClosingElement(
      component._name,
      undefined,
      attributes,
      component.context
    );
    const templateAttr = getProps(component.members)
      .map((prop) => `let-${prop._name}="${prop._name}"`)
      .join(" ");

    return new JsxElement(
      new JsxOpeningElement(
        new Identifier(`ng-template #${name.toString()} ${templateAttr}`),
        undefined,
        [],
        this.context
      ),
      [element],
      new JsxClosingElement(new Identifier("ng-template"))
    );
  }

  templatePropToJsxElement(
    template: JsxAttribute,
    options?: toStringOptions
  ): JsxElement | null {
    return null;
  }

  functionToJsxElement(
    name: string,
    func: BaseFunction,
    options?: toStringOptions
  ) {
    const element = func.getTemplate(options);
    const paramType = func.parameters[0].type;
    const templateAttr =
      paramType instanceof TypeLiteralNode
        ? paramType.members
            .map((param: Property | PropertySignature) => {
              const name = param.name.toString(options);
              return `let-${name}="${name}"`;
            })
            .join(" ")
        : "";

    return new JsxElement(
      new JsxOpeningElement(
        new Identifier(`ng-template #${name} ${templateAttr}`),
        undefined,
        [],
        this.context
      ),
      [element],
      new JsxClosingElement(new Identifier("ng-template"))
    );
  }

  getTemplatesFromAttributes(options?: toStringOptions) {
    if (this.component) {
      const templates = this.attributes.filter(
        (a) =>
          a instanceof JsxAttribute &&
          a.isTemplateAttribute({
            members: [],
            ...options,
            jsxComponent: this.component,
          })
      ) as JsxAttribute[];

      const components = templates.reduce((acc, template) => {
        const name = template.initializer.toString();
        const result = this.context.components?.[name];
        if (result) {
          acc.push({
            name: this.getTemplateName(template),
            component: result as Component,
          });
        }
        return acc;
      }, [] as { name: string; component: Component }[]);

      const functions = templates.reduce((acc, template) => {
        const result = this.context.viewFunctions?.[
          template.initializer.toString()
        ];
        if (result && isFunction(result)) {
          acc.push({
            name: this.getTemplateName(template),
            func: result,
          });
        }
        return acc;
      }, [] as { name: string; func: BaseFunction }[]);

      const props = templates.filter(
        (t) =>
          !(components as { name: string }[])
            .concat(functions)
            .some(({ name }) => name === this.getTemplateName(t))
      );

      const result = [
        ...components.map(({ name, component }) =>
          this.componentToJsxElement(name, component)
        ),
        ...functions.map(({ name, func }) =>
          this.functionToJsxElement(name, func, options)
        ),
        ...(props
          .map((t) => this.templatePropToJsxElement(t, options))
          .filter((e) => e !== null) as JsxElement[]),
      ];

      return result;
    }

    return [];
  }

  getSpreadAttributes() {
    if (this.component) {
      return [];
    }
    const result = this.attributes
      .filter((a) => a instanceof JsxSpreadAttribute)
      .map((a) => {
        const ref = this.attributes.find(
          (a) => a instanceof JsxAttribute && a.name.toString() === "ref"
        ) as JsxAttribute | undefined;
        if (ref) {
          return {
            refExpression: ref.initializer,
            expression: (a as JsxSpreadAttribute).expression,
          } as JsxSpreadAttributeMeta;
        }
      });

    return result.filter((a) => a) as JsxSpreadAttributeMeta[];
  }

  creteJsxElementForVariable(
    expression: Expression,
    children: Array<
      JsxElement | string | JsxChildExpression | JsxSelfClosingElement
    > = [],
    attributes: JsxAttribute[] = []
  ): JsxElement {
    const element = new JsxElement(
      new JsxOpeningElement(
        expression,
        this.typeArguments,
        (this.attributes as JsxAttribute[]).concat(attributes),
        this.context
      ),
      children,
      new JsxClosingElement(processTagName(expression, this.context))
    );

    return element;
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
      return [
        this.creteJsxElementForVariable(variable.thenStatement, children, [
          new AngularDirective(new Identifier("*ngIf"), variable.expression),
        ]),
        this.creteJsxElementForVariable(variable.elseStatement, children, [
          new AngularDirective(
            new Identifier("*ngIf"),
            new Prefix(
              SyntaxKind.ExclamationToken,
              new Paren(variable.expression)
            )
          ),
        ]),
      ]
        .map((c) => c.toString(options))
        .join("");
    }
    if (variable instanceof Identifier) {
      return this.creteJsxElementForVariable(variable, children, []).toString(
        options
      );
    }
  }
}

// https://html.spec.whatwg.org/multipage/syntax.html#void-elements
const VOID_ELEMENTS = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
];

export class JsxSelfClosingElement extends JsxOpeningElement {
  toString(options?: toStringOptions) {
    if (VOID_ELEMENTS.indexOf(this.tagName.toString(options)) !== -1) {
      return `${super.toString(options).replace(">", "/>")}`;
    }

    if (this.getTemplateProperty(options)) {
      return super.toString(options);
    }

    const elementString = this.compileJsxElementsForVariable(options);
    if (elementString) {
      return elementString;
    }

    const openingElement = super.toString(options);
    const children: Expression[] = [
      ...this.getSlotsFromAttributes(options),
      ...this.getTemplatesFromAttributes(options),
    ];

    return `${openingElement}${children
      .map((c) => c.toString(options))
      .join("")}</${this.processTagName(this.tagName)}>`;
  }

  clone() {
    return new JsxSelfClosingElement(
      this.tagName,
      this.typeArguments,
      (this.attributes as JsxAttribute[]).slice(),
      this.context
    );
  }
}
