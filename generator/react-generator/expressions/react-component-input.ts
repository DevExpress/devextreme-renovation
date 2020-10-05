import { ComponentInput as BaseComponentInput } from "../../base-generator/expressions/component-input";
import { Decorator } from "../../base-generator/expressions/decorator";
import { Identifier, Call } from "../../base-generator/expressions/common";
import { TypeExpression } from "../../base-generator/expressions/type";
import { Expression } from "../../base-generator/expressions/base";
import { compileJSXTemplateType, Property } from "./class-members/property";
import { Property as BaseProperty } from "../../base-generator/expressions/class-members";
import { BaseClassMember } from "../../base-generator/expressions/class-members";
import { Decorators } from "../../component_declaration/decorators";
import SyntaxKind from "../../base-generator/syntaxKind";
import { capitalizeFirstLetter } from "../../base-generator/utils/string";
import { Method } from "./class-members/method";

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
    const imports: string[] = [];

    const missedImports = this.collectMissedImports();
    Object.keys(missedImports).forEach((path) => {
      imports.push(`import { ${missedImports[path]} } from "${path}"`);
    });

    return imports;
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

    const propertiesWithInitializer = this.members.filter(
      (m) =>
        !(m as Property).inherited &&
        (m as Property).initializer &&
        m.decorators.find((d) => d.name !== Decorators.TwoWay)
    ) as Property[];

    return `${this.compileImports()}
          ${typeDeclaration}
          ${declarationModifiers.join(" ")} const ${this.name}:${typeName}={
             ${inherited
               .concat(
                 propertiesWithInitializer.map((p) => p.defaultDeclaration())
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

  processMembers(members: Array<BaseProperty | Method>) {
    members = super.processMembers(members);
    const children = this.createChildrenForNested(members);
    if (children !== null) {
      members.push(children);
    }
    return members;
  }

  getInitializerScope(component: string, name: string) {
    return `${component}.${name}`;
  }
}
