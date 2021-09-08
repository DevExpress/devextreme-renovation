import { Identifier, Call } from './common';
import { Property, Method } from './class-members';
import {
  ExpressionWithTypeArguments,
  TypeExpression,
  LiteralTypeNode,
  UnionTypeNode,
  TypeOperatorNode,
  TypeReferenceNode,
} from './type';
import { GeneratorContext } from '../types';
import { Decorator } from './decorator';
import { StringLiteral } from './literal';
import { findComponentInput } from '../utils/expressions';
import { Expression } from './base';
import { compileTypeParameters } from '../utils/string';

export function inheritMembers(
  heritageClauses: HeritageClause[],
  members: Array<Property | Method>,
) {
  return heritageClauses.reduce((m, { members }) => {
    members = members.filter((inheritMember) => m.every((m) => m.name.toString() !== inheritMember.name.toString()));
    return m.concat(members);
  }, members);
}

export function getMemberListFromTypeExpression(
  type: TypeExpression,
  context: GeneratorContext,
): string[] {
  if (
    type instanceof LiteralTypeNode
    && type.expression instanceof StringLiteral
  ) {
    return [type.expression.expression];
  }

  if (type instanceof UnionTypeNode) {
    return type.types.reduce(
      (types: string[], t) => types.concat(getMemberListFromTypeExpression(t, context)),
      [],
    );
  }

  if (type instanceof TypeOperatorNode) {
    const component = findComponentInput(
      type.type as TypeReferenceNode,
      context,
    );
    if (component) {
      return component.members.map((m) => m.name);
    }
  }
  return [];
}

export class HeritageClause {
  token: string;

  types: ExpressionWithTypeArguments[];

  members: Property[];

  defaultProps: string[] = [];

  get propsType() {
    if (this.isJsxComponent) {
      return this.types[0].type;
    }
    return this.types[0];
  }

  get typeNodes() {
    return this.types.map((t) => t.typeNode);
  }

  get isJsxComponent() {
    return this.types.some((t) => t.isJsxComponent);
  }

  get requiredProps() {
    if (
      this.types[0].expression instanceof Call
      && this.types[0].expression.typeArguments?.[1]
    ) {
      return getMemberListFromTypeExpression(
        this.types[0].expression.typeArguments[1],
        this.context,
      );
    }
    return [];
  }

  constructor(
    token: string,
    types: ExpressionWithTypeArguments[],
    public context: GeneratorContext,
  ) {
    this.token = token;
    this.types = types;

    this.members = types.reduce((properties: Property[], typeExpression) => {
      const typeString = typeExpression.type.toString().replace('typeof ', '');
      if (
        context.components
        && context.components[typeString]
        && context.components[typeString]
      ) {
        properties = properties.concat(
          context.components[typeString].heritageProperties,
        );
      }
      return properties;
    }, []);
  }

  toString() {
    return `${this.token} ${this.types.map((t) => t.toString())}`;
  }
}

export class Class extends Expression {
  decorators: Decorator[];

  _name: Identifier;

  members: Array<Property | Method>;

  modifiers: string[];

  heritageClauses: HeritageClause[];

  context: GeneratorContext;

  typeParameters: TypeExpression[] | string[] | undefined;

  get name() {
    return this._name.toString();
  }

  processMembers(members: Array<Property | Method>) {
    return [...members];
  }

  constructor(
    decorators: Decorator[],
    modifiers: string[] = [],
    name: Identifier,
    typeParameters: TypeExpression[] | string[] | undefined,
    heritageClauses: HeritageClause[] = [],
    members: Array<Property | Method>,
    context: GeneratorContext,
  ) {
    super();
    this._name = name;
    this.decorators = decorators;
    this.modifiers = modifiers;
    this.heritageClauses = heritageClauses;
    this.context = context;
    this.members = this.processMembers(members);
    this.typeParameters = typeParameters;
  }

  toString() {
    return `${this.decorators.join('\n')}
        ${this.modifiers.join(' ')} class ${this.name}
        ${compileTypeParameters(this.typeParameters)} ${
  this.heritageClauses.length ? `${this.heritageClauses.join(' ')}` : ''
} {
            ${this.members.join('\n')}
        }`;
  }
}

export interface Heritable {
  name: string;
  heritageProperties: Property[];
  compileDefaultProps(): string;
  defaultPropsDest(): string;
  members: Array<Property | Method>;
}
