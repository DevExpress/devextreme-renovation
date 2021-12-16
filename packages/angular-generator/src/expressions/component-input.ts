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
  Decorator as BaseDecorator,
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

  createDecorator(expression: Call, context: AngularGeneratorContext) {
    return new Decorator(expression, context);
  }

  buildDefaultStateProperty() {
    return null;
  }

  compileImports() {
    const imports = [
      `${compileCoreImports(
        this.members.filter((m) => !m.inherited),
        this.context,
        ['Injectable'],
      )}`,
    ];
    const missedImports = this.getImports(this.context);
    const defaultImport: string[] = [];
    this.compileDefaultPropsImport(defaultImport);
    return [...imports, ...missedImports.map((i) => i.toString()), ...defaultImport].join(';\n');
  }

  compileDefaultPropsImport(imports: string[]): void {
    const hasSlotProperty = this.members.some((m) => m.isSlot);
    const runTimeImports = [
      ...(hasSlotProperty ? ['isSlotEmpty'] : []),
    ];
    if (runTimeImports.length) {
      imports.push(`import {${runTimeImports.join(' ,')}} from '@devextreme/runtime/angular'`);
    }
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
    decorator: BaseDecorator[],
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
        @Injectable()
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
