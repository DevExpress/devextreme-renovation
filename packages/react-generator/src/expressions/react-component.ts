import path from 'path';
import {
  BaseClassMember,
  Property as BaseProperty,
  Method as BaseMethod,
  Call,
  Identifier,
  Conditional,
  Decorator,
  ObjectLiteral,
  SyntaxKind,
  GeneratorContext,
  toStringOptions,
  getModuleRelativePath,
  getProps,
  Component,
  BindingElement,
  BindingPattern,
  VariableStatement,
  VariableDeclaration,
  VariableDeclarationList,
  SimpleExpression,
  Expression,
  ReturnStatement,
  Block,
  SimpleTypeExpression,
  isTypeArray,
  TypeExpression,
  capitalizeFirstLetter,
  lowerizeFirstLetter,
  processComponentContext,
  PropertyAssignment,
  ShorthandPropertyAssignment,
  Dependency,
  isComponentWrapper,
  If,
  Decorators,
  TypeReferenceNode,
  TypeCast,
} from '@devextreme-generator/core';
import { GetAccessor } from './class-members/get-accessor';
import { Method, calculateMethodDependencyString } from './class-members/method';
import { getPropName, Property } from './class-members/property';
import { HeritageClause } from './heritage-clause';
import { PropertyAccess } from './property-access';
import { ComponentInput, getTemplatePropName } from './react-component-input';
import { compileGettersCompatibleExtend } from './common';

function getSubscriptions(methods: Method[]) {
  return methods
    .map((m) => {
      const [event, parameters] = m.decorators.find(
        (d) => d.name === 'Listen',
      )!.expression.arguments;

      let target: string | undefined;
      if (parameters instanceof ObjectLiteral) {
        target = parameters.getProperty('target')?.toString();
      }

      return {
        name: m.name,
        target,
        eventName: event?.toString(),
      };
    })
    .filter((s) => s.target);
}

export class ReactComponent extends Component {
  optionalMembers: Array<BaseProperty | BaseMethod>;

  constructor(
    decorator: Decorator,
    modifiers: string[] = [],
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[] = [],
    members: Array<Property | Method>,
    context: GeneratorContext,
  ) {
    super(
      decorator,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      context,
    );
    const componentName = heritageClauses[0]?.defaultProps[0];
    const propsMembers = componentName ? context.components?.[componentName].members || [] : [];
    this.optionalMembers = propsMembers
      .filter((p) => {
        const hasDefaulValueAndNotState = (p as Property).initializer && !p.isState;
        return !(hasDefaulValueAndNotState) && ((p as Property).questionOrExclamationToken === '?');
      });

    this.refs = this.refs.concat(
      this.members.filter((m) => m.isForwardRef) as Property[],
    );
  }

  get REF_OBJECT_TYPE(): string {
    return 'MutableRefObject';
  }

  addPrefixToMembers(members: (BaseProperty | Method)[]): (BaseProperty | Method)[] {
    return super.addPrefixToMembers(
      members.map((m) => {
        if (m instanceof Method || m.isRef || m.isForwardRef) {
          m.prefix = '__';
        }
        return m;
      }),
    );
  }

  processMembers(members: (BaseProperty | Method)[]): (BaseProperty | Method)[] {
    members = super.processMembers(members).map((p) => {
      if (p.inherited) {
        p.scope = 'props';
      }
      return p;
    });

    (members.filter((m) => m.isNested) as Property[]).forEach((m) => {
      if (m.initializer) {
        m.questionOrExclamationToken = SyntaxKind.QuestionToken;
      }
      members.unshift(this.createNestedPropertyGetter(m));
    });

    if (members.some((m) => m.isNested)) {
      members.unshift(this.createNestedCache());
    }

    return members;
  }

  createNestedCache(): Property {
    return new Property([
      new Decorator(
        new Call(new Identifier(Decorators.Mutable), [], []),
        this.context,
      ),
    ],
    [],
    new Identifier('cachedNested'),
    undefined,
    undefined,
    new SimpleExpression('__collectChildren(props.children)'));
  }

