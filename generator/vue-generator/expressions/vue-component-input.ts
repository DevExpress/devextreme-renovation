import { ComponentInput } from "../../base-generator/expressions/component-input";
import { Decorator } from "../../base-generator/expressions/decorator";
import { Identifier, Call } from "../../base-generator/expressions/common";
import { TypeExpression } from "../../base-generator/expressions/type";
import { Expression } from "../../base-generator/expressions/base";
import { Property } from "./class-members/property";
import { GeneratorContext } from "../../base-generator/types";
import SyntaxKind from "../../base-generator/syntaxKind";
import { Method } from "./class-members/method";
import { ObjectLiteral } from "../../base-generator/expressions/literal";
import { PropertyAssignment } from "../../base-generator/expressions/property-assignment";

export class VueComponentInput extends ComponentInput {
  createProperty(
    decorators: Decorator[],
    modifiers: string[] | undefined,
    name: Identifier,
    questionOrExclamationToken?: string,
    type?: string | TypeExpression,
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

  createDecorator(expression: Call, context: GeneratorContext) {
    return new Decorator(expression, context);
  }

  toString() {
    const componentInputs = Object.keys(this.context?.components || {}).map(
      (name) => {
        const members = this.context?.components?.[name].members;
        return {
          name,
          isNested: members?.some((m) => m.isNested) || false,
          fields: members?.map((m) => m._name),
        };
      }
    );
    const members = this.baseTypes
      .map((t) => `...${t}`)
      .concat(
        this.members
          .filter((m) => !m.inherited)
          .map((m) => (m instanceof Property ? m.inherit() : m))
          .map((m) =>
            m.toString({
              members: [],
              componentInputs:
                m.name === "__defaultNestedValues"
                  ? componentInputs
                  : undefined,
            })
          )
      )
      .filter((m) => m);
    const modifiers =
      this.modifiers.indexOf(SyntaxKind.DefaultKeyword) === -1
        ? this.modifiers
        : [];
    return `${modifiers.join(" ")} const ${this.name} = {
              ${members.join(",")}
          };
          ${
            modifiers !== this.modifiers
              ? `${this.modifiers.join(" ")} ${this.name}`
              : ""
          }`;
  }

  getInitializerScope(component: string, name: string) {
    const initializer = `${component}.${name}.default`;
    return `typeof ${initializer}==="function"?${initializer}():${initializer}`;
  }

  buildDefaultStateProperty() {
    return null;
  }

  createDefaultNested(members: Array<Property | Method>) {
    const containNestedWithInitializer = members.some(
      (m) => m.isNested && m instanceof Property && m.initializer
    );
    const initializerArray = members.reduce((accum, m) => {
      if (m instanceof Property && m.initializer) {
        accum.push({ name: m.name, initializer: m.initializer });
      }
      return accum;
    }, [] as { name: string; initializer: Expression }[]);
    if (containNestedWithInitializer && initializerArray.length) {
      const defaultNestedValuesProp = new Property(
        [new Decorator(new Call(new Identifier("OneWay"), undefined, []), {})],
        [],
        new Identifier("__defaultNestedValues"),
        "",
        undefined,
        new ObjectLiteral(
          initializerArray.map(
            (elem) =>
              new PropertyAssignment(
                new Identifier(elem.name),
                elem.initializer
              )
          ),
          true
        )
      );
      return defaultNestedValuesProp;
    }
    return undefined;
  }
  processMembers(members: Array<Property | Method>) {
    const defaultNested = this.createDefaultNested(members);
    if (defaultNested) {
      members.push(defaultNested);
    }
    return super.processMembers(members);
  }
}
