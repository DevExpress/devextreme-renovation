import path from 'path';
import {
  Expression,
  ExpressionWithOptionalExpression,
  ExpressionWithExpression,
} from './base';
import { Identifier, Call } from './common';
import { Parameter } from './functions';
import {
  toStringOptions,
  GeneratorContext,
  TypeExpressionImports,
} from '../types';
import { compileType, compileTypeParameters } from '../utils/string';
import { Decorator } from './decorator';
import { ObjectLiteral, StringLiteral } from './literal';
import { TypeParameterDeclaration } from './type-parameter-declaration';
import { getModuleRelativePath } from '../utils/path-utils';
import {
  ImportClause,
  ImportDeclaration,
  ImportSpecifier,
  NamedImports,
} from './import';

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

  getImports(context: GeneratorContext) {
    return this.elementType.getImports(context);
  }
}

export class FunctionTypeNode extends TypeExpression {
  constructor(
    public typeParameters: any,
    public parameters: Parameter[],
    public type: TypeExpression | string,
  ) {
    super();
  }

  toString() {
    return `(${this.parameters})=>${this.type}`;
  }

  getImports(context: GeneratorContext) {
    return reduceTypeExpressionImports(
      [this.type, ...this.parameters.map((p) => p.type)],
      context,
    );
  }
}

export class OptionalTypeNode extends TypeExpression {
  constructor(public type: TypeExpression) {
    super();
  }

  toString() {
    return `${this.type}?`;
  }

  getImports(context: GeneratorContext) {
    return this.type.getImports(context);
  }
}

export class IntersectionTypeNode extends TypeExpression {
  types: TypeExpression[];

  constructor(types: TypeExpression[]) {
    super();
    this.types = types;
  }

  toString() {
    return this.types.join('&');
  }

  getImports(context: GeneratorContext) {
    return reduceTypeExpressionImports(this.types, context);
  }
}

export class UnionTypeNode extends IntersectionTypeNode {
  toString() {
    return this.types.join('|');
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
  constructor(
    public typeName: Identifier,
    public typeArguments: TypeExpression[] = [],
    public context: GeneratorContext,
  ) {
    super();
    if (typeName.toString() === 'CSSAttributes') {
      this.typeName = new Identifier('any');
    }
  }

  get REF_OBJECT_TYPE() {
    return '';
  }

  toString() {
    if (this.typeName.toString() === 'RefObject') {
      const typeArguments = this.typeArguments.length === 0 ? ['any'] : this.typeArguments;
      if (!this.REF_OBJECT_TYPE) {
        return typeArguments.join('');
      }
      return `${this.REF_OBJECT_TYPE}${compileTypeParameters(typeArguments)}`;
    }
    const typeArguments = this.typeArguments.length
      ? `<${this.typeArguments.join(',')}>`
      : '';
    return `${this.typeName}${typeArguments}`;
  }

  get type(): Expression {
    return this.typeName;
  }

  getImports(context: GeneratorContext) {
    const result: TypeExpressionImports = [];
    if (this.context.path !== context.path) {
      const typeNameString = this.typeName.toString();
      if (
        this.context.types?.[typeNameString]
        || this.context.interfaces?.[typeNameString]
      ) {
        const moduleSpecifier = getModuleRelativePath(
          context.dirname!,
          this.context.path!,
          true,
        );
        result.push(
          new ImportDeclaration(
            [],
            [],
            new ImportClause(
              undefined,
              new NamedImports([new ImportSpecifier(undefined, this.typeName)]),
            ),
            new StringLiteral(moduleSpecifier),
            this.context,
          ),
        );
      }

      const importClause = Object.values(
        this.context.imports || {},
      ).find((importClause) => importClause.has(typeNameString));

      if (importClause) {
        const importClauseRelativePath = Object.keys(
          this.context.imports!,
        ).find((key) => this.context.imports![key] === importClause)!;
        const moduleSpecifier = getModuleRelativePath(
          context.dirname!,
          path.resolve(this.context.dirname!, importClauseRelativePath),
          false,
        );
        if (!context.imports?.[moduleSpecifier]?.has(typeNameString)) {
          result.push(
            new ImportDeclaration(
              [],
              [],
              new ImportClause(
                undefined,
                new NamedImports([
                  new ImportSpecifier(undefined, this.typeName),
                ]),
              ),
              new StringLiteral(
                moduleSpecifier.replace(path.extname(moduleSpecifier), ''),
              ),
              this.context,
            ),
          );
        }
      }
    }

    return mergeTypeExpressionImports(
      result,
      reduceTypeExpressionImports(this.typeArguments, context),
    );
  }
}

export class TypeLiteralNode extends TypeExpression {
  members: PropertySignature[];

  constructor(members: PropertySignature[]) {
    super();
    this.members = members;
  }

