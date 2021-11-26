import { GeneratorContext } from '../types';
import { Expression } from './base';
import { Call, Identifier } from './common';
import { ObjectLiteral } from './literal';
import { ArrowFunction, Function } from './functions';

export class Decorator {
  expression: Call;

  context: GeneratorContext;

  viewParameter?: Expression | null;

  readonly isSvg: boolean;

  constructor(expression: Call, context: GeneratorContext) {
    this.expression = expression;
    this.context = context;
    this.isSvg = this.getParameter('isSVG')?.valueOf().toString() === 'true';
    if (this.name === 'Component') {
      this.viewParameter = this.getParameter('view');
    }
  }

  addParameter(name: string, value: Expression) {
    const parameters = this.expression.arguments[0] as ObjectLiteral;
    parameters.setProperty(name, value);
  }

  getParameter(name: string) {
    const parameters = this.expression.arguments[0] as ObjectLiteral;
    return parameters?.getProperty(name);
  }

  getViewFunction() {
    const viewFunctionValue = this.viewParameter;
    let viewFunction: ArrowFunction | Function | null = null;
    if (viewFunctionValue instanceof Identifier) {
      viewFunction = this.context.viewFunctions
        ? this.context.viewFunctions[viewFunctionValue.toString()]
        : null;
    }

    return viewFunction;
  }

  get name() {
    return this.expression.expression.toString();
  }

  toString() {
    return `@${this.expression.toString()}`;
  }
}
