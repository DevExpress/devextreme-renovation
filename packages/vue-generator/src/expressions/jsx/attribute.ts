import { JsxExpression } from './jsx-expression';
import { toStringOptions } from '../../types';
import { getEventName } from '../utils';
import { JsxAttribute as BaseJsxAttribute } from '@devextreme-generator/angular';
import {
  dasherize,
  getMember,
  Identifier,
  kebabSvgAttributes,
  Expression,
  SimpleExpression,
} from "@devextreme-generator/core";

export class JsxAttribute extends BaseJsxAttribute {
  constructor(name: Identifier, initializer?: Expression) {
    super(
      name,
      initializer || new JsxExpression(undefined, new SimpleExpression("true"))
    );
  }
  getTemplateProp(options?: toStringOptions) {
    if (this.name.toString() === "key") {
      this.compileKey(options);
      return "";
    }
    return `v-bind:${this.name}="${this.compileInitializer(options)}"`;
  }

  compileName(options?: toStringOptions) {
    const name = this.name.toString();
    if (!options?.jsxComponent) {
      if (name === "className") {
        return this.isStringLiteralValue() ? "class" : "v-bind:class";
      }
      if (name === "style") {
        if (options) {
          options.hasStyle = true;
        }
        return "v-bind:style";
      }

      if (kebabSvgAttributes.has(name)) {
        return dasherize(name);
      }
    }

    return name;
  }

  compileKey(options?: toStringOptions): string | null {
    if (options) {
      options.keys = options.keys || [];
      options.keys.push(this.initializer);
    }
    const name = this.compileName(options);
    return this.compileBase(
      name,
      this.compileValue(name, this.compileInitializer(options))
    );
  }

  getRefValue(options?: toStringOptions) {
    const name = this.initializer.toString(options);
    const refProp = options?.members.find((m) => m._name.toString() === name);
    if (refProp?.isRef) {
      return `()=>this.$refs.${name}`;
    }
    return `()=>${name}`;
  }

  getForwardRefValue(options?: toStringOptions) {
    const member = getMember(this.initializer, options)!;
    if (this.name.toString() === "ref") {
      return member.name;
    }
    return `forwardRef_${member.name}`;
  }

  compileRef(options?: toStringOptions) {
    return `ref="${this.compileInitializer(options)}"`;
  }

  compileValue(name: string, value: string) {
    if (name === "v-bind:style") {
      return `__processStyle(${value})`;
    }

    return value;
  }

  skipValue(options?: toStringOptions) {
    return this.isTemplateAttribute(options);
  }

  compileEvent(options: toStringOptions) {
    return `@${getEventName(
      this.name,
      options.jsxComponent!.state
    )}="${this.compileInitializer(options)}"`;
  }

  compileBase(name: string, value: string) {
    const prefix = name.startsWith("v-bind") ? "" : ":";
    return `${prefix}${name}="${value}"`;
  }
}
