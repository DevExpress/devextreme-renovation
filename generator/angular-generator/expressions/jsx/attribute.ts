import {
  JsxAttribute as BaseJsxAttribute,
  JsxExpression,
} from "../../../base-generator/expressions/jsx";
import { toStringOptions } from "../../types";
import {
  isFunction,
  isCallable,
} from "../../../base-generator/expressions/functions";
import { PropertyAssignment } from "../../../base-generator/expressions/property-assignment";
import { SimpleExpression } from "../../../base-generator/expressions/base";
import { StringLiteral } from "../../../base-generator/expressions/literal";
import { getMember } from "../../../base-generator/utils/expressions";
import {
  Method,
  GetAccessor,
} from "../../../base-generator/expressions/class-members";

const ATTR_BINDING_ATTRIBUTES = ["aria-label"];

export class JsxAttribute extends BaseJsxAttribute {
  getRefValue(options?: toStringOptions) {
    return this.compileRef(options).replace("#", "");
  }

  getForwardRefValue(options?: toStringOptions): string {
    const member = getMember(this.initializer, options)!;
    return `forwardRef_${member.name.toString()}`;
  }

  compileInitializer(options?: toStringOptions) {
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
    const refString = this.initializer.toString(options);
    const componentContext = options?.newComponentContext
      ? `${options.newComponentContext}.`
      : "";
    const match = refString
      .replace(/[\?!]/, "")
      .match(new RegExp(`${componentContext}(\\w+).nativeElement`));
    if (match && match[1]) {
      return `#${match[1]}`;
    }

    return `#${refString}`;
  }

  compileEvent(options?: toStringOptions) {
    return `(${this.name})="${this.compileInitializer(options)}($event)"`;
  }

  compileName(options?: toStringOptions) {
    const name = this.name.toString();
    if (!options?.jsxComponent) {
      if (name === "className") {
        return "class";
      }
      if (name === "style") {
        if (options) {
          options.hasStyle = true;
        }
        return "ngStyle";
      }

      if (ATTR_BINDING_ATTRIBUTES.indexOf(name) > -1) {
        return `attr.${name}`;
      }
    }

    return name;
  }

  compileKey(options?: toStringOptions): string | null {
    if (options) {
      options.keys = options.keys || [];
      options.keys.push(this.initializer);
    }
    return "";
  }

  compileValue(name: string, value: string) {
    if (name === "title") {
      return `${value}!==undefined?${value}:''`;
    }

    if (name === "ngStyle") {
      return `__processNgStyle(${value})`;
    }

    return value;
  }

  compileBase(name: string, value: string) {
    return `[${name}]="${value}"`;
  }

  isStringLiteralValue() {
    return (
      this.initializer instanceof StringLiteral ||
      (this.initializer instanceof JsxExpression &&
        this.initializer.expression instanceof StringLiteral)
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
      (p) => p.isTemplate
    );
    return templateProps?.some((p) => p.name === this.name.toString()) || false;
  }

  skipValue(options?: toStringOptions) {
    return false;
  }

  toString(options?: toStringOptions) {
    if (this.skipValue(options)) {
      return "";
    }

    if (this.name.toString() === "ref") {
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
      return "";
    }

    const name = this.compileName(options);

    if (name === "key" && this.compileKey() !== null) {
      return this.compileKey(options) as string;
    }

    if (this.isStringLiteralValue()) {
      return `${name.replace("attr.", "")}=${this.initializer.toString()}`;
    }

    if (this.initializer instanceof JsxExpression) {
      const funcName = this.initializer.toString();
      const template = this.initializer.getExpression(options)!;
      if (isFunction(template) || isCallable(template)) {
        return this.compileBase(name, funcName);
      }
    }

    return this.compileBase(
      name,
      this.compileValue(name, this.compileInitializer(options))
    );
  }

  getTemplateContext(options?: toStringOptions): PropertyAssignment[] {
    const member = getMember(this.initializer, options);
    const binding =
      member instanceof Method && !(member instanceof GetAccessor)
        ? ".bind(this)"
        : "";
    return [
      new PropertyAssignment(
        this.name,
        new SimpleExpression(`${this.compileInitializer(options)}${binding}`)
      ),
    ];
  }
}
