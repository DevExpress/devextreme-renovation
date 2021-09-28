import { Decorators } from '../decorators';
import { SyntaxKind } from '../syntaxKind';
import {
  GeneratorContext, toStringOptions, TypeExpressionImports,
} from '../types';
import { Dependency, dependencySet } from '../utils/dependency';
import {
  calculateType,
  compileType,
  compileTypeParameters,
  processComponentContext,
} from '../utils/string';
import { Expression } from './base';
import { Identifier } from './common';
import { Decorator } from './decorator';
import { Parameter } from './functions';
import { Block } from './statements';
import {
  mergeTypeExpressionImports,
  reduceTypeExpressionImports,
  SimpleTypeExpression,
  TypeExpression,
  TypeReferenceNode,
  isComplexType,
} from './type';
import { TypeParameterDeclaration } from './type-parameter-declaration';

export class BaseClassMember extends Expression {
  decorators: Decorator[];

  modifiers: string[];

  _name: Identifier;

  type: TypeExpression | string;

  inherited: boolean;

  scope = '';

  prefix = '';

  constructor(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    name: Identifier,
    type: TypeExpression | string = new SimpleTypeExpression(''),
    inherited = false,
  ) {
    super();
    this.decorators = decorators;
    this.modifiers = modifiers;
    this._name = name;
    this.type = type;
    this.inherited = inherited;
  }

  get name(): string {
    return `${this.prefix}${this._name}`;
  }

  processComponentContext(componentContext?: string) {
    return processComponentContext(componentContext);
  }

  getter(componentContext?: string) {
    return `${this.processComponentContext(componentContext)}${this.name}`;
  }

  isReadOnly() {
    return true;
  }

  get isInternalState() {
    return false;
  }

  _hasDecorator(name: Decorators) {
    return this.decorators.some((d) => d.name === name);
  }

  get isEvent() {
    return this._hasDecorator(Decorators.Event);
  }

  get isState() {
    return this._hasDecorator(Decorators.TwoWay);
  }

  get isRef() {
    return this._hasDecorator(Decorators.Ref);
  }

  get isRefProp() {
    return this._hasDecorator(Decorators.RefProp);
  }

  get isNested() {
    return this._hasDecorator(Decorators.Nested);
  }

  get isNestedComp() {
    return this._hasDecorator(Decorators.NestedComp);
  }

  get isSlot() {
    return (
      this._hasDecorator(Decorators.Slot)
      || this._hasDecorator(Decorators.ViewChild)
    );
  }

  get isSvgSlot() {
    const decorator = this.decorators.find((d) => d.name === Decorators.Slot);
    return decorator?.getParameter('isSVG')?.toString() === 'true';
  }

  get isTemplate() {
    return this._hasDecorator(Decorators.Template);
  }

  get isApiMethod() {
    return this._hasDecorator(Decorators.Method);
  }

  get isEffect() {
    return this._hasDecorator(Decorators.Effect);
  }

  get isForwardRefProp() {
    return this._hasDecorator(Decorators.ForwardRefProp);
  }

  get isForwardRef() {
    return this._hasDecorator(Decorators.ForwardRef);
  }

  get isConsumer() {
    return this._hasDecorator(Decorators.Consumer);
  }

  get isProvider() {
    return this._hasDecorator(Decorators.Provider);
  }

  get isApiRef() {
    return this._hasDecorator(Decorators.ApiRef);
  }

  get isMutable() {
    return this._hasDecorator(Decorators.Mutable);
  }

  get context() {
    const decorator = this.decorators.find(
      (d) => d.name === Decorators.Consumer || d.name === Decorators.Provider,
    ) as Decorator;
    return decorator.expression.arguments[0];
  }

  get canBeDestructured() {
    return this.name === this._name.toString();
  }

  getDependency(_options: toStringOptions): Dependency[] {
    return [new Dependency(this.name, [this])];
  }

  get isPrivate() {
    return this.modifiers.indexOf(SyntaxKind.PrivateKeyword) !== -1;
  }
}

export class Method extends BaseClassMember {
  asteriskToken?: string;

  questionToken: string;

  typeParameters: TypeParameterDeclaration[];

