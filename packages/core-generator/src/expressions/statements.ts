import { Expression, ExpressionWithOptionalExpression } from './base';
import { toStringOptions } from '../types';
import { Dependency } from '..';

export class Block extends Expression {
  statements: Expression[];

  multiLine: boolean;

  constructor(statements: Expression[], multiLine: boolean) {
    super();
    this.statements = statements;
    this.multiLine = multiLine;
  }

  toString(options?: toStringOptions) {
    return `{
      ${this.statements.map((s) => s.toString(options)).join(';\n')}
    }`;
  }

  getDependency(options: toStringOptions): Dependency[] {
    return this.statements.reduce((d: Dependency[], s) => d.concat(s.getDependency(options)), []);
  }

  isJsx() {
    return this.statements.some((s) => s.isJsx());
  }
}

export class ReturnStatement extends ExpressionWithOptionalExpression {
  toString(options?: toStringOptions) {
    return `return ${super.toString(options)};`;
  }
}
