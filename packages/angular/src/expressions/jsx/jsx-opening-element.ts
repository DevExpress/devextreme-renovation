import {
  BaseFunction,
  BindingPattern,
  Component,
  Conditional,
  Expression,
  extractComponentFromType,
  GeneratorContext,
  GetAccessor,
  getExpression,
  getMember,
  getProps,
  Identifier,
  isFunction,
  JsxOpeningElement as BaseJsxOpeningElement,
  Method,
  ObjectLiteral,
  Parameter,
  Paren,
  Prefix,
  processComponentContext,
  Property,
  PropertyAccess,
  PropertyAssignment,
  PropertySignature,
  ShorthandPropertyAssignment,
  SimpleExpression,
  SyntaxKind,
  TypeLiteralNode,
} from "@devextreme-generator/core";
import { JsxSpreadAttributeMeta, JsxSpreadAttribute } from "./spread-attribute";
import { JsxAttribute } from "./attribute";
import { toStringOptions, IPropsGetAccessor } from "../../types";
import { AngularDirective } from "./angular-directive";
import { JsxExpression } from "./jsx-expression";
import {
  JsxChildExpression,
  mergeToStringOptions,
} from "./jsx-child-expression";
import { JsxElement } from "./elements";
import { AngularComponent } from "../component";
import { counter } from "../../counter";
import { PropsGetAccessor } from "../class-members/props-get-accessor";

function pickSpreadValue(first: string, second: string): string {
  return `(${second}!==undefined?${second}:${first})`;
}