  parameters: Parameter[];

  body: Block | undefined;

  constructor(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    asteriskToken: string | undefined,
    name: Identifier,
    questionToken = '',
    typeParameters: TypeParameterDeclaration[] | undefined = [],
    parameters: Parameter[],
    type: TypeExpression | string = new SimpleTypeExpression('any'),
    body: Block | undefined,
  ) {
    super(decorators, modifiers, name, type);
    this.asteriskToken = asteriskToken;
    this.questionToken = questionToken;
    this.typeParameters = typeParameters;
    this.parameters = parameters;
    this.body = body;
  }

  compileBody(options?: toStringOptions): string {
    if (this.modifiers.indexOf('abstract') !== -1) {
      if (!this.body) {
        return ';';
      }
      throw new Error(`Method '${this.name}' cannot have an implementation because it is marked abstract.`);
    } else {
      if (this.body) {
        return this.body.toString(options);
      }
      throw new Error('Function implementation is missing or not immediately following the declaration.');
    }
  }

  compileModifiers(): string {
    return this.modifiers.join(' ');
  }

  compileTypeParameters(): string {
    return compileTypeParameters(this.typeParameters);
  }

  typeDeclaration() {
    return `${this._name}${
      this.questionToken
    }:${this.compileTypeParameters()}(${this.parameters
      .map((p) => p.typeDeclaration())
      .join(',')})=>${this.type}`;
  }

  declaration(options?: toStringOptions) {
    return `function ${this.name}${this.compileTypeParameters()}(${
      this.parameters
    })${compileType(this.type.toString())}${this.body?.toString(options)}`;
  }

  arrowDeclaration(options?: any) {
    return `(${this.parameters})=>${this.body?.toString(options)}`;
  }

  filterDependencies(dependencies: Dependency[]): Dependency[] {
    return dependencies;
  }

  reduceDependencies(
    dependencies: Dependency[],
    options: toStringOptions,
    startingArray: Dependency[] = [],
  ): Dependency[] {
    const reduceDependencies = dependencies
      .reduce((arr: BaseClassMember[], dep) => arr.concat(dep.members), []);
    const depsReducer = (d: Dependency[], p: BaseClassMember) => [
      ...d,
      ...(p!.getDependency({
        ...options,
        members: options.members.filter((m) => m.name !== this.name),
      })),
    ];
    return reduceDependencies.reduce(depsReducer, startingArray);
  }

  getDependency(options: toStringOptions): Dependency[] {
    const members = options.members;
    const run = this.decorators
      .find((d) => d.name === Decorators.Effect)
      ?.getParameter('run')
      ?.valueOf();

    let result: Dependency[] = [];
    const propsDependency = new Dependency('props', []);
    if (run === 'always') {
      result = this.filterDependencies(
        this.reduceDependencies(members
          .filter((m) => !(m instanceof Method)).map((m) => new Dependency(m.name, [m])),
        options,
        [propsDependency]),
      );
    } else if (run !== 'once') {
      const dependency = this.body?.getDependency(options) || [];
      const additionalDependency = [];

      if (dependency?.find((d) => d.name === 'props')) {
        additionalDependency.push(propsDependency);
      }
      const depSet = dependencySet(dependency);
      // do we really need to reduce deps?
      result = this.reduceDependencies(
        depSet,
        // .map((d) => members.find((p) => p._name.toString() === d?.name))
        // .filter((d) => d),
        options,
      )
        .concat(additionalDependency);

      if (additionalDependency.length) {
        result = result.filter((d) => !d.name.startsWith('props.'));
      }
    }

    return dependencySet(result);
  }

  toString(options?: toStringOptions): string {
    return `${this.decorators.join(' ')}${this.compileModifiers()} ${
      this.name
    }${this.compileTypeParameters()}(${this.parameters})${compileType(
      this.type.toString(),
    )}${this.compileBody(options)}`;
  }

  getImports(context: GeneratorContext) {
    let result: TypeExpressionImports = [];
    if (this.type instanceof TypeExpression) {
      result = this.type.getImports(context);
    }
    const parametersImport = reduceTypeExpressionImports(
      this.parameters
        .map((p) => p.type)
        .filter((t) => t instanceof TypeExpression) as TypeExpression[],
      context,
    );

    return mergeTypeExpressionImports(result, parametersImport);
  }
}

