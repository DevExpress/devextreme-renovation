import { PropertyAccessChain as BasePropertyAccessChain } from '@devextreme-generator/angular';
import { getMember, SyntaxKind } from '@devextreme-generator/core';
import { Property } from './class-members/property';
import { toStringOptions } from '../types';

export class PropertyAccessChain extends BasePropertyAccessChain {
  getRefAccessor(member: Property) {
    if (member.isRef || member.isForwardRef || member.isApiRef) {
      return '';
    }
    if (member.isRefProp || member.isForwardRefProp) {
      return `${this.questionDotToken}()`;
    }
    return null;
  }

  toString(options?: toStringOptions): string {
    if (options && options.newComponentContext !== SyntaxKind.ThisKeyword) {
      let chainMember;
      if (this.expression instanceof PropertyAccessChain) {
        chainMember = this.expression.getMember(options);
      }
      const member = getMember(this.expression, options)
      || chainMember;
      const expression = this.expression.toString(options);
      if (
        member?.isRef
        || member?.isRefProp
        || member?.isForwardRef
        || member?.isForwardRefProp
      ) {
        if (this.name.toString() === 'current' && (member?.isRef || member?.isForwardRef)) {
          return `this.$refs.${member?.name}`;
        }
        return `(${expression} && ${expression}()?${expression}():undefined)`;
      }
    }
    return super.toString(options);
  }
}
