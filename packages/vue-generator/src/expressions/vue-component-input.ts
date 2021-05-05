import {
  Call,
  ComponentInput,
  Decorator,
  Expression,
  GeneratorContext,
  Identifier,
  PropertyAssignment,
  SimpleExpression,
  SyntaxKind,
  TypeExpression,
  PropertyAssignment as BasePropertyAssignment,
  PropertyAccess as BasePropertyAccess,
  PropertyAccessChain as BasePropertyAccessChain,
} from '@devextreme-generator/core';
import { Property } from './class-members/property';
import { PropertyAccess } from './property-access';
import { PropertyAccessChain } from './property-access-chain';

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

  compileParentNested(): PropertyAssignment[] {
    const baseParentNested = super.compileParentNested();
    return baseParentNested?.map((assignment) => {
      if (assignment instanceof BasePropertyAssignment
        && assignment.value instanceof BasePropertyAccessChain
        && assignment.value.name instanceof BasePropertyAccess) {
        return new PropertyAssignment(
          assignment.key,
          new PropertyAccessChain(
            assignment.value.expression,
            SyntaxKind.QuestionDotToken,
            new PropertyAccessChain(
              assignment.value.name.expression,
              SyntaxKind.QuestionDotToken,
              new PropertyAccess(
                new SimpleExpression('default()'),
                assignment.value.name.name,
              ),
            ),
          ),
        );
      }
      return assignment;
    });
  }
}