  createGetAccessor(
    name: Identifier,
    type: TypeExpression,
    block: Block,
  ): GetAccessor {
    return new GetAccessor(undefined, undefined, name, [], type, block);
  }

  createRestPropsGetter(members: BaseClassMember[]): GetAccessor {
    const props = getProps(members);
    let additionalBindings = [
      new BindingElement(
        SyntaxKind.DotDotDotToken,
        undefined,
        new Identifier('restProps'),
      ),
    ];

    // TODO: remove it after overlay components are renovated
    if (isComponentWrapper(this.context.imports)) {
      additionalBindings = [new BindingElement(
        undefined,
        undefined,
        new Identifier('isReactComponentWrapper'),
      ), ...additionalBindings];
    }

    const bindingElements = [...props
      .reduce<BindingElement[]>((bindingElements, p) => {
      if (p._name.toString() === 'export') {
        bindingElements.push(
          new BindingElement(undefined, p._name, 'exportProp'),
        );
      } else {
        bindingElements.push(
          new BindingElement(undefined, undefined, p._name),
        );
      }
      return bindingElements;
    }, []), ...additionalBindings];

    const statements = [
      new VariableStatement(
        undefined,
        new VariableDeclarationList(
          [
            new VariableDeclaration(
              new BindingPattern(bindingElements, 'object'),
              undefined,
              new PropertyAccess(
                new SimpleExpression('this'),
                new Identifier('props'),
              ),
            ),
          ],
          SyntaxKind.ConstKeyword,
        ),
      ),
      new ReturnStatement(new TypeCast(new SimpleExpression('restProps'), 'RestProps')),
    ];

    return this.createGetAccessor(
      new Identifier('restAttributes'),
      new SimpleTypeExpression('RestProps'),
      new Block(statements, true),
    );
  }

  compileImportStatements(hooks: string[], compats: string[], core: string[]): string[] {
    const imports = ["import * as React from 'react'"];
    const namedImports = hooks
      .concat(compats)
      .concat(core);
    if (namedImports.length) {
      imports.push(`import {${namedImports.join(',')}} from 'react'`);
    }
    imports.push('import { normalizeStyles } from \'@devextreme/runtime/common\'');
    if (this.props.some((p) => p.isTemplate) && !isComponentWrapper(this.context.imports)) {
      const runTimeImports = isComponentWrapper(this.context.imports) ? 'getWrapperTemplate' : 'getTemplate';
      imports.push(`import { ${runTimeImports} } from '@devextreme/runtime/react'`);
    }
    return imports;
  }

  compileApiRefImports(imports: string[]): void {
    const result: Set<string> = new Set<string>();
    if (this.apiRefs.length) {
      this.apiRefs.forEach((ref) => {
        const refType = ref.compileRefType();
        const baseComponent = this.context.components![
          refType
        ] as ReactComponent;
        if (this.context.dirname) {
          const relativePath = getModuleRelativePath(
            this.context.dirname,
            baseComponent.context.path!,
          );
          result.add(
            `import {${baseComponent.name
            }Ref as ${refType}Ref} from "${this.processModuleFileName(
              relativePath.replace(path.extname(relativePath), ''),
            )}"`,
          );
        }
      });
      imports.splice(-1, 0, ...result);
    }
  }

