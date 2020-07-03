import { ComponentInput as BaseComponentInput } from "../../base-generator/expressions/component-input";
import { Call, Identifier } from "../../base-generator/expressions/common";
import {
  Property as BaseProperty,
  Method,
} from "../../base-generator/expressions/class-members";
import { Decorators } from "../../component_declaration/decorators";
import {
  TypeLiteralNode,
  extractComplexType,
  TypeExpression,
  isTypeArray,
} from "../../base-generator/expressions/type";
import { Decorator } from "./decorator";
import { AngularGeneratorContext } from "../types";
import { Property } from "./class-members/property";
import { HeritageClause } from "../../base-generator/expressions/class";
import { Expression } from "../../base-generator/expressions/base";
import {
  AngularComponent,
  compileCoreImports,
  getAngularSelector,
} from "./component";
import { removePlural } from "../../base-generator/utils/string";

export class ComponentInput extends BaseComponentInput {
  context: AngularGeneratorContext;
  constructor(
    decorators: Decorator[],
    modifiers: string[] = [],
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
    context: AngularGeneratorContext
  ) {
    super(
      decorators,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members
    );
    this.context = context;
  }

  createProperty(
    decorators: Decorator[],
    modifiers: string[] | undefined,
    name: Identifier,
    questionOrExclamationToken?: string,
    type?: TypeExpression | string,
    initializer?: Expression
  ) {
    return new Property(
      decorators,
      modifiers,
      name,
      questionOrExclamationToken,
      type,
      initializer
    );
  }

  createDecorator(expression: Call, context: AngularGeneratorContext) {
    return new Decorator(expression, context);
  }

  buildDefaultStateProperty() {
    return null;
  }

  processMembers(members: Array<BaseProperty | Method>) {
    members = super.processMembers(members);

    const nested = members.filter((m) =>
      m.decorators.some((d) => d.name === Decorators.Nested)
    ) as Property[];
    nested.forEach((el) => {
      const nestedComp = this.createContentChildrenProperty(el);
      if (nestedComp) {
        members.push(nestedComp);
      }
    });

    return members;
  }

  createContentChildrenProperty(property: Property) {
    const {
      modifiers,
      questionOrExclamationToken,
      initializer,
      type,
      name,
    } = property;

    const decorator = this.createDecorator(
      new Call(new Identifier(Decorators.NestedComp), undefined, []),
      {}
    );
    const nestedType = extractComplexType(type);
    return this.createProperty(
      [decorator],
      modifiers,
      new Identifier(`${name}Nested`),
      questionOrExclamationToken,
      `Dx${nestedType}`,
      initializer
    );
  }

  compileNestedComponents() {
    const nestedProps = this.members.filter((m) => m.isNested);
    const nestedComponents = this.members.filter((m) => m.isNestedComp);

    const components = this.context.components;
    const types = this.context.types;

    const parentName =
      components &&
      Object.keys(components).find(
        (key) => components[key] instanceof AngularComponent
      );
    const parentSelector =
      components &&
      parentName &&
      (components[parentName] as AngularComponent).selector;

    if (parentSelector && types) {
      const result = nestedComponents
        .map((component) => {
          const relatedProp = nestedProps.find(
            (prop) => component.name.replace("Nested", "") === prop.name
          );
          const nestedTypeName = component.type.toString();
          const typeName = nestedTypeName.replace("Dx", "");
          const type = types[typeName];

          if (relatedProp && type instanceof TypeLiteralNode) {
            const fields = [...type.members]
              .map((m) => {
                const prop = this.createProperty(
                  [
                    this.createDecorator(
                      new Call(
                        new Identifier(Decorators.OneWay),
                        undefined,
                        undefined
                      ),
                      {}
                    ),
                  ],
                  undefined,
                  m.name,
                  m.questionToken,
                  m.type,
                  undefined
                );
                const result = prop.toString();
                if (m.questionToken !== "?") {
                  return result.replace(":", "!:");
                }
                return result;
              })
              .join(";\n");
            const isArray = isTypeArray(relatedProp.type);
            const postfix = isArray ? "i" : "o";
            let selectorName = isArray
              ? removePlural(relatedProp.name)
              : relatedProp.name;
            const selector = getAngularSelector(selectorName, postfix);

            return `@Directive({
                        selector: "${parentSelector} ${selector}"
                    })
                    class ${nestedTypeName} implements ${typeName} {
                        ${fields}
                    }`;
          }
        })
        .join("\n");
      return result;
    }
    return "";
  }

  toString() {
    return `
        ${compileCoreImports(
          this.members.filter((m) => !m.inherited),
          this.context
        )}
        ${this.compileNestedComponents()}
        ${this.modifiers.join(" ")} class ${
      this.name
    } ${this.heritageClauses.map((h) => h.toString()).join(" ")} {
            ${this.members
              .filter((p) => p instanceof Property && !p.inherited)
              .map((m) => m.toString())
              .filter((m) => m)
              .concat("")
              .join(";\n")}
        }`;
  }
}
