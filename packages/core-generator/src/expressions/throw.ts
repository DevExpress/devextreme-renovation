import { ExpressionWithExpression } from './base';
import { toStringOptions } from '../types';
import { SyntaxKind } from '../syntaxKind';

export class Throw extends ExpressionWithExpression {
  toString(options?: toStringOptions) {
    return `${SyntaxKind.ThrowKeyword} ${this.expression.toString(options)}`;
  }
}