  compileImports(): string {
    const imports: string[] = [];
    const hooks: string[] = [];
    const compats: string[] = [];
    const core: string[] = [];

    if (
      this.internalState.length
      || this.state.length
      || this.members.some((m) => m.isProvider)
    ) {
      hooks.push('useState');
    }

    if (this.members.some((m) => m.isConsumer)) {
      hooks.push('useContext');
    }

    const memorizedGetters = this.methods.reduce((arr, method) => (method instanceof GetAccessor
      && method.isMemorized(this.getToStringOptions(), false)
      ? [...arr, method]
      : arr),
    [] as BaseMethod[]);

    if (this.listeners.length || this.methods.length > memorizedGetters.length) {
      hooks.push('useCallback');
    }

    if (memorizedGetters.length) {
      hooks.push('useMemo');
    }

    if (getSubscriptions(this.listeners).length || this.effects.length) {
      hooks.push('useEffect');
    }

    if (this.refs.length || this.apiRefs.length || this.mutable.length) {
      hooks.push('useRef');
    }

    if (this.members.filter((a) => a.isApiMethod).length) {
      hooks.push('useImperativeHandle');
      compats.push('forwardRef');
    }

    if (this.members.some((m) => m.isNested)) {
      imports.push("import { __collectChildren, equalByValue } from '@devextreme/runtime/react'");
    }

    this.compileApiRefImports(imports);

    this.compileDefaultOptionsImport(imports);

    return imports
      .concat(this.compileImportStatements(hooks, compats, core))
      .join(';\n');
  }

  defaultPropsDest(): string {
    return `${this.name.toString()}.defaultProps`;
  }

  compileConvertRulesToOptions(rules: string | Expression): string {
    return this.state.length
      ? `__processTwoWayProps(convertRulesToOptions<${this.getPropsType()}>(${rules}))`
      : `convertRulesToOptions<${this.getPropsType()}>(${rules})`;
  }

  compileDefaultPropsObjectProperties(): string[] {
    const defaultProps = this.props
      .filter((p) => !p.inherited && p.initializer)
      .map((p) => (p as Property).defaultProps());

    if (this.defaultOptionRules && this.needGenerateDefaultOptions) {
      defaultProps.push(
        `...${this.compileConvertRulesToOptions(this.defaultOptionRules)}`,
      );
    }

    return defaultProps;
  }

  getDefaultPropsName(): string {
    const baseDefaultPropsObj = this.heritageClauses
      .filter((h) => h.defaultProps.length)[0]?.defaultProps[0];
    const defaultProps = this.compileDefaultPropsObjectProperties();

    let defaultPropsObj = baseDefaultPropsObj;

    if (defaultProps.length) {
      defaultPropsObj = `{ ${defaultProps.join(',\n')} }`;
      if (baseDefaultPropsObj) {
        if (this.needGenerateDefaultOptions) {
          defaultPropsObj = compileGettersCompatibleExtend(baseDefaultPropsObj, defaultPropsObj,
            this.compileConvertRulesToOptions('__defaultOptionRules'));
        } else {
          defaultPropsObj = compileGettersCompatibleExtend(baseDefaultPropsObj, defaultPropsObj);
        }
      }
    } else if (this.needGenerateDefaultOptions) {
      defaultPropsObj = compileGettersCompatibleExtend(baseDefaultPropsObj,
        this.compileConvertRulesToOptions('__defaultOptionRules'));
    }
    return defaultPropsObj;
  }

  compileDefaultProps(): string {
    if (this.needGenerateDefaultOptions && this.state.length) {
      return `function __processTwoWayProps(defaultProps: ${this.compilePropsType()}){
        const twoWayProps:string[] = [${this.state.map(
    (s) => `"${s.name}"`,
  )}];

        return Object.keys(defaultProps).reduce((props, propName)=>{
            const propValue = (defaultProps as any)[propName];
            const defaultPropName = twoWayProps.some(p=>p===propName) ? "default"+propName.charAt(0).toUpperCase() + propName.slice(1): propName;
            (props as any)[defaultPropName] = propValue;
            return props;
        }, {});
    }`;
    }
    return '';
  }

  stateDeclaration(): string {
    return `${this.state
      .concat(this.internalState)
      .concat(this.mutable)
      .map((p) => p.toString(this.getToStringOptions()))
      .join(';\n')}`;
  }

