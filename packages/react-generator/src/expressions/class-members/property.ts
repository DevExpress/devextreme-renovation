import {
  capitalizeFirstLetter,
  compileType,
  Decorators,
  GeneratorContext,
  Identifier,
  BaseFunction,
  Property as BaseProperty,
  SimpleExpression,
  SimpleTypeExpression,
  SyntaxKind,
  toStringOptions,
  TypeExpression,
  ObjectLiteral,
  ArrayLiteral,
  New,
} from '@devextreme-generator/core';

import {
  compileJSXTemplateProps,
  TypeReferenceNode,
} from '../type-reference-node';

export function getLocalStateName(
  name: Identifier | string,
  componentContext = '',
) {
  return `${componentContext}__state_${name}`;
}

export function getPropName(
  name: Identifier | string,
  componentContext = '',
  scope = 'props.',
) {
  return `${componentContext}${scope}${name}`;
}

export function stateSetter(stateName: Identifier | string) {
  return `__state_set${capitalizeFirstLetter(stateName)}`;
}

export function compileJSXTemplateType(
  type: string | TypeExpression,
  isComponent = false,
) {
  if (
    type instanceof TypeReferenceNode
    && type.typeName.toString() === 'JSXTemplate'
  ) {
    const componentTypeName = isComponent ? 'JSXElementConstructor' : 'FunctionComponent';
    return `React.${componentTypeName}<${compileJSXTemplateProps(type.typeArguments)}>`;
  }

  return type;
}

export class Property extends BaseProperty {
  get hasObjectLiteralInitializer(): boolean {
    const { initializer } = this;
    return initializer instanceof ObjectLiteral
      || initializer instanceof ArrayLiteral
      || initializer instanceof New;
  }

  defaultProps(options?: toStringOptions) {
    const { initializer } = this;
    const isSimpleExpression = initializer instanceof SimpleExpression;
    const isFunction = initializer instanceof BaseFunction;
    const isComplexExpression = !(isSimpleExpression || isFunction);
    if (isComplexExpression || options?.fromType) {
      if (this.hasObjectLiteralInitializer) {
        return `${this.name}: Object.freeze(${initializer?.toString(options)}) as any`;
      }
      return `get ${this.name}() { return ${initializer?.toString(options)} }`;
    }
    return this.defaultDeclaration(options);
  }

  compileTypeReferenceNode(
    typeName: Identifier,
    typeArguments: TypeExpression[],
    context: GeneratorContext,
  ) {
    return new TypeReferenceNode(typeName, typeArguments, context);
  }

  getTypeArguments(type: TypeReferenceNode): TypeExpression[] {
    if (type.typeArguments.length) {
      if (type.typeArguments.toString() === 'any') {
        return type.typeArguments;
      }
      return [new SimpleTypeExpression(`${type.typeArguments[0]} | null`)];
    }
    return [new SimpleTypeExpression('any')];
  }

  compileTypeDeclarationType(
    type: string | TypeExpression,
    questionOrExclamationToken: string,
  ): string {
    let typeRererence = type;
    if (
      (this.isRefProp || this.isForwardRefProp)
      && type instanceof TypeReferenceNode
      && type.toString() !== 'any'
    ) {
      const typeArguments = this.getTypeArguments(type);
      typeRererence = this.compileTypeReferenceNode(
        type.typeName,
        typeArguments,
        type.context,
      );
    }
    return compileType(
      typeRererence.toString(),
      questionOrExclamationToken === SyntaxKind.ExclamationToken
        ? ''
        : questionOrExclamationToken,
    );
  }

  typeDeclaration(patchToken = false): string {
    let type = this.type;

    if (this.isSlot) {
      type = 'React.ReactNode';
    }
    if (
      this.decorators.find(
        (d) => d.name === Decorators.Ref
          || d.name === Decorators.ApiRef
          || d.name === Decorators.ForwardRef,
      )
    ) {
      type = 'any';
    }
    let name = this.name;
    if (this.isRef || this.isForwardRef || this.isApiRef) {
      name = this._name.toString();
    }
    if (patchToken) {
      const token = (this.questionOrExclamationToken || this.initializer) ? '?' : '';
      return `${name}${this.compileTypeDeclarationType(type, token)}`;
    }
    return `${name}${this.compileTypeDeclarationType(type, this.questionOrExclamationToken)}`;
  }

