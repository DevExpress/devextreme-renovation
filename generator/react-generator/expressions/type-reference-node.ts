import {
  TypeExpression,
  TypeReferenceNode as BaseTypeReferenceNode,
} from "../../base-generator/expressions/type";
import { ComponentInput } from "./react-component-input";

// TODO: move these types to generator's common
//       (for example as DxFunctionalComponentType and DxComponentType)
export function compileJSXTemplateProps(args: TypeExpression[]) {
  return args.length
    ? args.length === 1
      ? `Partial<${args[0]}>`
      : `Partial<Omit<${args}>> & Required<Pick<${args}>>`
    : "any";
}

export class TypeReferenceNode extends BaseTypeReferenceNode {
  toString() {
    if (
      this.context.components?.[this.typeName.toString()] instanceof
      ComponentInput
    ) {
      return `typeof ${super.toString()}`;
    }
    if (this.typeName.toString().startsWith("JSX.")) {
      return "any";
    }
    if (this.typeName.toString() === "JSXTemplate") {
      return `React.FunctionComponent<${compileJSXTemplateProps(
        this.typeArguments
      )}>`;
    }
    return super.toString();
  }
}
