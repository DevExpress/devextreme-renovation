import {
  Expression,
  ExpressionWithOptionalExpression,
  ExpressionWithExpression,
} from "./base";
import { Identifier, Call } from "./common";
import { Parameter } from "./functions";
import { toStringOptions, GeneratorContext } from "../types";
import { compileType, compileTypeParameters } from "../utils/string";
import { Decorator } from "./decorator";
import { ObjectLiteral } from "./literal";
import { TypeParameterDeclaration } from "./type-parameter-declaration";

export class TypeExpression extends Expression {}

export class SimpleTypeExpression extends TypeExpression {
  type: string;

  constructor(type: string) {
    super();
    this.type = type;
  }

  toString() {
    return this.type;
  }
}

export class ArrayTypeNode extends TypeExpression {
  elementType: TypeExpression;

  constructor(elementType: TypeExpression) {
    super();
    this.elementType = elementType;
  }

  toString() {
    return `${this.elementType}[]`;
  }
}

export class FunctionTypeNode extends TypeExpression {
  typeParameters: any;
  parameters: Parameter[];
  type: TypeExpression;
  constructor(
    typeParameters: any,
    parameters: Parameter[],
    type: TypeExpression
  ) {
    super();
    this.typeParameters = typeParameters;
    this.parameters = parameters;
    this.type = type;
  }

  toString() {
    return `(${this.parameters})=>${this.type}`;
  }
}

export class IntersectionTypeNode extends TypeExpression {
  types: TypeExpression[];
  constructor(types: TypeExpression[]) {
    super();
    this.types = types;
  }

  toString() {
    return this.types.join("&");
  }
}

export class UnionTypeNode extends IntersectionTypeNode {
  toString() {
    return this.types.join("|");
  }
}

export class TypeQueryNode extends TypeExpression {
  expression: Expression;

  constructor(expression: Expression) {
    super();
    this.expression = expression;
  }

  toString() {
    return `typeof ${this.expression}`;
  }
}

export class TypeReferenceNode extends TypeExpression {
  typeName: Identifier;
  typeArguments: TypeExpression[];
  context: GeneratorContext;
  constructor(
    typeName: Identifier,
    typeArguments: TypeExpression[] = [],
    context: GeneratorContext
  ) {
    super();
    this.typeName = typeName;
    this.typeArguments = typeArguments;
    this.context = context;
  }
  toString() {
    const typeArguments = this.typeArguments.length
      ? `<${this.typeArguments.join(",")}>`
      : "";
    return `${this.typeName}${typeArguments}`;
  }

  get type(): Expression {
    return this.typeName;
  }
}

export class TypeLiteralNode extends TypeExpression {
  members: PropertySignature[];
  constructor(members: PropertySignature[]) {
    super();
    this.members = members;
  }

  toString(options?: toStringOptions) {
    return `{${this.members.join(",")}}`;
  }
}

export class PropertySignature extends ExpressionWithOptionalExpression {
  modifiers: string[];
  name: Identifier;
  questionToken: string;
  type?: TypeExpression;

  constructor(
    modifiers: string[] = [],
    name: Identifier,
    questionToken: string = "",
    type?: TypeExpression,
    initializer?: Expression
  ) {
    super(initializer);
    this.modifiers = modifiers;
    this.name = name;
    this.questionToken = questionToken;
    this.type = type;
  }

  toString(options?: toStringOptions) {
    const initializer = this.expression
      ? `=${this.expression.toString(options)}`
      : "";
    return `${this.name}${this.questionToken}${compileType(
      this.type?.toString()
    )}${initializer}`;
  }
}

export class IndexSignature extends Expression {
  decorators?: Decorator[];
  modifiers: string[];
  parameters: Parameter[];
  type: TypeExpression;
  constructor(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    parameters: Parameter[],
    type: TypeExpression
  ) {
    super();
    this.decorators = decorators;
    this.modifiers = modifiers;
    this.parameters = parameters;
    this.type = type;
  }

  toString(options?: toStringOptions) {
    return `${this.parameters.map((p) => `[${p.typeDeclaration()}]`)}:${
      this.type
    }`;
  }
}

export class ExpressionWithTypeArguments extends ExpressionWithExpression {
  typeArguments: TypeReferenceNode[];
  constructor(typeArguments: TypeReferenceNode[] = [], expression: Expression) {
    super(expression);
    this.typeArguments = typeArguments;
  }

  toString() {
    const typeArgumentString = this.typeArguments.length
      ? `<${this.typeArguments.join(",")}>`
      : "";
    return `${this.expression}${typeArgumentString}`;
  }

  get isJsxComponent() {
    return this.expression.toString().startsWith("JSXComponent");
  }

  get typeNode() {
    return this.expression;
  }

  get type(): Expression {
    if (this.typeArguments.length) {
      const typeArgument = this.typeArguments[0];
      return typeArgument.type;
    }
    if (this.expression instanceof Call) {
      if (this.expression.arguments[0]) {
        return this.expression.arguments[0];
      }
      const typeArgument = this.expression.typeArguments?.[0];
      if (typeArgument instanceof TypeReferenceNode) {
        return typeArgument.type;
      }
    }
    return this.typeNode;
  }
}

