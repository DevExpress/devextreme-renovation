import {
  TypeExpression,
  SimpleTypeExpression,
  ArrayTypeNode,
  UnionTypeNode,
  FunctionTypeNode,
  LiteralTypeNode,
  TypeReferenceNode,
  isTypeArray,
  TypeLiteralNode,
} from "../../../base-generator/expressions/type";
import SyntaxKind from "../../../base-generator/syntaxKind";
import {
  capitalizeFirstLetter,
  removePlural,
} from "../../../base-generator/utils/string";
import {
  StringLiteral,
  ObjectLiteral,
  NumericLiteral,
} from "../../../base-generator/expressions/literal";
import { Property as BaseProperty } from "../../../base-generator/expressions/class-members";
import { toStringOptions } from "../../types";
import { Expression } from "../../../base-generator/expressions/base";

const BasicTypes = [
  "String",
  "Number",
  "Boolean",
  "Array",
  "Date",
  "Function",
  "Symbol",
];

function calculatePropertyType(
  type: TypeExpression | string,
  initializer?: Expression
): string {
  if (type instanceof TypeReferenceNode && type.context.imports) {
    const imports = type.context.imports;
    if (
      Object.keys(imports).some((key) =>
        imports[key].has(type.typeName.toString())
      )
    ) {
      return "";
    }
  }
  if (type instanceof SimpleTypeExpression) {
    const typeString = type.type.toString();
    if (
      typeString !== SyntaxKind.AnyKeyword &&
      typeString !== SyntaxKind.UndefinedKeyword
    ) {
      return capitalizeFirstLetter(typeString);
    }
  }
  if (type instanceof ArrayTypeNode) {
    return "Array";
  }
  if (type instanceof UnionTypeNode) {
    const types = ([] as string[]).concat(
      type.types.map((t) => calculatePropertyType(t))
    );
    const typesWithoutDuplicates = [...new Set(types)];
    return typesWithoutDuplicates.length === 1
      ? typesWithoutDuplicates[0]
      : `[${typesWithoutDuplicates.join(",")}]`;
  }
  if (type instanceof FunctionTypeNode) {
    return "Function";
  }
  if (type instanceof LiteralTypeNode) {
    if (type.expression instanceof ObjectLiteral) {
      return "Object";
    }
    if (type.expression instanceof StringLiteral) {
      return "String";
    }
    if (type.expression instanceof NumericLiteral) {
      return "Number";
    }
  }
  if (type instanceof TypeLiteralNode) {
    return "Object";
  }
  if (type instanceof TypeReferenceNode) {
    const typeString = type.type.toString();
    if (typeString === "Array") {
      return "Array";
    }
    if (type.context.types && type.context.types[typeString]) {
      return calculatePropertyType(type.context.types[typeString]);
    }
    return BasicTypes.includes(typeString) || typeString.endsWith("Element")
      ? typeString
      : "Object";
  }
  return "";
}

export class Property extends BaseProperty {
  get name() {
    if (this.isTemplate) {
      return this._name.toString();
    }
    return this._name.toString();
  }

  toString(options?: toStringOptions) {
    if (!options) {
      return "";
    }
    if (this.isInternalState) {
      return `${this.name}: ${this.initializer}`;
    }

    if (
      this.isEvent ||
      (this.isRef && !this.inherited) ||
      this.isSlot ||
      this.isTemplate ||
      (this.isNested && !isTypeArray(this.type))
    ) {
      return "";
    }

    const type =
      this.isRefProp || this.isForwardRefProp
        ? "Function"
        : calculatePropertyType(this.type, this.initializer);
    const parts = [];
    if (type) {
      parts.push(`type: ${type}`);
    }

    if (this.questionOrExclamationToken === SyntaxKind.ExclamationToken) {
      parts.push("required: true");
    }
    if (this.initializer && type !== "Function") {
      parts.push(`default(){
                  return ${this.initializer}
              }`);
    } else if (this.initializer) {
      parts.push(`default:${this.initializer}`);
    } else if (!this.initializer && type.indexOf("Boolean") >= 0) {
      parts.push(`default(){
        return undefined
      }`);
    }

    return `${this.name}: {
              ${parts.join(",\n")}
          }`;
  }

  getter(componentContext?: string, keepRef: boolean = false) {
    const baseValue = super.getter(componentContext);
    componentContext = this.processComponentContext(componentContext);
    if (this.isState) {
      return `${componentContext}${this.name}_state`;
    }
    if (
      (this.isRef || this.isForwardRef || this.isForwardRefProp) &&
      componentContext.length
    ) {
      if (keepRef) {
        return this.isForwardRefProp
          ? `${componentContext}${this.name}`
          : `${componentContext}$refs`;
      }
      return `${componentContext}$refs.${this.name}`;
    }
    if (this.isRefProp) {
      if (keepRef) {
        const token = this.isOptional ? "?." : "";
        return `${componentContext}${this.name}${token}()`;
      }
      return `${componentContext}props.${this.name}`;
    }
    if (this.isTemplate) {
      return `${componentContext}$scopedSlots.${this.name}`;
    }
    if (this.isSlot) {
      const name = this.name === "children" ? "default" : this.name;
      return `${componentContext}$slots.${name}`;
    }
    if (this.isConsumer || this.isProvider) {
      return `${componentContext}${this.name}.value`;
    }
    if (this.isNested) {
      const isArray = isTypeArray(this.type);
      let nestedName = capitalizeFirstLetter(this.name);
      if (isArray) {
        nestedName = removePlural(nestedName);
      }

      return `${componentContext}__getNested${nestedName}`;
    }
    return baseValue;
  }

  inherit() {
    return new Property(
      this.decorators,
      this.modifiers,
      this._name,
      this.questionOrExclamationToken,
      this.type,
      this.initializer,
      true
    );
  }

  get canBeDestructured() {
    if (
      this.isEvent ||
      this.isState ||
      this.isRefProp ||
      this.isNested ||
      this.isForwardRefProp
    ) {
      return false;
    }
    return super.canBeDestructured;
  }

  getDependency(options: toStringOptions) {
    if (this.isState) {
      return [`${this.name}_state`];
    }
    return super.getDependency(options);
  }
}