  getter(componentContext?: string) {
    componentContext = this.processComponentContext(componentContext);
    const scope = this.processComponentContext(this.scope);
    if (this.isInternalState) {
      return getLocalStateName(this.name, componentContext);
    }
    if (
      this.decorators.some(
        (d) => d.name === Decorators.OneWay
          || d.name === Decorators.Event
          || d.name === Decorators.Template
          || d.name === Decorators.Slot,
      )
    ) {
      return getPropName(this.name, componentContext, scope);
    }
    if (
      this.decorators.some(
        (d) => d.name === Decorators.Ref
          || d.name === Decorators.ForwardRef
          || d.name === Decorators.ApiRef
          || d.name === Decorators.RefProp
          || d.name === Decorators.ForwardRefProp,
      )
    ) {
      if (componentContext === '') {
        return `${scope}${this.name}`;
      }
      return getPropName(this.name, componentContext, scope);
    }
    if (this.isState) {
      const propName = getPropName(this.name, componentContext, scope);
      return `(${propName}!==undefined?${propName}:${getLocalStateName(
        this.name,
        componentContext,
      )})`;
    }
    if (this.isNested) {
      return `__getNested${capitalizeFirstLetter(this.name)}`;
    }
    if (this.isProvider || this.isConsumer) {
      return this.name;
    }
    if (this.isMutable) {
      return `${this.name}.current!`;
    }
    throw `Can't parse property: ${this._name}`;
  }

  getDependencyString(_options: toStringOptions): string[] {
    if (this.isInternalState) {
      return [getLocalStateName(this.name)];
    }
    if (
      this.decorators.some(
        (d) => d.name === Decorators.OneWay
          || d.name === Decorators.Event
          || d.name === Decorators.Template
          || d.name === Decorators.Slot,
      )
    ) {
      return [getPropName(this.name)];
    }
    if (
      this.decorators.some(
        (d) => d.name === Decorators.Ref
          || d.name === Decorators.ForwardRef
          || d.name === Decorators.ApiRef
          || d.name === Decorators.RefProp
          || d.name === Decorators.ForwardRefProp,
      )
    ) {
      const scope = this.processComponentContext(this.scope);
      return this.questionOrExclamationToken === '?'
        ? [`${scope}${this.name.toString()}`]
        : [];
    }
    if (this.isState) {
      return [getPropName(this.name), getLocalStateName(this.name)];
    }
    if (this.isNested) {
      return [`__getNested${capitalizeFirstLetter(this.name)}`];
    }
    if (this.isProvider || this.isConsumer || this.isMutable) {
      return [this.name];
    }
    throw `Can't parse property: ${this._name}`;
  }

  inherit() {
    return new Property(
      this.decorators,
      this.modifiers,
      this._name,
      this.questionOrExclamationToken,
      this.type,
      this.initializer,
      true,
    );
  }

  toString(options?: toStringOptions) {
    if (!options) {
      return super.toString();
    }
    const type = `${this.type}${this.questionOrExclamationToken === SyntaxKind.QuestionToken
      ? ' | undefined'
      : ''
    }`;
    if (this.isState) {
      const propName = getPropName(this.name);
      const defaultExclamationToken = this.initializer
        && this.questionOrExclamationToken !== SyntaxKind.QuestionToken
        ? SyntaxKind.ExclamationToken
        : '';

      return `const [${getLocalStateName(this.name)}, ${stateSetter(
        this.name,
      )}] = useState<${type}>(()=>${propName}!==undefined?${propName}:props.default${capitalizeFirstLetter(
        this.name,
      )}${defaultExclamationToken})`;
    }

    if (this.isRef || this.isForwardRef) {
      return `const ${this.name
      }:MutableRefObject<${this.compileRefType()} | null>=useRef<${this.compileRefType()}>(null)`;
    }

    if (this.isMutable) {
      return `const ${this.name}=useRef<${type}>(${this.initializer ? this.initializer : ''
      })`;
    }

    if (this.isApiRef) {
      return `const ${this.name
      }:MutableRefObject<${this.compileRefType()}Ref | null>=useRef<${this.compileRefType()}Ref>(null)`;
    }

    if (this.isConsumer) {
      return `const ${this.name} = useContext(${this.context})`;
    }

    if (this.isProvider) {
      return `const [${this.name}] = useState(${this.initializer})`;
    }

    return `const [${getLocalStateName(this.name)}, ${stateSetter(
      this.name,
    )}] = useState<${type}>(${this.initializer})`;
  }

  get canBeDestructured() {
    if (
      this.isState
      || this.isNested
      || this.isRef
      || this.isForwardRef
      || this.isMutable
    ) {
      return false;
    }
    return super.canBeDestructured;
  }
}
