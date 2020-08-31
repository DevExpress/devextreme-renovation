import { Identifier, Call } from "./common";
import { Property, Method } from "./class-members";
import {
  ExpressionWithTypeArguments,
  TypeExpression,
  LiteralTypeNode,
  UnionTypeNode,
  TypeOperatorNode,
  TypeReferenceNode,
} from "./type";
import { GeneratorContext } from "../types";
import { Decorator } from "./decorator";
import { StringLiteral } from "./literal";
import { findComponentInput } from "../utils/expressions";
import { getModuleRelativePath } from "../utils/path-utils";
import { ImportClause } from "./import";

export function inheritMembers(
  heritageClauses: HeritageClause[],
  members: Array<Property | Method>
) {
  return heritageClauses.reduce((m, { members }) => {
    members = members.filter((inheritMember) =>
      m.every((m) => m.name.toString() !== inheritMember.name.toString())
    );
    return m.concat(members);
  }, members);
}

export function getMemberListFromTypeExpression(
  type: TypeExpression,
  context: GeneratorContext
): string[] {
  if (
    type instanceof LiteralTypeNode &&
    type.expression instanceof StringLiteral
  ) {
    return [type.expression.expression];
  }

  if (type instanceof UnionTypeNode) {
    return type.types.reduce(
      (types: string[], t) =>
        types.concat(getMemberListFromTypeExpression(t, context)),
      []
    );
  }

  if (type instanceof TypeOperatorNode) {
    const component = findComponentInput(
      type.type as TypeReferenceNode,
      context
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
      this.types[0].expression instanceof Call &&
      this.types[0].expression.typeArguments?.[1]
    ) {
      return getMemberListFromTypeExpression(
        this.types[0].expression.typeArguments[1],
        this.context
      );
    }
    return [];
  }

  constructor(
    token: string,
    types: ExpressionWithTypeArguments[],
    public context: GeneratorContext
  ) {
    this.token = token;
    this.types = types;

    this.members = types.reduce((properties: Property[], typeExpression) => {
      const typeString = typeExpression.type.toString().replace("typeof ", "");
      if (
        context.components &&
        context.components[typeString] &&
        context.components[typeString]
      ) {
        properties = properties.concat(
          context.components[typeString].heritageProperties
        );
      }
      return properties;
    }, []);
  }

  toString() {
    return `${this.token} ${this.types.map((t) => t.toString())}`;
  }
}

export class Class {
  decorators: Decorator[];
  _name: Identifier;
  members: Array<Property | Method>;
  modifiers: string[];
  heritageClauses: HeritageClause[];
  context: GeneratorContext;

  get name() {
    return this._name.toString();
  }

  processMembers(members: Array<Property | Method>) {
    return members;
  }

  constructor(
    decorators: Decorator[],
    modifiers: string[] = [],
    name: Identifier,
    typeParameters: any[],
    heritageClauses: HeritageClause[] = [],
    members: Array<Property | Method>,
    context: GeneratorContext
  ) {
    this._name = name;
    this.decorators = decorators;
    this.modifiers = modifiers;
    this.heritageClauses = heritageClauses;
    this.members = this.processMembers(members);
    this.context = context;
  }

  toString() {
    return `${this.decorators.join("\n")}
        ${this.modifiers.join(" ")} 
        class ${this.name} ${
      this.heritageClauses.length ? `${this.heritageClauses.join(" ")}` : ""
    } {
            ${this.members.join("\n")}
        }`;
  }

  collectMissedImports() {
    const missedImports: { [path: string]: string[] } = {};

    const types = this.members
      .filter(
        (m) =>
          !m.inherited &&
          !(
            m.isRef ||
            m.isRefProp ||
            m.isForwardRef ||
            m.isForwardRefProp ||
            m.isSlot
          )
      )
      .map((m) => m.type)
      .filter(
        (t) =>
          t instanceof TypeReferenceNode && t.typeName.toString() !== "Array"
      ) as TypeReferenceNode[];
    types.forEach((type) => {
      if (
        type.context.path &&
        !this.context.components?.[type.typeName.toString()]
      ) {
        let relativePath = getModuleRelativePath(
          this.context.dirname!,
          type.context.path!
        );
        const typeExists = this.context.imports?.[relativePath]?.has(
          type.toString()
        );
        if (!typeExists) {
          if (!this.context.imports?.[relativePath]) {
            this.context.imports = this.context.imports || {};
            this.context.imports[relativePath] = new ImportClause();
          }
          this.context.imports[relativePath].add(type.typeName.toString());

          relativePath = relativePath.slice(0, relativePath.lastIndexOf("."));
          missedImports[relativePath] = missedImports[relativePath] || [];
          missedImports[relativePath].push(type.typeName.toString());
        }
      }
    });

    return missedImports;
  }
}

export interface Heritable {
  name: string;
  heritageProperties: Property[];
  compileDefaultProps(): string;
  defaultPropsDest(): string;
  members: Array<Property | Method>;
}
