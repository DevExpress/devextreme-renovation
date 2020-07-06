import { JsxAttribute as BaseJsxAttribute } from "../../../angular-generator/expressions/jsx/attribute";
import { toStringOptions } from "../../types";
import { getMember } from "../../../angular-generator/utils";
import { getEventName } from "../utils";

export class JsxAttribute extends BaseJsxAttribute {
  getTemplateProp(options?: toStringOptions) {
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
    }

    return name;
  }

  compileKey() {
    return null;
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

  compileEvent(options?: toStringOptions) {
    return `@${getEventName(
      this.name,
      options?.jsxComponent?.state
    )}="${this.compileInitializer(options)}"`;
  }

  compileBase(name: string, value: string) {
    const prefix = name.startsWith("v-bind") ? "" : ":";
    return `${prefix}${name}="${value}"`;
  }
}
