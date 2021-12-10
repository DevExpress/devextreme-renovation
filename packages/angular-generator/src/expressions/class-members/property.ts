import {
  capitalizeFirstLetter,
  compileType,
  Decorators,
  Dependency,
  Expression,
  FunctionTypeNode,
  Identifier,
  Property as BaseProperty,
  SimpleExpression,
  SyntaxKind,
  TypeExpression,
} from '@devextreme-generator/core';

import { toStringOptions } from '../../types';
import { Decorator } from '../decorator';

function parseEventType(type: TypeExpression | string) {
  if (type instanceof FunctionTypeNode) {
    const typeList = type.parameters.map((p) => {
      const type = p.type?.toString() || 'any';
      if (p.questionToken === SyntaxKind.QuestionToken && type !== 'any') {
        return `${type}|${SyntaxKind.UndefinedKeyword}`;
      }
      return type;
    });
    return typeList.length ? `<${typeList}>` : '<void>';
  }
  return '<any>';
}

export class Property extends BaseProperty {
  readonly forwardRefProps?: Property;

  get name() {
    return this._name.toString();
  }

  constructor(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    name: Identifier,
    questionOrExclamationToken = '',
    type?: TypeExpression | string,
    initializer?: Expression,
    inherited = false,
    forwardRefProps?: Property,
  ) {
    if (decorators.find((d) => d.name === Decorators.Template)) {
      questionOrExclamationToken = questionOrExclamationToken === SyntaxKind.ExclamationToken
        ? ''
        : questionOrExclamationToken;
    }
    if (!initializer && decorators.find((d) => d.name === Decorators.Event)) {
      initializer = new SimpleExpression('(e: any) => void 0');
    }
    super(
      decorators,
      modifiers,
      name,
      questionOrExclamationToken,
      type,
      initializer,
      inherited,
    );
    this.forwardRefProps = forwardRefProps;
  }

  toString(options?: toStringOptions) {
    const eventDecorator = this.decorators.find(
      (d) => d.name === Decorators.Event,
    );

    if (eventDecorator) {
      return `${eventDecorator} ${this.name}:EventEmitter${parseEventType(
        this.type,
      )} = new EventEmitter();`;
    }
    if (this.isRef) {
      const forwardRefProps = this.forwardRefProps as Property;
      if (forwardRefProps) {
        const forwardRefUsedInView = options
          ?.forwardRefs
          ?.some((forwardRef) => forwardRef.name === forwardRefProps.name);
        if (forwardRefUsedInView) {
          return `@ViewChild("${this.name}", {static: false})${this.name}${forwardRefProps.questionOrExclamationToken}:ElementRef<${this.type}>;`;
        }
        return `${this.name}${forwardRefProps.questionOrExclamationToken}:ElementRef<${this.type}>;`;
      }
      if (this.isRefProp) {
        return `${this.name}${this.questionOrExclamationToken}:ElementRef<${this.type}>;`;
      }
      const decoratorString = `@ViewChild("${this.name}Link", {static: false}) `;
      return `${decoratorString}__${this.name}!:ElementRef<${this.type}>;
            get ${this.name}():ElementRef<${this.type}> { return (this.__${this.name}) ? this.__${this.name} : (new UndefinedNativeElementRef<${this.type}>()); }`;

      /*      const forwardRefUsedInView = options?.forwardRefs?.some((forwardRef) => forwardRef.name === sourceProperty.name);
      const isForwardRef = sourceProperty?.isForwardRefProp || sourceProperty?.isForwardRef;
      const refFromView = forwardRefUsedInView || !isForwardRef;
      if (refFromView) {
        const isPropRef = (sourceRefProps?.[0] as Property)?.isRefProp || (sourceRefProps?.[0] as Property)?.isForwardRefProp;
        if (isPropRef) {
          return `@ViewChild("${this.name}", {static: false})${this.name}${this.questionOrExclamationToken}:ElementRef<${this.type}>;`;
        }
        const decoratorString = `@ViewChild("${this.name}'Link'", {static: false}) `;
        return `${decoratorString}__${this.name}!:ElementRef<${this.type}>;
          get ${this.name}():ElementRef<${this.type}> { return (this.__${this.name}) ? this.__${this.name} : (new UndefinedNativeElementRef<${this.type}>()); }`;
      }
      return `${this.name}${sourceProperty.questionOrExclamationToken}:ElementRef<${this.type}>;`; */
    }
    if (this._hasDecorator(Decorators.ApiRef)) {
      return `@ViewChild("${this.name}", {static: false}) ${this.name}${this.questionOrExclamationToken}:${this.type}`;
    }
    if (this.isSlot) {
      const selector = `slot${capitalizeFirstLetter(this.name)}`;
      return `__${selector}?: ElementRef<HTMLDivElement>;
            get ${this.name}(){
                const childNodes =  this.__${selector}?.nativeElement?.childNodes;
                return childNodes && childNodes.length > 2;
            }`;
    }
    if (this.isNestedComp) {
      return `@ContentChildren(${this.type}) ${this.name} ${this.questionOrExclamationToken}: QueryList<${this.type}>`;
    }

    if (this.isProvider || this.isConsumer) {
      return '';
    }

    if (this.isForwardRefProp) {
      const type = `ElementRef<${this.type}>`;
      const returnType = `${type}${this.questionOrExclamationToken === SyntaxKind.QuestionToken
        ? '|undefined'
        : ''
      }`;
      return `${this.modifiers.join(' ')} ${this.decorators
        .map((d) => d.toString())
        .join(' ')} ${this.name}${this.questionOrExclamationToken
      }:(ref?:${type})=>${returnType}`;
    }

    if (this.isForwardRef) {
      return `${this.modifiers.join(' ')} ${this.decorators
        .map((d) => d.toString())
        .join(' ')} ${this.name}:ElementRef<${this.type}> = new UndefinedNativeElementRef<${this.type}>();`;
    }

    if (this.isTemplate) {
      return `${this.modifiers.join(' ')} ${this.decorators
        .map((d) => d.toString())
        .join(' ')} ${this.typeDeclaration()} = null`;
    }

    return super.toString();
  }

  getter(componentContext?: string) {
    componentContext = this.processComponentContext(componentContext);
    if (this.isEvent) {
      return `${componentContext}_${this.name}`;
    }
    if (
      this.isRef
      || this.isRefProp
      || this.isForwardRef
      || this.isForwardRefProp
    ) {
      return `${componentContext}${this.name}`;
    }
    if (this.isConsumer) {
      return `${componentContext}${this.name}Consumer`;
    }
    if (this.isProvider) {
      return `${componentContext}${this.name}.value`;
    }
    if (this._hasDecorator(Decorators.ApiRef)) {
      return `${componentContext}${this.name}`;
    }
    return `${componentContext}${this.name}`;
  }

  getDependency(_options: toStringOptions): Dependency[] {
    return [this];
  }

  typeDeclaration(): string {
    if (this.isTemplate) {
      return `${this.name}${compileType(
        'TemplateRef<any> | null',
        this.questionOrExclamationToken,
      )}`;
    }
    return super.typeDeclaration();
  }

  inherit() {
    return new Property(
      this.decorators as Decorator[],
      this.modifiers,
      this._name,
      this.questionOrExclamationToken,
      this.type,
      this.initializer,
      true,
    );
  }

  get canBeDestructured() {
    if (
      this.isEvent
      || this.isNested
      || this.isForwardRefProp
      || this.isRef
      || this.isRefProp
      || this.isForwardRef
    ) {
      return false;
    }
    return super.canBeDestructured;
  }
}