  compileUseEffect(): string {
    const subscriptions = getSubscriptions(this.listeners);

    let subscriptionsString = '';
    if (subscriptions.length) {
      const { add, cleanup } = subscriptions.reduce(
        ({ add, cleanup }, s) => {
          (add as string[]).push(
            `${s.target}.addEventListener(${s.eventName}, ${s.name});`,
          );
          (cleanup as string[]).push(
            `${s.target}.removeEventListener(${s.eventName}, ${s.name});`,
          );
          return { add, cleanup };
        },
        { add: [], cleanup: [] },
      );

      subscriptionsString = `useEffect(()=>{
                      ${add.join('\n')}
                      return function cleanup(){
                          ${cleanup.join('\n')}
                      }
                  });`;
    }
    const options = this.getToStringOptions();

    return (
      subscriptionsString
      + this.effects
        .map(
          (e) => `useEffect(${e.arrowDeclaration(
            options,
          )}${calculateMethodDependencyString(e, options)})`,
        )
        .join(';\n')
    );
  }

  compileComponentRef(): string {
    const api = this.members.filter((a) => a.isApiMethod);
    if (api.length) {
      return `export type ${this.name}Ref = {${api.map((a) => a.typeDeclaration())}}`;
    }
    return '';
  }

  compileUseImperativeHandle(): string {
    const api = this.members.reduce(
      (r: { methods: string[]; deps: string[] }, a) => {
        if (a.isApiMethod) {
          r.methods.push(`${a._name}: ${a.name}`);

          r.deps = [...new Set(r.deps.concat(a.name))];
        }

        return r;
      },
      { methods: [], deps: [] },
    );

    return api.methods.length
      ? `useImperativeHandle(ref, () => ({${api.methods.join(
        ',\n',
      )}}), [${api.deps.join(',')}])`
      : '';
  }

  compileUseRef(): string {
    return this.refs
      .concat(this.apiRefs)
      .map((a) => a.toString(this.getToStringOptions()))
      .join(';\n');
  }

  compileComponentInterface(): string {
    const props = this.isJSXComponent
      ? [`props: ${this.getModelPropsName()} & RestProps`]
      : [];
    const forwardRefApiProps = this.members.filter((m) => m.inherited && m.isApiRef);
    return `interface ${this.name}{
              ${props
    .concat(
      this.members
        .filter(
          (m) => !m.inherited
                && !m.isEffect
                && !m.isApiMethod
                && !m.isPrivate
                && !m.isMutable,
        )
        .concat(forwardRefApiProps)
        .map((m) => m.typeDeclaration()),
    )
    .join(';\n')}
          }`;
  }

  compileTemplateGetter(): string {
    return '';
  }

  getTemplateRender(name: string): string {
    return `getTemplate(props.${name}, props.${getTemplatePropName(
      name,
      'render',
    )}, props.${getTemplatePropName(name, 'component')})`;
  }

  processTemplates(): string[] {
    return this.props
      .filter((p) => p.isTemplate && !isComponentWrapper(this.context.imports))
      .map(
        (t) => `${t.name}: ${this.getTemplateRender(t.name)}`,
      );
  }

  compileViewModelArguments(): string {
    const toStringOptions: toStringOptions = this.getToStringOptions();
    const compileState = (state: BaseClassMember[], context = '') => state
      .filter((s) => !s.isPrivate)
      .map((s) => {
        if (
          s._name.toString() !== s.getter(toStringOptions.newComponentContext, toStringOptions)
        ) {
          const expression = context
            ? new PropertyAccess(
              new SimpleExpression('this'),
              new Identifier(context),
            )
            : new SimpleExpression('this');
          return new PropertyAssignment(
            s._name,
            new PropertyAccess(expression, s._name),
          );
        }
        return new ShorthandPropertyAssignment(s._name);
      })
      .map((p) => p.toString(toStringOptions));

    const state = compileState(this.state, 'props');
    const internalState = compileState(this.internalState);

    const template = this.processTemplates();

    const nestedProps = this.members
      .filter((m) => m.isNested)
      .map((n) => `${n.name}: ${n.getter(undefined, toStringOptions)}`);

    const props = this.isJSXComponent
      ? [
        `props:{${['...props']
          .concat(state)
          .concat(template)
          .concat(nestedProps)
          .join(',\n')}}`,
      ].concat(internalState)
      : ['...props'].concat(internalState).concat(state).concat(nestedProps);

    const listenersAndRefs: BaseClassMember[] = [
      ...this.listeners,
      ...this.refs,
      ...this.apiRefs,
    ];
    const statements = props
      .concat(
        listenersAndRefs.map(
          (r) => `${r._name.toString()}:${processComponentContext(
            toStringOptions.newComponentContext,
          )}${r.name.toString()}`,
        ),
      )
      .concat(
        this.members
          .filter(
            (m) => (m.isConsumer || m.isProvider) && !(m instanceof GetAccessor),
          )
          .map((m) => (toStringOptions.newComponentContext
            ? `${m.name}:${m.getter(toStringOptions.componentContext, toStringOptions)}`
            : m.name.toString())),
      )
      .concat(compileState(this.methods.filter((m) => !m.isPrivate)));
    return `{${statements.join(',\n')}}`;
  }

