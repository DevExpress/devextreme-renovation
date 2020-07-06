import {
  TypeExpression,
  SimpleTypeExpression,
  ArrayTypeNode,
  UnionTypeNode,
  FunctionTypeNode,
  LiteralTypeNode,
  TypeReferenceNode,
  isTypeArray,
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

function calculatePropertyType(type: TypeExpression | string): string {
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

  if (type instanceof TypeReferenceNode) {
    return type.typeName.toString();
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
        : calculatePropertyType(this.type);
    const parts = [];
    if (type) {
      parts.push(`type: ${type}`);
    }

    if (this.questionOrExclamationToken === SyntaxKind.ExclamationToken) {
      parts.push("required: true");
    }
    const isState = this.isState;
    if (this.initializer && !isState) {
      parts.push(`default(){
                  return ${this.initializer}
              }`);
    }

    if (this.isState) {
      parts.push("default: undefined");
    }

    return `${this.name}: {
              ${parts.join(",\n")}
          }`;
  }

  getter(componentContext?: string) {
    const baseValue = super.getter(componentContext);
    componentContext = this.processComponentContext(componentContext);
    if (this.isState) {
      return `(${componentContext}${this.name} !== undefined ? ${componentContext}${this.name} : ${componentContext}${this.name}_state)`;
    }
    if (
      (this.isForwardRefProp || this.isRef || this.isForwardRef) &&
      componentContext.length
    ) {
      return `${componentContext}$refs.${this.name}`;
    }
    if (this.isRefProp) {
      return `${componentContext}${this.name}()`;
    }
    if (this.isTemplate) {
      return `${componentContext}$scopedSlots.${this.name}`;
    }
    if (this.isSlot) {
      const name = this.name === "children" ? "default" : this.name;
      return `${componentContext}$slots.${name}`;
    }
    if (this.isNested) {
      const isArray = isTypeArray(this.type);
      const indexGetter = isArray ? "" : "?.[0]";
      let nestedName = capitalizeFirstLetter(this.name);
      if (isArray) {
        nestedName = removePlural(nestedName);
      }

      return `(${componentContext}${this.name} || this.__getNestedFromChild("Dx${nestedName}")${indexGetter})`;
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
    if (this.isEvent || this.isState || this.isRefProp || this.isNested) {
      return false;
    }
    return super.canBeDestructured;
  }

  getDependency() {
    if (this.isState) {
      return super.getDependency().concat([`${this.name}_state`]);
    }
    return super.getDependency();
  }
}
