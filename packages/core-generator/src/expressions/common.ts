import { toStringOptions } from '../types';
import { SyntaxKind } from '../syntaxKind';
import { ExpressionWithExpression, Expression, SimpleExpression } from './base';
import { TypeExpression } from './type';
import { compileTypeParameters } from '../utils/string';
import { StringLiteral } from './literal';

function getIdentifierExpressionFromVariable(
  expression: Expression,
  options?: toStringOptions,
) {
  const stringValue = expression.toString();
  if (options?.variables && options.variables[stringValue]) {
    return options.variables[stringValue];
  }
  return undefined;
}

export class Identifier extends SimpleExpression {
  valueOf() {
    return this.expression;
  }

  toString(options?: toStringOptions) {
    const baseValue = super.toString();
    if (options?.variables && options.variables[baseValue]) {
      let expression = options.variables[baseValue];
      if (expression instanceof Paren) {
        expression = expression.expression;
      }
      if (options.variables[baseValue].toString() === baseValue) {
        return baseValue;
      }
      return options.variables[baseValue].toString(options);
    }
    return baseValue;
  }

  getDependency(options: toStringOptions) {
    const expression = getIdentifierExpressionFromVariable(this, options);
    if (expression) {
      return expression.getDependency(options);
    }
    return [];
  }
}

export class TypeOf extends ExpressionWithExpression {
  toString(options?: toStringOptions) {
    return `${SyntaxKind.TypeOfKeyword} ${this.expression.toString(options)}`;
  }
}

export class Void extends ExpressionWithExpression {
  toString(options?: toStringOptions) {
    return `${SyntaxKind.VoidKeyword} ${this.expression.toString(options)}`;
  }
}

export class Delete extends ExpressionWithExpression {
  toString(_options?: toStringOptions) {
    return `${SyntaxKind.DeleteKeyword} ${super.toString()}`;
  }
}

export class Paren extends ExpressionWithExpression {
  toString(options?: toStringOptions) {
    return `(${super.toString(options)})`;
  }
}

export class Call extends ExpressionWithExpression {
  constructor(
    expression: Expression,
    public typeArguments?: TypeExpression[],
    public argumentsArray: Expression[] = [],
  ) {
    super(expression);
  }

  compileTypeArguments() {
    return compileTypeParameters(this.typeArguments);
  }

  get arguments() {
    return this.argumentsArray.map((a) => a);
  }

  toString(options?: toStringOptions) {
    if (this.expression.toString() === 'this.props.hasOwnProperty') {
      const argument = this.arguments?.[0];
      if (argument instanceof StringLiteral) {
        const value = argument.valueOf();
        return this.compileHasOwnProperty(value, options);
      }
    }
    return this.compileDefaultToString(options);
  }

  getDependency(options: toStringOptions) {
    const argumentsDependency = this.argumentsArray.reduce((d: string[], a) => d.concat(a.getDependency(options)), []);
    return super.getDependency(options).concat(argumentsDependency);
  }

  compileHasOwnProperty(_value: string, options?: toStringOptions) {
    return this.compileDefaultToString(options);
  }

  compileDefaultToString(options?: toStringOptions) {
    return `${this.expression.toString(
      options,
    )}${this.compileTypeArguments()}(${this.argumentsArray
      .map((a) => a.toString(options))
      .join(',')})`;
  }
}

export class New extends Call {
  toString(options?: toStringOptions) {
    return `${SyntaxKind.NewKeyword} ${super.toString(options)}`;
  }
}

export class CallChain extends Call {
  questionDotToken: string;

  constructor(
    expression: Expression,
    questionDotToken = '',
    typeArguments: any,
    argumentsArray: Expression[] = [],
  ) {
    super(expression, typeArguments, argumentsArray);
    this.questionDotToken = questionDotToken;
  }

  toString(options?: toStringOptions) {
    return `${this.expression.toString(options)}${
      this.questionDotToken
      }(${this.argumentsArray.map((a) => a.toString(options)).join(',')})`;
  }
}

export class NonNullExpression extends ExpressionWithExpression {
  toString(options?: toStringOptions) {
    return `${super.toString(options).replace(/[?!]$/, '')}!`;
  }
}

export class AsExpression extends ExpressionWithExpression {
  type: TypeExpression;

  constructor(expression: Expression, type: TypeExpression) {
    super(expression);
    this.type = type;
  }

  toString(options?: toStringOptions) {
    return `${super.toString(options)} ${SyntaxKind.AsKeyword} ${this.type}`;
  }
}
