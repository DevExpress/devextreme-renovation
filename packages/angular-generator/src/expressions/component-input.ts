import {
  Block,
  Call,
  ComponentInput as BaseComponentInput,
  Expression,
  Identifier,
  Method,
  Parameter,
  ReturnStatement,
  SimpleExpression,
  SyntaxKind,
  TypeExpression,
} from '@devextreme-generator/core';

import { AngularGeneratorContext } from '../types';
import { GetAccessor } from './class-members/get-accessor';
import { Property } from './class-members/property';
import { SetAccessor } from './class-members/set-accessor';
import { compileCoreImports } from './component';
import { Decorator } from './decorator';

export class ComponentInput extends BaseComponentInput {
  createProperty(
    decorators: Decorator[],
    modifiers: string[] | undefined,
    name: Identifier,
    questionOrExclamationToken?: string,
    type?: TypeExpression | string,
    initializer?: Expression,
    fromCode = false,
  ) {
    return new Property(
      decorators,
      modifiers,
      name,
      questionOrExclamationToken,
      type,
      initializer,
      false,
      fromCode,
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
        this.context,
      )}`,
    ];
    const missedImports = this.getImports(this.context);

    return imports.concat(missedImports.map((i) => i.toString())).join(';\n');
  }

  processNestedProperty(property: Property) {
    const {
      decorators,
      modifiers,
      questionOrExclamationToken,
      type,
      name,
      initializer,
    } = property;
    const parentName = this.heritageClauses?.[0]?.typeNodes?.[0];
    const inheritedPostfix = this.heritageClauses?.[0]?.members.some(
      (parentMember) => parentMember.name === name,
    ) ? `${parentName || 'Inherited'}` : '';

    const resultArray = [
      this.createNestedState(name, questionOrExclamationToken, type, inheritedPostfix),
      this.createNestedPropertySetter(
        decorators,
        modifiers,
        name,
        questionOrExclamationToken,
        `${type}`,
        inheritedPostfix,
      ),
      this.createNestedPropertyGetter(
        modifiers,
        name,
        questionOrExclamationToken,
        type,
        initializer,
        inheritedPostfix,
      ),
    ];
    return resultArray;
  }

  createNestedState(
    name: string,
    questionOrExclamationToken: string,
    type: TypeExpression | string,
    inheritedPostfix = '',
  ) {
    return new Property(
      [],
      ['private'],
      new Identifier(`__${name}${inheritedPostfix}__`),
      questionOrExclamationToken || SyntaxKind.QuestionToken,
      `${type}`,
      undefined,
    );
  }

  createNestedPropertySetter(
    decorator: Decorator[],
    modifiers: string[],
    name: string,
    questionOrExclamationToken: string,
    type: string | TypeExpression,
    inheritedPostfix = '',
  ) {
    let typeString = type.toString();
    if (questionOrExclamationToken === '?') {
      typeString += '| undefined';
    }
    const statements = [new SimpleExpression(`this.__${name}${inheritedPostfix}__=value;`)];

    return new SetAccessor(
      decorator,
      modifiers,
      new Identifier(`${name}`),
      [
        new Parameter(
          [],
          [],
          undefined,
          new Identifier('value'),
          '',
          typeString,
        ),
      ],
      new Block(statements, true),
    );
  }

  createNestedPropertyGetter(
    modifiers: string[],
    name: string,
    questionOrExclamationToken: string,
    type: string | TypeExpression,
    initializer?: Expression,
    inheritedPostfix = '',
  ) {
    let typeString = `${type}`;
    if (questionOrExclamationToken === '?') {
      typeString += '| undefined';
    }

    const statements = [];
    if (initializer) {
      statements.push(
        new SimpleExpression(`if(!this.__${name}${inheritedPostfix}__){
        return ${this.name}.__defaultNestedValues.${name}
      }`),
      );
    }
    statements.push(
      new ReturnStatement(new SimpleExpression(`this.__${name}${inheritedPostfix}__`)),
    );

    return new GetAccessor(
      [],
      modifiers,
      new Identifier(`${name}`),
      [],
      typeString,
      new Block(statements, true),
    );
  }

  createDefaultNestedValues(members: Array<Property | Method>) {
    const resultProp = super.createDefaultNestedValues(members);
    if (resultProp?.modifiers) {
      resultProp.modifiers.push('public', 'static');
      resultProp.decorators = [];
    }
    return resultProp;
  }

  toString() {
    const membersWithNestedReplaced = this.members.reduce((acc, m) => {
      if (m.isNested && m instanceof Property) {
        acc.push(...this.processNestedProperty(m));
      } else {
        acc.push(m);
      }

      return acc;
    }, [] as Array<Property | Method>);

    return `
        ${this.compileImports()}
        ${this.modifiers.join(' ')} class ${
  this.name
} ${this.heritageClauses.map((h) => h.toString()).join(' ')} {
            ${membersWithNestedReplaced
    .filter(
      (p) => (p instanceof Property || SetAccessor || GetAccessor)
                  && !p.inherited,
    )
    .map((m) => m.toString())
    .filter((m) => m)
    .concat('')
    .join(';\n')}
        }`;
  }
}