  compileRestProps(): string {
    return `type RestProps = {
      className?: string;
      style?: { [name: string]: any },
      key?: any,
      ref?: any,
      ${isComponentWrapper(this.context.imports) ? 'isReactComponentWrapper?: boolean' : ''}
    }`;
  }

  getPropsType(): string {
    if (this.isJSXComponent) {
      const type = this.heritageClauses[0].types[0];
      if (
        type.expression instanceof Call
        && type.expression.typeArguments?.length
      ) {
        return type.expression.typeArguments[0].toString();
      }

      return this.compileDefaultOptionsPropsType();
    }
    return `{${[
      ...this.props,
      ...this.state,
      ...this.slots,
    ].map((p) => p.typeDeclaration()).join(',\n')}
    }`;
  }

  getPropsTypeName(): string {
    if (this.isJSXComponent) {
      const type = this.heritageClauses[0].types[0];
      if (
        type.expression instanceof Call
        && type.expression.typeArguments?.length
      ) {
        const componentPropsType = type.expression.typeArguments[0] as TypeReferenceNode;
        return `${componentPropsType.typeName}`;
      }

      return `${this.heritageClauses[0].propsType}`;
    }
    return `{${[
      ...this.props,
      ...this.state,
      ...this.slots,
    ].map((p) => p.typeDeclaration()).join(',\n')}
    }`;
  }

  compilePropsType(): string {
    return this.getPropsType().concat(' & RestProps');
  }

  compileDefaultOptionsPropsType(): string {
    const heritageClause = this.heritageClauses[0];
    return `typeof ${heritageClause.propsType}`;
  }

  getToStringOptions(): toStringOptions {
    return {
      members: this.members,
      componentContext: 'this',
      newComponentContext: '',
    };
  }

  getNestedExports(component: ComponentInput, name: string, propName: string): string {
    return `export const ${name}: React.FunctionComponent<typeof ${component.name}> & { propName: string } = () => null;
      ${name}.propName="${propName}"
      ${name}.defaultProps=${component.name}`;
  }

  collectNestedComponents() {
    return super.collectNestedComponents() as {
      component: ComponentInput;
      name: string;
      propName: string;
    }[];
  }

  compileNestedComponents(): string {
    const collectedComponents = this.collectNestedComponents();
    if (collectedComponents.length) {
      const imports = this.getNestedImports(
        collectedComponents.map(({ component }) => component),
      );
      const nestedComponents = collectedComponents.map(
        ({ component, name, propName }) => this.getNestedExports(component, name, propName),
      );

      return imports.concat(nestedComponents).join('\n');
    }
    return '';
  }

