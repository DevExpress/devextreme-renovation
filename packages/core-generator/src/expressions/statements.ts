import { Expression, ExpressionWithOptionalExpression } from './base';
import { toStringOptions } from '../types';
import { Dependency } from '..';
import { VariableStatement } from './variables';

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

  destructuredDepsString(options: toStringOptions): string[] {
    const destructuredDepsString = this.statements.reduce((arr: string[], s) => (
      s instanceof VariableStatement
        ? [...arr, ...s.destructuredDepsString(options)]
        : arr), []);
    const usualMembers = destructuredDepsString?.filter((depString) => !depString.includes('.'));
    const propertyAccess = destructuredDepsString?.filter((depString) => {
      let notDefined = true;
      usualMembers?.forEach((m) => {
        if (depString.includes(m)) {
          notDefined = false;
        }
      });
      return notDefined;
    });
    return propertyAccess;
  }
}

export class ReturnStatement extends ExpressionWithOptionalExpression {
  toString(options?: toStringOptions) {
    return `return ${super.toString(options)};`;
  }
}