export class ParenthesizedType extends TypeExpression {
  expression: TypeExpression;
  constructor(expression: TypeExpression) {
    super();
    this.expression = expression;
  }

  toString() {
    return `(${this.expression})`;
  }
}

export class LiteralTypeNode extends TypeExpression {
  expression: Expression;

  constructor(expression: Expression) {
    super();
    this.expression = expression;
  }

  toString() {
    return this.expression.toString();
  }
}

export class IndexedAccessTypeNode extends TypeExpression {
  objectType: TypeExpression;
  indexType: TypeExpression;
  constructor(objectType: TypeExpression, indexType: TypeExpression) {
    super();
    this.objectType = objectType;
    this.indexType = indexType;
  }

  toString() {
    return `${this.objectType}[${this.indexType}]`;
  }
}

export class QualifiedName extends TypeExpression {
  left: Expression;
  right: Identifier;

  constructor(left: Expression, right: Identifier) {
    super();
    this.left = left;
    this.right = right;
  }

  toString() {
    return `${this.left}.${this.right}`;
  }
}

export class MethodSignature extends TypeExpression {
  typeParameters: any;
  parameters: Parameter[];
  type: TypeExpression;
  name: Identifier;
  questionToken?: string;
  constructor(
    typeParameters: any,
    parameters: Parameter[] = [],
    type: TypeExpression = new SimpleTypeExpression("any"),
    name: Identifier,
    questionToken?: string
  ) {
    super();
    this.typeParameters = typeParameters;
    this.parameters = parameters;
    this.type = type;
    this.name = name;
    this.questionToken = questionToken;
  }

  toString() {
    return `${this.name}(${this.parameters})${compileType(
      this.type.toString(),
      this.questionToken
    )}`;
  }
}

export class TypeOperatorNode extends TypeExpression {
  type: TypeExpression;
  constructor(type: TypeExpression) {
    super();
    this.type = type;
  }

  toString() {
    return `keyof ${this.type}`;
  }
}

export class TypeAliasDeclaration extends TypeExpression {
  constructor(
    public decorators: Decorator[] = [],
    public modifiers: string[] = [],
    public name: Identifier,
    public typeParameters: TypeParameterDeclaration[] | undefined,
    public type: TypeExpression
  ) {
    super();
  }

  toString() {
    return `${this.modifiers.join(" ")} type ${
      this.name
    }${compileTypeParameters(this.typeParameters)} = ${this.type}`;
  }
}

export function isComplexType(type: TypeExpression | string): boolean {
  if (type instanceof UnionTypeNode) {
    return type.types.some((t) => isComplexType(t));
  }

  if (
    type instanceof FunctionTypeNode ||
    type instanceof ArrayTypeNode ||
    type instanceof TypeReferenceNode ||
    type instanceof ObjectLiteral ||
    (type instanceof LiteralTypeNode &&
      type.expression instanceof ObjectLiteral)
  ) {
    return true;
  }
  return false;
}

export const isTypeArray = (type: string | TypeExpression | undefined) =>
  type instanceof ArrayTypeNode ||
  (type instanceof TypeReferenceNode && type.typeName.toString() === "Array") ||
  (typeof type === "string" &&
    (type.indexOf("Array") === 0 ||
      type.lastIndexOf("[]") === type.length - 2));

export const extractComplexType = (type?: string | TypeExpression): string => {
  if (type instanceof TypeReferenceNode) {
    if (type.typeName.toString() === "Array") {
      return extractComplexType(type.typeArguments[0]);
    }
    return `${type.typeName.toString()}`;
  }
  if (type instanceof ArrayTypeNode) {
    return extractComplexType(type.elementType);
  }
  if (type instanceof ParenthesizedType) {
    return extractComplexType(type.expression);
  }
  if (type instanceof UnionTypeNode) {
    const nestedType = type.types.find((t) => t instanceof TypeReferenceNode);
    if (nestedType) {
      return extractComplexType(nestedType);
    }
  }

  return "any";
};

export class TypePredicateNode extends TypeExpression {
  constructor(
    public assertsModifier: string | undefined,
    public parameterName: Identifier,
    public type: TypeExpression
  ) {
    super();
  }

  toString() {
    return `${this.parameterName} is ${this.type}`;
  }
}

export class InferTypeNode extends TypeExpression {
  constructor(public typeParameter: TypeExpression) {
    super();
  }

  toString() {
    return `infer ${this.typeParameter}`;
  }
}

export class TupleTypeNode extends TypeExpression {
  constructor(public elementTypes: TypeExpression[]) {
    super();
  }

  toString() {
    return `[${this.elementTypes.join(", ")}]`;
  }
}

export class ConditionalTypeNode extends TypeExpression {
  constructor(
    public checkType: TypeExpression,
    public extendsType: TypeExpression,
    public trueType: TypeExpression,
    public falseType: TypeExpression
  ) {
    super();
  }

  toString() {
    return `${this.checkType} extends ${this.extendsType} ? ${this.trueType} : ${this.falseType}`;
  }
}
