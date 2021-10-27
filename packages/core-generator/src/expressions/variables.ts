import { Expression, SimpleExpression } from './base';
import {
  Identifier, Paren, Call, AsExpression,
} from './common';
import { TypeExpression } from './type';
import { PropertyAccess } from './property-access';
import { toStringOptions, VariableExpression } from '../types';
import { BindingPattern, BindingElement } from './binding-pattern';
import { compileType } from '../utils/string';
import { getProps } from './component';
import { SyntaxKind } from '../syntaxKind';
import { Property, Method } from './class-members';
import { Dependency } from '..';

function getInitializer(expression?: Expression): Expression | undefined {
  if (expression instanceof AsExpression || expression instanceof Paren) {
    return getInitializer(expression.expression);
  }
  return expression;
}
export class VariableDeclaration extends Expression {
  name: Identifier | BindingPattern;

  type?: TypeExpression;

  initializer?: Expression;

  constructor(
    name: Identifier | BindingPattern,
    type?: TypeExpression,
    initializer?: Expression,
  ) {
    super();
    this.name = name;
    this.type = type;
    this.initializer = initializer;
  }

  getVariables(members: (Property | Method)[]) {
    return members.reduce((v: VariableExpression, m) => {
      const bindingPattern = this.name as BindingPattern;
      bindingPattern.remove(m._name.toString());
      if (bindingPattern.hasRest()) {
        bindingPattern.add(
          new BindingElement(undefined, undefined, new Identifier(m.name)),
        );
      }
      return {
        ...v,
        [m._name.toString()]: this.initializer
          ? new PropertyAccess(this.initializer, new Identifier(m.name))
          : new SimpleExpression(m.name),
      };
    }, {});
  }

  toString(options?: toStringOptions) {
    if (this.initializer?.toString() === 'this' && options?.members.length) {
      const members = options.members.filter(
        (member) => !member.canBeDestructured,
      );
      options.variables = {
        ...options.variables,
        ...this.getVariables(members),
      };
    }

    if (
      this.name instanceof BindingPattern
      && options?.members.length
      && this.initializer instanceof (PropertyAccess || Identifier)
      && this.initializer
        .toString({
          members: [],
          variables: { ...options.variables },
        })
        .endsWith('props')
    ) {
      const dependency = this.name.getDependency(options);
      const members = getProps(options.members).filter(
        (m) => !m.canBeDestructured && dependency.indexOf(m) >= 0,
      );

      options.variables = {
        ...options.variables,
        ...this.getVariables(members),
      };
    }

    let initializer: string | undefined = this.initializer?.toString(options);

    const initializerExpression = getInitializer(this.initializer);

    if (
      initializerExpression instanceof PropertyAccess
      && initializerExpression.checkPropsAccess(
        initializerExpression.toString(),
        options,
      )
      && options
    ) {
      initializer = this.processPropInitializer(initializerExpression, options);
    }

    if (this.name.toString()) {
      return `${this.name}${compileType(this.type?.toString())}${
        initializer ? `=${initializer}` : ''
      }`;
    }
    return '';
  }

  // TODO: remove after inferno fixed https://github.com/infernojs/inferno/issues/1536
  processPropInitializer(initializerExpression: PropertyAccess, options: toStringOptions) {
    let elements: BindingElement[] = [];
    if (this.name instanceof BindingPattern) {
      elements = this.name.elements;
    }
    return this.initializer!.toString().replace(
      initializerExpression.toString(),
      initializerExpression.toString(options, elements),
    );
  }

