import {
  JsxAttribute as BaseJsxAttribute,
  PropertyAssignment,
  StringLiteral,
  getMember,
  Identifier,
  dasherize,
  kebabSvgAttributes,
  Expression,
  SimpleExpression,
  Method,
  GetAccessor,
  isCall,
  isFunction,
} from '@devextreme-generator/core';
import { toStringOptions } from '../../types';
import { JsxExpression } from './jsx-expression';

function isAriaAttribute(name: string): boolean {
  return name.startsWith('aria-');
}

export class JsxAttribute extends BaseJsxAttribute {
  constructor(name: Identifier, initializer?: Expression) {
    super(
      name,
      initializer || new JsxExpression(undefined, new SimpleExpression('true')),
    );
  }

  getRefValue(options?: toStringOptions) {
    return this.compileRef(options).replace('#', '');
  }

  getForwardRefValue(options?: toStringOptions): string {
    const member = getMember(this.initializer, options);
    return `forwardRef_${member?.name}`;
  }

  compileInitializer(options?: toStringOptions): string {
    if (this.isRefAttribute(options)) {
      return this.getRefValue(options);
    }
    const member = getMember(this.initializer, options);
    if (member && (member.isForwardRef || member.isForwardRefProp)) {
      return this.getForwardRefValue(options);
    }

    return this.initializer
      .toString({
        members: [],
        disableTemplates: true,
        ...options,
      })
      .replace(/"/gi, "'");
  }

  compileRef(options?: toStringOptions) {
    const member = getMember(this.initializer, options);
    if (member) {
      if (member.isRef) {
        return `#${member.name}Link`;
      }
      return `#${member.name}${member.isForwardRefProp ? '__Ref__' : ''}`;
    }

    return `#${this.initializer.toString(options)}`;
  }

  compileEvent(options: toStringOptions) {
    const member = getMember(this.initializer, options);
    const hasEmptyParameters = member instanceof Method
      && !(member instanceof GetAccessor)
      && member.parameters.length === 0;
    const args = hasEmptyParameters ? '' : '$event';

    return `(${this.name})="${this.compileInitializer(options)}(${args})"`;
  }

  compileName(options?: toStringOptions) {
    const name = this.name.toString();
    if (!options?.jsxComponent) {
      if (name === 'className') {
        return options?.isSVG ? 'attr.class' : 'class';
      }
      if (name === 'style') {
        if (options) {
          options.hasStyle = true;
        }
        return 'ngStyle';
      }

      if (isAriaAttribute(name)) {
        return `attr.${name}`;
      }

      if (options?.isSVG) {
        return `attr.${kebabSvgAttributes.has(name) ? dasherize(name) : name}`;
      }
    }

    return name;
  }

  compileKey(options?: toStringOptions): string | null {
    if (options) {
      options.keys = options.keys || [];
      options.keys.push(this.initializer);
    }
    return '';
  }

  compileValue(name: string, value: string) {
    if (name === 'title') {
      return `${value}!==undefined?${value}:''`;
    }

    if (name === 'ngStyle') {
      return `__processNgStyle(${value})`;
    }

    return value;
  }

  compileBase(name: string, value: string) {
    return name.startsWith('data-') ? `${name.toLocaleLowerCase()}="${value}"` : `[${name}]="${value}"`;
  }

  isStringLiteralValue() {
    return (
      this.initializer instanceof StringLiteral
      || (this.initializer instanceof JsxExpression
        && this.initializer.expression instanceof StringLiteral)
    );
  }

  isSlotAttribute(options?: toStringOptions) {
    const slotProps = options?.jsxComponent?.members.filter((p) => p.isSlot);
    return slotProps?.some((p) => p.name === this.name.toString());
  }

  isRefAttribute(options?: toStringOptions) {
    return options?.jsxComponent?.members
      .filter((p) => p.isRefProp)
      ?.some((p) => p.name === this.name.toString());
  }

  isTemplateAttribute(options?: toStringOptions) {
    const templateProps = options?.jsxComponent?.members.filter(
      (p) => p.isTemplate,
    );
    return templateProps?.some((p) => p.name === this.name.toString()) || false;
  }

  skipValue(_options?: toStringOptions) {
    return false;
  }

  toString(options?: toStringOptions) {
    if (this.skipValue(options)) {
      return '';
    }

    if (this.name.toString() === 'ref') {
      const member = getMember(this.initializer, options);
      if (member?.isForwardRef || member?.isForwardRefProp) {
        options!.forwardRefs = options!.forwardRefs || [];
        options!.forwardRefs.push(member);
      }
      return this.compileRef(options);
    }

    if (
      options?.jsxComponent?.members
        .filter((m) => m.isEvent)
        .find((p) => p.name === this.name.toString())
    ) {
      return this.compileEvent(options);
    }

    if (this.isSlotAttribute(options)) {
      return '';
    }

    const name = this.compileName(options);

    if (name === 'key' && this.compileKey() !== null) {
      return this.compileKey(options) as string;
    }

    if (this.isStringLiteralValue()) {
      return `${name.replace('attr.', '')}=${this.initializer.toString()}`;
    }

    if (this.initializer instanceof JsxExpression) {
      const funcName = this.initializer.toString();
      const template = this.initializer.getExpression(options)!;
      if (isFunction(template) || isCall(template)) {
        if (this.isTemplateAttribute(options)) {
          if (funcName) {
            return this.compileBase(name, funcName);
          }
          return this.compileBase(name, `__${name}__generated`);
        }
      }
    }

    return this.compileBase(
      name,
      this.compileValue(name, this.compileInitializer(options)),
    );
  }

  getTemplateContext(options?: toStringOptions): PropertyAssignment[] {
    const member = getMember(this.initializer, options);
    const binding = member instanceof Method && !(member instanceof GetAccessor)
      ? '.bind(this)'
      : '';
    return [
      new PropertyAssignment(
        this.name,
        new SimpleExpression(`${this.compileInitializer(options)}${binding}`),
      ),
    ];
  }
}
