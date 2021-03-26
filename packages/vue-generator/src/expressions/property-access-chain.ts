import { Property } from './class-members/property';
import { toStringOptions } from '../types';
import { PropertyAccessChain as BasePropertyAccessChain } from '@devextreme-generator/angular';
import { getMember, SyntaxKind } from '@devextreme-generator/core';

export class PropertyAccessChain extends BasePropertyAccessChain {
  getRefAccessor(member: Property) {
    if (member.isRef || member.isForwardRef || member.isApiRef) {
      return "";
    }
    if (member.isRefProp || member.isForwardRefProp) {
      return `${this.questionDotToken}()`;
    }
    return null;
  }

  toString(options?: toStringOptions) {
    if (options && options.newComponentContext !== SyntaxKind.ThisKeyword) {
      const expression = this.expression.toString(options);
      const member = getMember(this.expression, options);
      if (
        member?.isRef ||
        member?.isRefProp ||
        member?.isForwardRef ||
        member?.isForwardRefProp
      ) {
        return `(${expression} && ${expression}()?${expression}():undefined)`;
      }
    }
    return super.toString(options);
  }
}
