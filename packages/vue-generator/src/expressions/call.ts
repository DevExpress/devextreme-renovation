import {
  PropertyAccessChain,
  Call as BaseCall,
} from '@devextreme-generator/angular';
import {
  Identifier,
  ObjectLiteral,
  PropertyAssignment,
  SimpleExpression,
  SyntaxKind,
  StringLiteral
} from '@devextreme-generator/core';

import { toStringOptions } from '../types';

export class Call extends BaseCall {
  compileTypeArguments(): string {
    return '';
  }

  getHasOwnArgument(argument:StringLiteral) {
    return argument;
  }

  compileHasOwnProperty(_options?: toStringOptions):string {
    const argument = this.arguments?.[0];
    if (argument instanceof StringLiteral) {
      const value = argument.valueOf();
      return `this.props.${value} !== undefined || this.$options.propsData.hasOwnProperty(${argument})`;
    }
    return '';
  }
}
export class New extends Call {
  toString(options?: toStringOptions): string {
    const componentInputs = options?.componentInputs || [];
    if (componentInputs.length) {
      const matchedInput = componentInputs.find(
        (c) => c.name === this.expression.toString()
      );
      if (matchedInput?.isNested) {
        const defaultValue = new PropertyAccessChain(
          this.expression,
          SyntaxKind.QuestionDotToken,
          new Identifier('__defaultNestedValues.default()')
        );
        return defaultValue.toString();
      }
      if (matchedInput?.fields?.length && matchedInput?.fields?.length > 0) {
        const objectFields = matchedInput.fields.map(
          (prop) => new PropertyAssignment(
            prop,
            new PropertyAccessChain(
              this.expression,
              SyntaxKind.QuestionDotToken,
              new PropertyAccessChain(
                prop,
                SyntaxKind.QuestionDotToken,
                new SimpleExpression('default()')
              )
            )
          )
        );
        return new ObjectLiteral(objectFields, true).toString(options);
      }
      if (matchedInput) {
        return this.expression.toString();
      }
    }
    return `${SyntaxKind.NewKeyword} ${super.toString(options)}`;
  }
}