  createNestedPropertyGetter(property: Property): GetAccessor {
    const propName = getPropName(property.name);
    const isArray = isTypeArray(property.type);
    const indexGetter = isArray ? '' : '?.[0]';
    const undefinedType = property.initializer ? '' : ' | undefined';

    const getterName = `__getNested${capitalizeFirstLetter(property.name)}`;
    const getterType = property.type.toString();

    const statements = [
      new VariableStatement(
        undefined,
        new VariableDeclarationList(
          [
            new VariableDeclaration(
              new BindingPattern(
                [
                  new BindingElement(
                    undefined,
                    undefined,
                    new Identifier(property.name),
                  ),
                ],
                'object',
              ),
              undefined,
              new PropertyAccess(
                new SimpleExpression('this'),
                new Identifier('props'),
              ),
            ),
            new VariableDeclaration(
              new Identifier('nested'),
              undefined,
              new SimpleExpression('__collectChildren(props.children)'),
            ),
          ],
          SyntaxKind.ConstKeyword,
        ),
      ),
      new If(new SimpleExpression('!equalByValue(cachedNested.current, nested)'),
        new SimpleExpression('cachedNested.current = nested')),
      new ReturnStatement(
        new Conditional(
          new SimpleExpression(propName),
          new SimpleExpression(propName),
          new Conditional(
            new SimpleExpression(`cachedNested.current.${property.name}`),
            new SimpleExpression(`cachedNested.current.${property.name}${indexGetter}`),
            new SimpleExpression(
              `${property.initializer
                ? `props?.__defaultNestedValues?.${property.name}`
                : 'undefined'
              }`,
            ),
          ),
        ),
      ),
    ];
    return new GetAccessor(
      undefined,
      undefined,
      new Identifier(getterName),
      [],
      new SimpleTypeExpression(`${getterType}${undefinedType}`),
      new Block(statements, true),
    );
  }

  compilePortalComponentCore(): string {
    return `
    type PortalProps = {
      container?: HTMLElement | null;
      children: React.ReactNode,
    }
    const Portal = ({ container, children }: PortalProps): React.ReactPortal | null => {
      if(container) {
        return createPortal(children, container);
      }
      return null;
    }`;
  }

  compilePortalComponent(): string {
    if (!this.containsPortal()) {
      return '';
    }
    return this.compilePortalComponentCore();
  }

  compileProviders(providers: Property[], viewCallExpression: string): string {
    return providers.reduce(
      (result, p) => `<${p.context}.Provider value={${p.getter()}}>
            ${result}
          </${p.context}.Provider>`,
      `{${viewCallExpression}}`,
    );
  }

  compileViewCall(): string {
    const viewFunction = this.context.viewFunctions?.[this.view];
    const callView = `${this.view}(
        ${viewFunction?.parameters.length
    ? `${this.viewModel}(
                ${this.compileViewModelArguments()}
            )`
    : ''
}
    )`;

    const providers = this.members.filter((m) => m.isProvider) as Property[];

    if (providers.length) {
      return this.compileProviders(providers, callView);
    }

    return callView;
  }

  compileFunctionalComponentType(): string {
    return `React.FC<${this.compilePropsType()} & { ref?: React.Ref<${this.name}Ref> }>`;
  }

  compileGettersAndMethods(): string {
    const methods = this.listeners
      .concat(this.methods)
      .concat(
        this.members.filter(
          (m) => m.isApiMethod,
        ) as Array<Method>,
      );
    const recursiveLevel = 10000;

    const methodsWithDep = methods.map((m) => ({
      method: m,
      deps: m.getDependency({
        members: this.members,
        componentContext: SyntaxKind.ThisKeyword,
      }),
    }));
    function level(
      m: {
        method: BaseMethod,
        deps: Dependency[],
      },
      previousDep: Dependency[],
    ): number {
      if (m.deps.includes(m.method) || previousDep.includes(m.method)) {
        return recursiveLevel;
      }
      const dependantMethods = methodsWithDep.filter(
        (method) => m.deps.some((dep) => dep === method.method),
      );
      if (dependantMethods.length === 0) {
        return 0;
      }
      return Math.max(
        ...dependantMethods.map((method) => level(method, [...previousDep, m.method])),
      ) + 1;
    }
    const methodsWithDepLevelCounted = methodsWithDep.map((m) => ({
      method: m.method,
      deps: m.deps,
      level: level(m, []),
    })).sort((a, b) => (a.level - b.level));

    return methodsWithDepLevelCounted.map(
      (methodWithDeps) => {
        const method = methodWithDeps.method;
        const options = this.getToStringOptions();
        if (methodWithDeps.level >= recursiveLevel) {
          return method.declaration(options);
        }
        const isMemorized = method instanceof GetAccessor && method.isMemorized(options, false);
        return `const ${method.name} = ${isMemorized ? 'useMemo' : 'useCallback'}(
          ${method.declaration(options)}${calculateMethodDependencyString(method, options)});`;
      },
    )
      .join('\n');
  }

