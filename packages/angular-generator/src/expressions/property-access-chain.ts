import {
  PropertyAccessChain as BasePropertyAccessChain,
  compileRefOptions,
  toStringOptions,
  SyntaxKind,
  getMember,
  isProperty,
  Identifier,
} from '@devextreme-generator/core';
import { Property } from './class-members/property';
import { PropertyAccess } from './property-access';

export class PropertyAccessChain extends BasePropertyAccessChain {
  getRefAccessor(member: Property) {
    if (member.isRef || member.isForwardRef) {
      return `${this.questionDotToken}nativeElement`;
    }
    if (member.isForwardRefProp) {
      return `?.()${this.questionDotToken}nativeElement`;
    }
    if (member.isRefProp || member.isApiRef) {
      return '';
    }
    return null;
  }

  processName(options?: toStringOptions) {
    if (
      this.name.toString() === 'current'
      && (this.expression instanceof PropertyAccess
        || this.expression instanceof Identifier)
    ) {
      const expressionString = this.expression.expression.toString({
        members: [],
        variables: {
          ...options?.variables,
        },
      });
      const member = getMember(
        this.expression,
        compileRefOptions(expressionString, options),
      ) || getMember(
        this.expression,
        options,
      );

      if (member && isProperty(member)) {
        const accessor = this.getRefAccessor(member);
        if (accessor !== null) {
          return accessor;
        }
      }
    }
    if (this.name.toString() === 'current' && this.expression instanceof PropertyAccessChain) {
      const member = this.expression.getMember(options);
      if (member && isProperty(member)) {
        const accessor = this.getRefAccessor(member);
        if (accessor !== null) {
          return accessor;
        }
      }
    }
    return super.processName(options);
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
      const name = member?.isRef
      || member?.isRefProp
      || member?.isForwardRef
      || member?.isForwardRefProp
        ? ''
        : `.${this.name}`;
      if (name === '' && this.name.toString() === 'current') {
        if (member?.isForwardRefProp) {
          return `${member.name} ? ${member.name}()?.nativeElement : undefined`;
        }
        return `${member?.name}${this.processName(options)}`;
      }

      return `(${expression}===undefined||${expression}===null?undefined:${expression}${name})`;
    }
    return super.toString(options);
  }

  getDependency(options: toStringOptions) {
    return super
      .getDependency(options)
      .concat(this.name.getDependency(options));
  }
}
