import {
  TypeExpression,
  TypeReferenceNode as BaseTypeReferenceNode,
} from '@devextreme-generator/core';
import { ComponentInput } from './react-component-input';

// TODO: move these types to generator's common
//       (for example as DxFunctionalComponentType and DxComponentType)
export function compileJSXTemplateProps(args: TypeExpression[]) {
  return args.length
    ? args.length === 1
      ? `Partial<${args[0]}>`
      : `Partial<Omit<${args}>> & Required<Pick<${args}>>`
    : 'any';
}

export class TypeReferenceNode extends BaseTypeReferenceNode {
  get REF_OBJECT_TYPE() {
    return 'MutableRefObject';
  }

  toString() {
    if (
      this.context.components?.[this.typeName.toString()]
      instanceof ComponentInput
    ) {
      return `typeof ${super.toString()}`;
    }
    if (this.typeName.toString().startsWith('JSX.')) {
      return 'any';
    }
    if (this.typeName.toString() === 'JSXTemplate') {
      return `React.FunctionComponent<${compileJSXTemplateProps(
        this.typeArguments,
      )}>`;
    }
    return super.toString();
  }
}
