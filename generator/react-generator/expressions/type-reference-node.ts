import {
  TypeExpression,
  TypeReferenceNode as BaseTypeReferenceNode,
  SimpleTypeExpression,
} from "../../base-generator/expressions/type";
import { ComponentInput } from "./react-component-input";
import { Identifier } from "../../base-generator/expressions/common";
import { GeneratorContext } from "../../base-generator/types";

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
  public readonly REF_OBJECT_TYPE: string = "MutableRefObject";

  constructor(
    public typeName: Identifier,
    public typeArguments: TypeExpression[] = [],
    public context: GeneratorContext
  ) {
    super(typeName, typeArguments, context);
    if (typeName.toString() === "RefObject") {
      this.typeName = new Identifier(this.REF_OBJECT_TYPE);
      if (typeArguments.length === 0) {
        this.typeArguments.push(new SimpleTypeExpression("any"));
      }
    }
  }

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
