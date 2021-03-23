import { Property } from './class-members/property';
import { compileCoreImports } from './component';
import { Decorator } from './decorator';
import { AngularGeneratorContext } from '../types';
import {
  Call,
  Expression,
  Identifier,
  ComponentInput as BaseComponentInput,
  TypeExpression,
} from "@devextreme-generator/core";


export class ComponentInput extends BaseComponentInput {
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

  compileImports() {
    const imports: string[] = [
      `${compileCoreImports(
        this.members.filter((m) => !m.inherited),
        this.context
      )}`,
    ];
    const missedImports = this.getImports(this.context);

    return imports.concat(missedImports.map((i) => i.toString())).join(";\n");
  }

  toString() {
    return `
        ${this.compileImports()}
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
