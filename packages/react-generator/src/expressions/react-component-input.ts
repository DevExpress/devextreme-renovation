import {
  BaseClassMember,
  Call,
  capitalizeFirstLetter,
  ComponentInput as BaseComponentInput,
  Decorator,
  Decorators,
  Expression,
  Identifier,
  Property as BaseProperty,
  SyntaxKind,
  TypeExpression
} from '@devextreme-generator/core';

import { Method } from './class-members/method';
import { compileJSXTemplateType, Property } from './class-members/property';

export function getTemplatePropName(
  name: Identifier | string,
  propName: string
) {
  return name
    .toString()
    .replace(/template/g, propName)
    .replace(/(.+)(Template)/g, `$1${capitalizeFirstLetter(propName)}`);
}

export function buildTemplateProperty(
  templateMember: Property,
  members: BaseClassMember[],
  propName: "render" | "component"
) {
  const templatePropName = getTemplatePropName(templateMember._name, propName);
  if (!members.find((m) => m._name.toString() === templatePropName)) {
    const type =
      propName === "render"
        ? compileJSXTemplateType(templateMember.type)
        : compileJSXTemplateType(templateMember.type, true);
    return new Property(
      [new Decorator(new Call(new Identifier("OneWay"), undefined, []), {})],
      [],
      new Identifier(templatePropName),
      SyntaxKind.QuestionToken,
      type,
      undefined
    );
  } else {
    throw `You can't use '${templatePropName}' property. It'll be generated for '${templateMember._name}' template property.`;
  }
}

export class ComponentInput extends BaseComponentInput {
  createProperty(
    decorators: Decorator[],
    modifiers: string[] | undefined,
    name: Identifier,
    questionOrExclamationToken?: string,
    type?: TypeExpression,
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

  buildTemplateProperties(
    templateMember: Property,
    members: BaseClassMember[]
  ) {
    return [
      buildTemplateProperty(templateMember, members, "render"),
      buildTemplateProperty(templateMember, members, "component"),
    ];
  }

  compileImports() {
    return this.getImports(this.context).join(";\n");
  }

  toString() {
    const inherited = this.baseTypes.map((t) => `...${t}`);

    const types = this.heritageClauses.reduce(
      (t: string[], h) => t.concat(h.typeNodes.map((t) => `typeof ${t}`)),
      []
    );
    const typeName = `${this.name}Type`;

    const properties = this.members.filter(
      (m) => !(m as Property).inherited
    ) as Property[];

    const typeDeclaration = `export declare type ${typeName} = ${types
      .concat([
        `{
              ${properties.map((p) => p.typeDeclaration()).join(";\n")}
          }`,
      ])
      .join("&")}`;

    const typeCasting = properties.some(
      (p) =>
        (p.questionOrExclamationToken === SyntaxKind.ExclamationToken &&
          !p.initializer) ||
        (p.type.toString() === "any" &&
          !p.questionOrExclamationToken &&
          !p.initializer) ||
        (p.isState && p.questionOrExclamationToken === "")
    )
      ? ` as any as ${typeName}`
      : "";

    const declarationModifiers =
      this.modifiers.indexOf("default") !== -1 ? [] : this.modifiers;

    const propertiesWithInitializer = this.members
      .filter(
        (m) =>
          !(m as Property).inherited &&
          (m as Property).initializer &&
          m.decorators.find((d) => d.name !== Decorators.TwoWay)
      )
      .filter((m) => !m.isNested) as Property[];

    const options = {
      members: [],
      componentInputs: Object.keys(this.context.components || {}).map(
        (name) => ({
          name,
          isNested:
            this.context.components?.[name]?.members.some((m) => m.isNested) ||
            false,
        })
      ),
    };
    return `${this.compileImports()}
          ${typeDeclaration}
          ${declarationModifiers.join(" ")} const ${this.name}:${typeName}={
             ${inherited
               .concat(
                 propertiesWithInitializer.map((p) => p.defaultProps(options))
               )
               .join(",\n")}
          }${typeCasting};
          ${
            declarationModifiers !== this.modifiers
              ? `${this.modifiers.join(" ")} ${this.name}`
              : ""
          }`;
  }

  createChildrenForNested(members: Array<BaseProperty | Method>) {
    const hasChildren = members.some((m) => m.isSlot && m.name === "children");
    const hasNested = members.some((m) => m.isNested);
    if (hasNested && !hasChildren) {
      return new Property(
        [
          new Decorator(
            new Call(new Identifier(Decorators.Slot), undefined, undefined),
            {}
          ),
        ],
        undefined,
        new Identifier("children"),
        "?",
        undefined,
        undefined,
        undefined
      );
    }
    return null;
  }

  createDefaultNestedValues(members: Array<BaseProperty | Method>) {
    const resultProp = super.createDefaultNestedValues(members);
    if (resultProp) {
      resultProp.type = `${this.name}Type`;
      resultProp.questionOrExclamationToken = SyntaxKind.QuestionToken;
    }
    return resultProp;
  }

  processMembers(members: Array<BaseProperty | Method>) {
    members = super.processMembers(members);
    const children = this.createChildrenForNested(members);
    if (children !== null) {
      members.push(children);
    }
    members.map((m) => {
      if (m instanceof Property && m.isNested && m.initializer) {
        m.questionOrExclamationToken = SyntaxKind.QuestionToken;
      }
    });
    return members;
  }

  getInitializerScope(component: string, name: string) {
    return `${component}.${name}`;
  }
}