  toString(_options?: toStringOptions) {
    return `{${this.members.join(',')}}`;
  }

  getImports(context: GeneratorContext) {
    return this.members.reduce((acc, m) => {
      const imports = m.type?.getImports(context);
      if (imports) {
        return acc.concat(imports);
      }
      return acc;
    }, [] as TypeExpressionImports);
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
    questionToken = '',
    type?: TypeExpression,
    initializer?: Expression,
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
      : '';
    return `${this.name}${this.questionToken}${compileType(
      this.type?.toString(),
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
    type: TypeExpression,
  ) {
    super();
    this.decorators = decorators;
    this.modifiers = modifiers;
    this.parameters = parameters;
    this.type = type;
  }

  toString(_options?: toStringOptions) {
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
      ? `<${this.typeArguments.join(',')}>`
      : '';
    return `${this.expression}${typeArgumentString}`;
  }

  get isJsxComponent() {
    return this.expression.toString().startsWith('JSXComponent');
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

  getImports(context: GeneratorContext) {
    return this.expression.getImports(context);
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
    type: TypeExpression = new SimpleTypeExpression('any'),
    name: Identifier,
    questionToken?: string,
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
      this.questionToken,
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
    public type: TypeExpression,
  ) {
    super();
  }

  toString() {
    return `${this.modifiers.join(' ')} type ${
      this.name
    }${compileTypeParameters(this.typeParameters)} = ${this.type}`;
  }
}

export function isComplexType(type: TypeExpression | string): boolean {
  if (type instanceof UnionTypeNode) {
    return type.types.some((t) => isComplexType(t));
  }

  if (
    type instanceof FunctionTypeNode
    || type instanceof ArrayTypeNode
    || (type instanceof TypeReferenceNode)
    || type instanceof ObjectLiteral
    || (type instanceof TypeLiteralNode
      && !type.members.map((member) => isComplexType(member?.type || '')).includes(false))
    || (type instanceof LiteralTypeNode && isComplexType(type.expression))
    || type.toString() === 'object'
  ) {
    return true;
  }
  return false;
}

export const isTypeArray = (type: string | TypeExpression | undefined) => type instanceof ArrayTypeNode
  || (type instanceof TypeReferenceNode && type.typeName.toString() === 'Array')
  || (typeof type === 'string'
    && (type.indexOf('Array') === 0
      || type.lastIndexOf('[]') === type.length - 2));

export const extractElementType = (
  type: string | TypeExpression | undefined,
): TypeExpression | void => {
  if (type instanceof TypeReferenceNode) {
    if (type.typeName.toString() === 'Array') {
      return type.typeArguments[0];
    }
  }

  if (type instanceof ArrayTypeNode) {
    return type.elementType;
  }

  return undefined;
};

export const extractComplexType = (type?: string | TypeExpression): string => {
  if (type instanceof TypeReferenceNode) {
    if (type.typeName.toString() === 'Array') {
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

  return 'any';
};

export class TypePredicateNode extends TypeExpression {
  constructor(
    public assertsModifier: string | undefined,
    public parameterName: Identifier,
    public type: TypeExpression,
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
    return `[${this.elementTypes.join(', ')}]`;
  }
}

export class ConditionalTypeNode extends TypeExpression {
  constructor(
    public checkType: TypeExpression,
    public extendsType: TypeExpression,
    public trueType: TypeExpression,
    public falseType: TypeExpression,
  ) {
    super();
  }

  toString() {
    return `${this.checkType} extends ${this.extendsType} ? ${this.trueType} : ${this.falseType}`;
  }
}

function convertTypeExpressionImportsToDictionary(
  imports: TypeExpressionImports,
) {
  return imports.reduce(
    (modules: { [name: string]: ImportDeclaration }, typeImports) => {
      const moduleSpecifier = typeImports.moduleSpecifier.toString();
      const cachedImportDeclaration = modules[moduleSpecifier];
      if (cachedImportDeclaration) {
        typeImports.importClause.imports?.forEach((name) => {
          cachedImportDeclaration.add(name);
        });
      } else {
        modules[moduleSpecifier] = typeImports;
      }
      return modules;
    },
    {},
  );
}

export function mergeTypeExpressionImports(
  ...imports: TypeExpressionImports[]
) {
  const allImports = imports.reduce((result, typeImports) => result.concat(typeImports), []);
  const dictionary = convertTypeExpressionImportsToDictionary(allImports);

  return Object.keys(dictionary).map((key) => dictionary[key]);
}

export function reduceTypeExpressionImports(
  expressions: (Expression | string | undefined)[],
  context: GeneratorContext,
) {
  return expressions.reduce((imports: TypeExpressionImports, e) => {
    if (e instanceof Expression) {
      return imports.concat(e.getImports(context));
    }
    return imports;
  }, []);
}