  getDependency(options: toStringOptions): Dependency[] {
    if (this.initializer && typeof this.initializer !== 'string') {
      const initializerDependency = this.initializer.getDependency(options);
      const initializerString = this.initializer.toString();
      if (
        this.name instanceof BindingPattern
        && initializerString
          .startsWith(options?.componentContext || SyntaxKind.ThisKeyword)
      ) {
        if (this.name.hasRest()) {
          return initializerDependency;
        }
        if (initializerString === 'this.props' || initializerString === 'this') {
          return this.name.getDependency(options);
        }
        if (this.name.type === 'object') {
          const initName = this.initializer.toString(options);
          const initMember = this.initializer instanceof PropertyAccess
            ? this.initializer.getMember(options)
            : options.members.find((m) => m.name === initName);
          // if (initMember instanceof Method) {
          //   return this.name.elements.map((el) => `${initName}.${el.propertyName || el.name}`);
          // }
          return initMember ? [initMember] : [];
        }
        // check if type is array
        return this.name.getDependency(options);
      }
      return initializerDependency;
    }
    return [];
  }

  destructuredDepsString(options: toStringOptions): string[] {
    if (this.initializer && typeof this.initializer !== 'string') {
      const initializerString = this.initializer.toString();
      if (
        this.name instanceof BindingPattern
        && initializerString
          .startsWith(options?.componentContext || SyntaxKind.ThisKeyword)
      ) {
        if (this.name.type === 'object') {
          const initName = this.initializer.toString(options);
          const initMember = this.initializer instanceof PropertyAccess
            ? this.initializer.getMember(options)
            : options.members.find((m) => m.name === initName);
          if (initializerString === 'this.props' || initializerString === 'this') {
            return [];
          }
          if (initMember instanceof Method) {
            return this.name.elements.map((el) => `${initName}.${el.propertyName || el.name}`);
          }
          return [initName];
          // check if initMember not a method
        }
      }
    }
    return [];
  }

  getVariableExpressions(): VariableExpression {
    if (
      this.name instanceof Identifier
      && this.initializer instanceof Expression
    ) {
      const expression = this.initializer instanceof SimpleExpression
        || this.initializer.isJsx()
        || this.initializer instanceof Call
        ? this.initializer
        : new Paren(this.initializer);

      return {
        [this.name.toString()]: expression,
      };
    }
    if (this.name instanceof BindingPattern && this.initializer) {
      return this.name.getVariableExpressions(this.initializer);
    }
    return {};
  }

  isJsx() {
    return this.initializer instanceof Expression && this.initializer.isJsx();
  }
}

export class VariableDeclarationList extends Expression {
  declarations: VariableDeclaration[];

  flags?: string;

  constructor(declarations: VariableDeclaration[], flags?: string) {
    super();
    this.declarations = declarations;
    this.flags = flags;
  }

  toString(options?: toStringOptions) {
    const declarations = this.declarations
      .map((d) => d.toString(options))
      .filter((d) => d);
    if (declarations.length === 0) {
      return '';
    }
    return `${this.flags} ${declarations}`;
  }

  getDependency(options: toStringOptions): Dependency[] {
    return this.declarations.reduce(
      (d: Dependency[], p) => d.concat(p.getDependency(options)),
      [],
    );
  }

  getVariableExpressions(): VariableExpression {
    return this.declarations.reduce((v: VariableExpression, d) => ({
      ...v,
      ...d.getVariableExpressions(),
    }), {});
  }

  destructuredDepsString(options: toStringOptions): string[] {
    return this.declarations.reduce(
      (arr: string[], declaration) => [...arr, ...declaration.destructuredDepsString(options)],
      [],
    );
  }
}

export class VariableStatement extends Expression {
  declarationList: VariableDeclarationList;

  modifiers: string[];

  constructor(
    modifiers: string[] = [],
    declarationList: VariableDeclarationList,
  ) {
    super();
    this.modifiers = modifiers;
    this.declarationList = declarationList;
  }

  toString(options?: toStringOptions) {
    const declarationList = this.declarationList.toString(options);
    return declarationList
      ? `${this.modifiers.join(' ')} ${declarationList}`
      : '';
  }

  getDependency(options: toStringOptions): Dependency[] {
    return this.declarationList.getDependency(options);
  }

  getVariableExpressions() {
    return this.declarationList.getVariableExpressions();
  }

  destructuredDepsString(options: toStringOptions): string[] {
    return this.declarationList.destructuredDepsString(options);
  }
}