  hasModelPropsType(): boolean {
    return this.isJSXComponent && this.optionalMembers.length > 0;
  }

  getModelPropsName(): string {
    if (this.hasModelPropsType()) {
      return `${this.getPropsTypeName()}Model`;
    }
    return `Required<GetPropsType<${this.getPropsType()}>>`;
  }

  compileModelPropsType(): string {
    if (this.hasModelPropsType()) {
      const optionalProps = this.optionalMembers
        .map((p) => `'${p.name}'`)
        .join(' | ');

      const modelPropTypeDeclaration = `type ${this.getModelPropsName()} = 
      Required<Omit<GetPropsType<${this.getPropsType()}>, ${optionalProps}>> & 
      Partial<Pick<GetPropsType<${this.getPropsType()}>, ${optionalProps}>>;`;
      return modelPropTypeDeclaration;
    }
    return '';
  }

  compileInPropsNormalization(): string {
    const defaultPropName = this.getDefaultPropsName();
    if (defaultPropName) {
      return `const props = combineWithDefaultProps<${this.getModelPropsName()}>(${defaultPropName}, inProps)`;
    }
    return '';
  }

  compileComponentFunctionDefinition(): string {
    const propsNormalization = this.compileInPropsNormalization();
    const propsName = propsNormalization ? `inProps: ${this.compilePropsType()}` : `props: ${this.compilePropsType()}`;
    const hasApiMethod = this.members.some((m) => m.isApiMethod);
    return `${!hasApiMethod
      ? `${this.modifiers.join(' ')} function ${this.name
      }(${propsName}){`

      : `const ${this.name} = forwardRef<${this.name
      }Ref, ${this.compilePropsType()}>(function ${lowerizeFirstLetter(
        this.name,
      )}(${propsName}, ref){`
    }
    ${propsNormalization}`;
  }

  toString(): string {
    const getTemplateFunc = this.compileTemplateGetter();
    return `
              ${this.compileImports()}
              ${this.compilePortalComponent()}
              ${this.compileNestedComponents()}
              ${this.compileComponentRef()}
              ${this.compileRestProps()}
              ${this.compileModelPropsType()}
              ${this.compileComponentInterface()}
              ${getTemplateFunc}
              ${this.compileComponentFunctionDefinition()}
                  ${this.compileUseRef()}
                  ${this.stateDeclaration()}
                  ${this.members
    .filter(
      (m) => (m.isConsumer || m.isProvider)
            && !(m instanceof GetAccessor),
    )
    .map((m) => m.toString(this.getToStringOptions()))
    .join(';\n')}
                  ${this.compileGettersAndMethods()}
                  ${this.compileUseEffect()}
                  ${this.compileUseImperativeHandle()}
                  return ${this.compileViewCall()}
              ${this.members.filter((m) => m.isApiMethod).length === 0
    ? '}'
    : `}) as ${this.compileFunctionalComponentType()};\n${this.modifiers.join(
      ' ',
    )} ${this.modifiers.join(' ') === 'export'
      ? `{${this.name}}`
      : this.name
    };`
}

              ${this.compileDefaultComponentExport()}

              ${this.compileDefaultProps()}
              ${this.compileDefaultOptionsMethod()}`;
  }
}