function functionParameterToTemplateVariables(
  parameter?: Parameter,
  options?: toStringOptions
): AngularDirective[] {
  if (!parameter) {
    return [];
  }

  if (parameter.type instanceof TypeLiteralNode) {
    return parameter.type.members.map((param: Property | PropertySignature) => {
      const name = param.name.toString(options);
      return new AngularDirective(
        new Identifier(`let-${name}`),
        new Identifier(name)
      );
    });
  }

  if (parameter.name instanceof BindingPattern) {
    return parameter.name.elements.map((element) => {
      return new AngularDirective(
        new Identifier(`let-${element.name}`),
        new Identifier(`${element.propertyName || element.name}`)
      );
    });
  }

  throw `Can't convert function parameter ${parameter.toString()} into template parameter: Use BindingPattern or TypeLiteralNode`;
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

  processAngularSelector(
    selector: string,
    isClosing = false,
    options?: toStringOptions
  ) {
    const svgPrefix = "svg:";
    const prefix =
      options?.isSVG && selector.indexOf(svgPrefix) === -1 ? svgPrefix : "";
    return isClosing
      ? selector.replace(/\[.+\]/gi, "")
      : `${prefix}${selector.replace("[", "").replace("]", "")}`;
  }

  processTagName(
    tagName: Expression,
    options?: toStringOptions,
    isClosing = false
  ): Expression {
    if (this.isDynamicComponent(options)) {
      return new SimpleExpression("ng-template");
    }

    if (this.component instanceof AngularComponent) {
      const selector = this.processAngularSelector(
        this.component.selector,
        isClosing,
        options
      );
      return new Identifier(selector);
    }
    if (tagName.toString() === "Portal") {
      return new Identifier("dx-portal");
    }

    if (options?.isSVG && !isClosing) {
      return new SimpleExpression(`svg:${super.processTagName(tagName)}`);
    }

    return super.processTagName(tagName);
  }

  getTemplateProperty(options?: toStringOptions) {
    const tagName = getExpression(this.tagName, options).toString(options);
    const contextExpr = processComponentContext(options?.newComponentContext);
    return options?.members
      .filter((m) => m.isTemplate)
      .find((s) => tagName.endsWith(`${contextExpr}${s.name.toString()}`));
  }

  isDynamicComponent(options?: toStringOptions): boolean {
    const member = getMember(this.tagName, options);

    if (member instanceof GetAccessor) {
      return true;
    }

    if (options?.mapItemName === this.tagName.toString(options)) {
      return true;
    }

    return false;
  }

  getPropertyFromSpread(_property: Property) {
    return true;
  }

  isPropsGetAccessor(
    member: Property | Method | undefined
  ): member is IPropsGetAccessor {
    return member instanceof PropsGetAccessor;
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

    if (spreadAttributesExpression instanceof ObjectLiteral) {
      const attributesFromObject: JsxAttribute[] = spreadAttributesExpression.properties.reduce(
        (values: JsxAttribute[], p) => {
          if (p instanceof PropertyAssignment) {
            return values.concat([
              this.createJsxAttribute(
                new Identifier(p.key.toString()),
                p.value
              ),
            ]);
          }
          if (p instanceof ShorthandPropertyAssignment) {
            return values.concat([
              this.createJsxAttribute(
                new Identifier(p.key.toString()),
                p.value
              ),
            ]);
          }

          return values.concat(
            this.spreadToArray(
              new JsxSpreadAttribute(undefined, p.expression),
              options
            )
          );
        },
        []
      );

      return attributesFromObject;
    }

    if (spreadAttributesExpression instanceof PropertyAccess) {
      const member = spreadAttributesExpression.getMember(options);
      if (
        member instanceof GetAccessor &&
        member._name.toString() === "restAttributes"
      ) {
        return [];
      }
      if (this.component && this.isPropsGetAccessor(member)) {
        return member.props.map((p) => {
          return this.createJsxAttribute(
            new Identifier(p._name.toString()),
            new PropertyAccess(
              new PropertyAccess(
                new Identifier(options!.componentContext!),
                new Identifier("props")
              ),
              p._name
            )
          );
        });
      }
    }

    return properties.reduce((acc: JsxAttribute[], prop: Method | Property) => {
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
          (attrIndex > spreadIndex || attrIndex === -1)
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
    }, []);
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
    _attributes: JsxAttribute[]
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

  compileTemplate(templateProperty: Property, options: toStringOptions) {
    const contextExpr = processComponentContext(options?.newComponentContext);
    const contextElements = this.attributes
      .reduce((elements: PropertyAssignment[], a) => {
        const contextElements = a.getTemplateContext(options, this.context);
        return elements.concat(contextElements);
      }, [])
      .filter((el) => el.key.toString() !== "key");

    const keyAttribute = this.attributes.find(
      (el) => el instanceof JsxAttribute && el.name.toString() == "key"
    );
    if (keyAttribute instanceof JsxAttribute) {
      keyAttribute.compileKey(options);
    }
    const contextString = contextElements.length
      ? `; context:${new ObjectLiteral(contextElements, false)
          .toString(options)
          .replace(/"/gi, "'")}`
      : "";
    const containerAttributes = this.attributes
      .filter((a) => a instanceof AngularDirective)
      .map((a) => a.toString(options));

    const initializer = templateProperty.initializer;
    const name = templateProperty.name;

    let elementString = `<ng-container *ngTemplateOutlet="${contextExpr}${name}${contextString}"></ng-container>`;

    const initializerComponent =
      initializer instanceof Identifier &&
      this.context.components &&
      this.context.components[initializer.toString()]
        ? this.context.components[initializer.toString()]
        : undefined;
    if (
      options &&
      (initializer instanceof BaseFunction ||
        (initializer instanceof Identifier && initializerComponent))
    ) {
      elementString = `<ng-container *ngTemplateOutlet="${contextExpr}${name}||${name}Default${contextString}">
      </ng-container>`;
      if (initializerComponent) {
        options.templateComponents = options.templateComponents
          ? [...new Set([...options.templateComponents, initializerComponent])]
          : [initializerComponent];
      }
      const contextElementsStr = contextElements.map((el) => el.key.toString());
      options.defaultTemplates = options.defaultTemplates || {};
      if (options.defaultTemplates[name]) {
        const oldVariables = options.defaultTemplates[name].variables;
        options.defaultTemplates[name].variables = [
          ...new Set([...oldVariables, ...contextElementsStr]),
        ];
      } else
        options.defaultTemplates[name] = {
          variables: contextElementsStr,
          initializer,
        };
    }
    if (containerAttributes.length) {
      return `<ng-container ${containerAttributes.join("\n")}>
        ${elementString}
      </ng-container>`;
    }

    return elementString;
  }

  separateChildrenForDynamicComponent(
    children: Array<string | Expression>,
    options?: toStringOptions
  ): [string, string] | null {
    if (this.isDynamicComponent(options) && children.length) {
      const templates = children.filter(
        (c) =>
          c instanceof JsxElement &&
          c.openingElement.tagName.toString() === "ng-template"
      ) as JsxElement[];

      const childrenString = children
        .filter((c) => !templates.some((t) => t === c))
        .map((c) => c.toString(options))
        .join("");

      const templatesString = templates
        .map((c) => c.toString(options))
        .join("");

      return [childrenString, templatesString];
    }

    return null;
  }

  compileDynamicComponent(
    options: toStringOptions,
    expression: Expression
  ): string {
    const member = getMember(expression, options);
    const component = extractComponentFromType(member?.type, this.context);
    this.component = component;
    const templates = component?.members.filter((m) => m.isTemplate);
    const props = this.attributes.filter(
      (a) =>
        !(a instanceof AngularDirective) &&
        !(a instanceof JsxAttribute && a.name.toString() === "key")
    );

    options.hasDynamicComponents = true;

    const params = options.members
      .filter((m) => m.isInternalState || m instanceof GetAccessor)
      .concat(getProps(options.members))
      .map((prop) => `let-${prop._name}="${prop._name}"`);

    const propsObject = props.map((p, index) => {
      if (p instanceof JsxSpreadAttribute) {
        return new PropertyAssignment(
          new Identifier(`dxSpreadProp${index}`),
          p.expression
        );
      }
      if (templates?.some((m) => m.name === p.name.toString())) {
        const stringValue = p.toString({
          ...options,
          jsxComponent: component,
        });
        const templateValue = /"(.+)"/gi.exec(stringValue)?.[1];
        return new PropertyAssignment(
          p.name,
          new SimpleExpression(templateValue || "null")
        );
      } else {
        const member = getMember(p.initializer, options);
        const valueExpression =
          member instanceof Method
            ? new SimpleExpression(
                `${p.initializer.toString(options)}.bind(this)`
              )
            : p.initializer;
        return new PropertyAssignment(p.name, valueExpression);
      }
    });

    const directives = this.attributes
      .filter((a) => a instanceof AngularDirective)
      .concat([
        new JsxAttribute(
          new Identifier("props"),
          new ObjectLiteral(propsObject, false)
        ),
      ])
      .map((d) => d.toString(options))
      .concat(`[componentConstructor]="${this.tagName.toString(options)}"`)
      .concat(params)
      .join("\n");

    return `<ng-template dynamicComponent ${directives}>`;
  }

  toString(options?: toStringOptions) {
    this.fillComponent();
    const templateProperty = this.getTemplateProperty(options) as
      | Property
      | undefined;
    if (templateProperty) {
      this.checkTemplatePropUsage(templateProperty);
      return this.compileTemplate(templateProperty, options!);
    }

    const isDynamicComponent = this.isDynamicComponent(options);
    if (isDynamicComponent) {
      let expression = this.tagName;
      if (this.tagName.toString(options) === options!.mapItemName) {
        expression = options!.mapItemExpression!;
      }

      return this.compileDynamicComponent(options!, expression);
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

  createTemplateElement(
    name: string,
    parameters: AngularDirective[],
    element: string | JsxExpression | JsxSelfClosingElement | JsxElement
  ): JsxElement {
    const tag = new SimpleExpression("ng-template");
    const ref = new AngularDirective(
      new Identifier(`#${name}`),
      new SimpleExpression("")
    );
    return new JsxElement(
      new JsxOpeningElement(tag, undefined, [ref, ...parameters], this.context),
      [element],
      new JsxClosingElement(tag, this.context)
    );
  }

  componentToJsxElement(name: string, component: Component) {
    const attributes = getProps(component.members).map((prop) => {
      let initializer: Expression = prop._name;
      if (prop.initializer) {
        initializer = this.createJsxExpression(
          new SimpleExpression(
            `(${prop._name} !== undefined ? ${prop._name} : ${component.name}Defaults.${prop._name})`
          )
        );
      }
      return new JsxAttribute(prop._name, initializer);
    });
    const element = new JsxSelfClosingElement(
      component._name,
      undefined,
      attributes,
      component.context
    );
    const templateAttr = getProps(component.members).map(
      (prop) =>
        new AngularDirective(new Identifier(`let-${prop._name}`), prop._name)
    );

    return this.createTemplateElement(name, templateAttr, element);
  }

  templatePropToJsxElement(
    _template: JsxAttribute,
    _options?: toStringOptions
  ): JsxElement | null {
    return null;
  }

  functionToJsxElement(
    name: string,
    func: BaseFunction,
    options?: toStringOptions
  ) {
    const templateOptions: toStringOptions = {
      members: [],
      ...options,
    };

    const element = func.getTemplate(templateOptions);

    mergeToStringOptions(options, templateOptions);

    return this.createTemplateElement(
      name,
      functionParameterToTemplateVariables(func.parameters[0]),
      element
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

      if (options) {
        options.templateComponents = (options.templateComponents || []).concat(
          components.map((c) => c.component)
        );
      }

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
        if (
          template.initializer.isJsx() &&
          isFunction(getExpression(template.initializer))
        ) {
          acc.push({
            name: this.getArrowFunctionGeneratedName(template.name.toString()),
            func: getExpression(template.initializer) as BaseFunction,
          });
        }
        return acc;
      }, [] as { name: string; func: BaseFunction }[]);

      const props = templates.filter(
        (t) =>
          !(components as { name: string }[])
            .concat(functions)
            .some(
              ({ name }) =>
                name === this.getTemplateName(t) ||
                name === `__${this.getTemplateName(t)}__generated`
            )
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
  getArrowFunctionGeneratedName(templateName: string) {
    return `__${templateName}__generated`;
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
        return undefined;
      });

    return result.filter((a) => a) as JsxSpreadAttributeMeta[];
  }

  createJsxElementForVariable(
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
      new JsxClosingElement(expression, this.context)
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
        this.createJsxElementForVariable(variable.thenStatement, children, [
          new AngularDirective(new Identifier("*ngIf"), variable.expression),
        ]),
        this.createJsxElementForVariable(variable.elseStatement, children, [
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
      return this.createJsxElementForVariable(variable, children, []).toString(
        options
      );
    }

    return undefined;
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

    const separatedChildren = this.separateChildrenForDynamicComponent(
      children,
      options
    );

    if (separatedChildren) {
      return `${openingElement}${separatedChildren[0]}</${this.processTagName(
        this.tagName,
        options,
        true
      )}>
        ${separatedChildren[1]}`;
    }

    const childrenString = children.map((c) => c.toString(options)).join("");

    return `${openingElement}${childrenString}</${this.processTagName(
      this.tagName,
      options,
      true
    )}>`;
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

export class JsxClosingElement extends JsxOpeningElement {
  constructor(tagName: Expression, context: GeneratorContext) {
    super(tagName, [], [], context);
  }

  processTagName(tagName: Expression, options?: toStringOptions): Expression {
    return super.processTagName(tagName, options, true);
  }

  toString(options?: toStringOptions) {
    return `</${this.processTagName(this.tagName, options).toString(options)}>`;
  }
}