export class GetAccessor extends Method {
  constructor(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    name: Identifier,
    parameters: Parameter[],
    type?: TypeExpression | string,
    body?: Block,
  ) {
    super(
      decorators,
      modifiers,
      '',
      name,
      '',
      [],
      parameters,
      type,
      body || new Block([], false),
    );
  }

  isMemorized(
    options?: toStringOptions,
    needToMemorizeProvider = true,
    contextTypes?:{ [name:string]: TypeExpression },
  ): boolean {
    if (this.isProvider && !needToMemorizeProvider) {
      return false;
    }
    if (options) {
      const mutables = options?.members.filter((m) => m.isMutable).map((m) => m._name.toString());
      const containMutableDep = this.getDependency(options)
        .some((dep) => mutables?.includes(dep.name));
      // remove name comparising to member
      return !containMutableDep
      && (isComplexType(this.type, contextTypes)
        || this.isProvider);
    }
    return false;
  }

  typeDeclaration() {
    return `${this._name}:${this.type}`;
  }

  getter(componentContext?: string) {
    return `${this.processComponentContext(componentContext)}${this.name}`;
  }

  toString(options?: toStringOptions): string {
    return `${this.modifiers.join(' ')} get ${this.name}()${compileType(
      this.type.toString(),
    )}${this.body?.toString(options)}`;
  }
}

export class Property extends BaseClassMember {
  questionOrExclamationToken: string;

  initializer?: Expression;

  constructor(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    name: Identifier,
    questionOrExclamationToken = '',
    type?: TypeExpression | string,
    initializer?: Expression,
    inherited = false,
  ) {
    super(
      decorators,
      modifiers,
      name,
      type || new SimpleTypeExpression(calculateType(initializer) || 'any'),
      inherited,
    );
    this.questionOrExclamationToken = questionOrExclamationToken;
    this.initializer = initializer;
  }

  compileRefType(): string {
    const type = (this.type instanceof TypeReferenceNode && this.type.typeArguments[0])
      || 'any';
    return type.toString();
  }

  typeDeclaration() {
    return `${this.name}${compileType(
      this.type.toString(),
      this.questionOrExclamationToken,
    )}`;
  }

  defaultDeclaration(options?: toStringOptions) {
    return `${this.name}:${this.initializer?.toString(options)}`;
  }

  getter(componentContext?: string) {
    return `${this.processComponentContext(
      componentContext,
    )}${this._name.toString()}`;
  }

  isReadOnly() {
    return this.decorators.some(
      (d) => d.name === Decorators.OneWay
        || d.name === Decorators.Event
        || d.name === Decorators.RefProp
        || d.name === Decorators.ForwardRef
        || d.name === Decorators.ApiRef
        || d.name === Decorators.Nested
        || d.name === Decorators.Slot
        || d.name === Decorators.Template,
    );
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

  toString(_options?: toStringOptions) {
    return `${this.modifiers.join(' ')} ${this.decorators
      .map((d) => d.toString())
      .join(' ')} ${this.typeDeclaration()} ${
      this.initializer && this.initializer.toString()
        ? `= ${this.initializer.toString()}`
        : ''
    }`;
  }

  get isInternalState() {
    return (
      this.decorators.length === 0
      || this._hasDecorator(Decorators.InternalState)
    );
  }

  get isOptional() {
    return this.questionOrExclamationToken === SyntaxKind.QuestionToken;
  }

  getImports(context: GeneratorContext) {
    if (this.type instanceof TypeExpression) {
      return this.type.getImports(context);
    }
    return [];
  }
}

export class Constructor {
  constructor(
    public decorators: Decorator[] = [],
    public modifiers: string[] = [],
    public parameters: Parameter[],
    public body: Block | undefined,
  ) {}

  toString() {
    return `${this.decorators.join(' ')}
      ${this.modifiers.join(' ')} constructor(${this.parameters})${
  this.body || '{}'
}
    `;
  }
}

export const isProperty = (member: BaseClassMember): member is Property => member instanceof Property;
