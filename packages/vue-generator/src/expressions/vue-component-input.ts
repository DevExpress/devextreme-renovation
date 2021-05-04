import {
  Call,
  ComponentInput,
  Decorator,
  Expression,
  GeneratorContext,
  Identifier,
  SyntaxKind,
  TypeExpression,
} from '@devextreme-generator/core';
import { Property } from './class-members/property';

export class VueComponentInput extends ComponentInput {
  createProperty(
    decorators: Decorator[],
    modifiers: string[] | undefined,
    name: Identifier,
    questionOrExclamationToken?: string,
    type?: string | TypeExpression,
    initializer?: Expression,
  ) {
    return new Property(
      decorators,
      modifiers,
      name,
      questionOrExclamationToken,
      type,
      initializer,
    );
  }

  createDecorator(expression: Call, context: GeneratorContext) {
    return new Decorator(expression, context);
  }

  toString(): string {
    const componentInputs = Object.keys(this.context.components || {}).reduce(
      (componentInputArr, key) => {
        const component = this.context.components?.[key];
        if (component instanceof ComponentInput) {
          componentInputArr.push(component);
        }
        return componentInputArr;
      },
      [] as ComponentInput[],
    );
    const members = this.baseTypes
      .map((t) => `...${t}`)
      .concat(
        this.members
          .filter((m) => !m.inherited)
          .map((m) => (m instanceof Property ? m.inherit() : m))
          .map((m) => m.toString({
            members: [],
            componentInputs:
                m.name === '__defaultNestedValues'
                  ? componentInputs
                  : undefined,
          })),
      )
      .filter((m) => m);
    const modifiers = this.modifiers.indexOf(SyntaxKind.DefaultKeyword) === -1
      ? this.modifiers
      : [];
    return `${modifiers.join(' ')} const ${this.name} = {
              ${members.join(',')}
          };
          ${
  modifiers !== this.modifiers
    ? `${this.modifiers.join(' ')} ${this.name}`
    : ''
}`;
  }

  getInitializerScope(component: string, name: string) {
    const initializer = `${component}.${name}.default`;
    return `typeof ${initializer}==="function"?${initializer}():${initializer}`;
  }

  buildDefaultStateProperty() {
    return null;
  }
}
