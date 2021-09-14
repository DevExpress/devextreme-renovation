import { Decorators } from '../decorators';
import { SyntaxKind } from '../syntaxKind';
import { GeneratorContext, toStringOptions } from '../types';
import { warn } from '../utils/messages';
import { getModuleRelativePath } from '../utils/path-utils';
import { capitalizeFirstLetter, compileType, removePlural } from '../utils/string';
import { Expression, SimpleExpression } from './base';
import { BindingElement, BindingPattern } from './binding-pattern';
import {
  Class, Heritable, HeritageClause, inheritMembers,
} from './class';
import {
  BaseClassMember, GetAccessor, Method, Property,
} from './class-members';
import { Call, Identifier } from './common';
import { ComponentInput } from './component-input';
import { Decorator } from './decorator';
import { BaseFunction, getViewFunctionBindingPattern } from './functions';
import { ObjectLiteral } from './literal';
import { Block, ReturnStatement } from './statements';
import { extractComplexType, isTypeArray, TypeExpression } from './type';

export function isJSXComponent(heritageClauses: HeritageClause[]) {
  return heritageClauses.some((h) => h.isJsxComponent);
}

export function getProps(members: BaseClassMember[]): Property[] {
  return members.filter((m) => m.decorators.find(
    (d) => d.name === Decorators.OneWay
        || d.name === Decorators.TwoWay
        || d.name === Decorators.Nested
        || d.name === Decorators.Event
        || d.name === Decorators.Template
        || d.name === Decorators.Slot
        || d.name === Decorators.ForwardRefProp
        || d.name === Decorators.RefProp,
  )) as Property[];
}

export class Component extends Class implements Heritable {
  props: Property[] = [];

  modelProp?: Property;

  state: Property[] = [];

  internalState: Property[];

  mutable: Property[];

  refs: Property[];

  apiRefs: Property[];

  listeners: Method[];

  methods: Method[];

  effects: Method[];

  slots: Property[];

  view: any;

  viewModel: any;

  isSVGComponent: boolean;

  context: GeneratorContext;

  defaultOptionRules?: Expression | null;

  get name() {
    return this._name.toString();
  }

  addPrefixToMembers(members: Array<Property | Method>) {
    members
      .filter((m) => !m.inherited && m instanceof GetAccessor)
      .forEach((m) => {
        m.prefix = '__';
      });
    return members;
  }

  get needGenerateDefaultOptions(): boolean {
    /* NOTE: return 'false' only when:
        - no 'defaultOptionsModule' in generator options
        - component decorator 'defaultOptionRules' parameter is equal to 'null'
    */
    return (
      !!this.context.defaultOptionsModule
      && (!this.defaultOptionRules
        || this.defaultOptionRules.toString() !== 'null')
    );
  }

  processMembers(members: Array<Property | Method>) {
    members = members.map((m) => {
      if (
        m instanceof Property
        && m.decorators.length === 0
        && m.initializer instanceof BaseFunction
      ) {
        const body = m.initializer.body instanceof Block
          ? m.initializer.body
          : new Block(
            [new ReturnStatement(m.initializer.body as Expression)],
            true,
          );

        return new Method(
          [],
          m.modifiers,
          undefined,
          m._name,
          undefined,
          [],
          m.initializer.parameters,
          m.initializer.type,
          body,
        );
      }
      return m;
    });

    const api = members.filter((m) => m.decorators.find((d) => d.name === 'Method'));
    const props = inheritMembers(this.heritageClauses, []) as Property[];

    const requiredProps = props.filter(
      (p) => p.questionOrExclamationToken === SyntaxKind.ExclamationToken,
    );

    if (requiredProps.length) {
      const requiredPropsList = this.heritageClauses[0].requiredProps;

      if (
        requiredProps.some((p) => !requiredPropsList.find((n) => p.name === n))
      ) {
        warn(`${
          this.name
        } component declaration is not correct. Props have required properties. Include their keys to declaration
          ${this.name} extends JSXComponent<${
  this.heritageClauses[0].propsType
}, ${requiredProps.map((p) => `"${p.name}"`).join('|')}>
        `);
      }
    }

    api
      .filter((m) => props.some((p) => p._name.toString() === m._name.toString()))
      .forEach((a) => {
        warn(
          `Component ${this.name} has Prop and Api method with same name: ${a._name}`,
        );
      });

    members = super.processMembers(
      this.addPrefixToMembers(members).concat(props),
    );

    const restPropsGetter = this.createRestPropsGetter(members);
    restPropsGetter.prefix = '__';
    members.push(restPropsGetter);
    return members;
  }

  constructor(
    decorator: Decorator,
    modifiers: string[] = [],
    name: Identifier,
    typeParameters: TypeExpression[] | string[] | undefined,
    heritageClauses: HeritageClause[] = [],
    members: Array<Property | Method>,
    context: GeneratorContext,
  ) {
    super(
      [decorator],
      modifiers,
      name,
      typeParameters,
      heritageClauses.filter((h) => h.token === SyntaxKind.ExtendsKeyword),
      members,
      context,
    );
    members = this.members;
    this.props = members.filter((m) => m.decorators.find(
      (d) => d.name === 'OneWay' || d.name === 'Event' || d.name === 'Template',
    )) as Property[];

    const refs = (members.filter((m) => m.isRef) as Property[]).reduce(
      (r: { refs: Property[]; apiRefs: Property[] }, p) => {
        if (
          context.components
          && context.components[p.compileRefType()] instanceof Component
        ) {
          p.decorators.find(
            (d) => d.name === 'Ref',
          )!.expression.expression = new SimpleExpression('ApiRef');
          r.apiRefs.push(p as Property);
        } else {
          r.refs.push(p as Property);
        }
        return r;
      },
      { refs: [], apiRefs: [] },
    );
    this.refs = refs.refs;
    this.apiRefs = refs.apiRefs;

    this.internalState = members.filter((m) => m.isInternalState) as Property[];

    this.state = members.filter((m) => m.isState) as Property[];

    this.mutable = members.filter((m) => m.isMutable) as Property[];

    const modelProps = this.state.filter((m) => m.decorators.find(
      (d) => (d.expression.arguments[0] as ObjectLiteral)
        ?.getProperty('isModel')
        ?.toString() === 'true',
    ));

    if (modelProps.length > 1) {
      throw `There should be only one model prop. Props marked as isModel: ${modelProps
        .map((s) => s._name)
        .join(', ')}`;
    }

    this.modelProp = modelProps[0] || this.state.find((s) => s._name.toString() === 'value');

    this.methods = members.filter(
      (m) => (m instanceof Method && m.decorators.length === 0)
        || m instanceof GetAccessor,
    ) as Method[];

    this.listeners = members.filter((m) => m.decorators.find((d) => d.name === 'Listen')) as Method[];

    this.effects = members.filter((m) => m.isEffect) as Method[];

    this.slots = members.filter((m) => m.isSlot) as Property[];

    this.view = decorator.getParameter('view');
    this.viewModel = decorator.getParameter('viewModel') || '';

    this.defaultOptionRules = decorator.getParameter('defaultOptionRules');

    this.isSVGComponent = decorator.getParameter('isSVG')?.valueOf().toString() === 'true';

    this.context = context;

    if (context.defaultOptionsImport) {
      context.defaultOptionsImport.add('convertRulesToOptions');
      context.defaultOptionsImport.add('Rule');
    }
  }

  compileDefaultProps() {
    return '';
  }

  get heritageProperties() {
    return getProps(this.members)
      .map((p) => p as Property)
      .map((p) => {
        const property = new Property(
          p.decorators,
          p.modifiers,
          p._name,
          p.questionOrExclamationToken,
          p.type,
          p.initializer,
        );
        property.inherited = true;
        return property;
      });
  }

  defaultPropsDest() {
    return '';
  }

  createRestPropsGetter(_members: BaseClassMember[]) {
    return new GetAccessor(
      undefined,
      undefined,
      new Identifier('restAttributes'),
      [],
      undefined,
      new Block([new SimpleExpression('return {}')], true),
    );
  }

  compileDefaultOptionsImport(imports: string[]): void {
    if (
      !this.context.defaultOptionsImport
      && this.needGenerateDefaultOptions
      && this.context.defaultOptionsModule
      && this.context.dirname
    ) {
      const relativePath = getModuleRelativePath(
        this.context.dirname,
        this.context.defaultOptionsModule,
      );
      imports.push(
        `import {convertRulesToOptions, Rule} from "${relativePath}"`,
      );
    }
  }

  compilePropsType() {
    return (this.isJSXComponent
      ? this.heritageClauses[0].types[0].type
      : this.name
    ).toString();
  }

  compileDefaultOptionsPropsType() {
    return this.compilePropsType();
  }

  compileDefaultOptionsRuleTypeName() {
    const defaultOptionsTypeName = `${this.name}OptionRule`;
    return defaultOptionsTypeName;
  }

  compileDefaultOptionRulesType() {
    const defaultOptionsTypeArgument = this.compileDefaultOptionsPropsType();
    return `type ${this.compileDefaultOptionsRuleTypeName()} = DefaultsRule<${defaultOptionsTypeArgument}>;`;
  }

  compileDefaultOptionsMethod(
    defaultOptionRulesInitializer = '[]',
    statements: string[] = [],
  ) {
    if (this.needGenerateDefaultOptions) {
      const defaultOptionsTypeName = this.compileDefaultOptionsRuleTypeName();
      return `${this.compileDefaultOptionRulesType()}

            const __defaultOptionRules${compileType(
    defaultOptionsTypeName ? `${defaultOptionsTypeName}[]` : '',
  )} = ${defaultOptionRulesInitializer};
            export function defaultOptions(rule${compileType(
    defaultOptionsTypeName,
  )}) {
                __defaultOptionRules.push(rule);
                ${statements.join('\n')}
            }`;
    }
    return '';
  }

  compileDefaultComponentExport() {
    return this.modifiers.join(' ') === 'export'
      ? `export default ${this.name}`
      : '';
  }

  processModuleFileName(module: string) {
    return module;
  }

  get isJSXComponent() {
    return isJSXComponent(this.heritageClauses);
  }

  getMeta() {
    const memberName = (member: BaseClassMember) => member._name.toString();
    const props = getProps(this.members);
    return {
      name: this.name,
      decorator: (this.decorators[0].expression
        .arguments[0] as ObjectLiteral).toObject(),
      props: {
        allProps: props.map(memberName),
        oneWay: props
          .filter((m) => m._hasDecorator(Decorators.OneWay))
          .map(memberName),
        twoWay: props.filter((m) => m.isState).map(memberName),
        template: props.filter((m) => m.isTemplate).map(memberName),
        event: props.filter((m) => m.isEvent).map(memberName),
        ref: props.filter((m) => m.isRefProp).map(memberName),
        slot: props.filter((m) => m.isSlot).map(memberName),
      },
      api: this.members.filter((m) => m.isApiMethod).map(memberName),
    };
  }

  getJQueryBaseComponentName(): string | undefined {
    const jQueryProp = this.decorators[0].getParameter(
      'jQuery',
    ) as ObjectLiteral;
    const baseComponent = jQueryProp?.getProperty('component');
    return baseComponent?.toString();
  }

  containsPortal() {
    const viewFunctions = this.context.viewFunctions;
    if (viewFunctions) {
      return Object.keys(viewFunctions).some((key) => viewFunctions[key].containsPortal());
    }
    return false;
  }

  getNestedFromComponentInput(
    component: ComponentInput,
    parentName = '',
  ): {
      component: ComponentInput;
      name: string;
      propName?: string;
    }[] {
    const nestedProps = component.members.filter((m) => m.isNested);
    const components = component.context.components!;

    const nested = Object.keys(components).reduce(
      (acc, key) => {
        const property = nestedProps.find(
          ({ type }) => extractComplexType(type) === key,
        ) as Property;
        if (property) {
          const componentName = capitalizeFirstLetter(
            isTypeArray(property.type)
              ? removePlural(property.name)
              : property.name,
          );
          acc.push({
            component: components[key] as ComponentInput,
            name: `${parentName}${componentName}`,
            propName: property.name,
          });
        }
        return acc;
      },
      [] as {
        component: ComponentInput;
        name: string;
        propName?: string;
      }[],
    );

    return nested.concat(
      nested.reduce(
        (acc, { component, name }) => acc.concat(this.getNestedFromComponentInput(component, name)),
        [] as {
          component: ComponentInput;
          name: string;
          propName?: string;
        }[],
      ),
    );
  }

  collectNestedComponents() {
    if (this.members.some((m) => m.isNested)) {
      const components = this.context.components!;
      const heritage = this.heritageClauses[0].typeNodes[0] as Call;
      const inheritFrom = heritage.typeArguments?.length
        ? (heritage.typeArguments[0] as any).typeName
        : heritage.arguments[0].toString();
      return this.getNestedFromComponentInput(
        components[inheritFrom] as ComponentInput,
      );
    }
    return [];
  }

  getNestedImports(components: ComponentInput[]) {
    const outerComponents = components.filter(
      ({ name }) => !this.context.components![name],
    );
    const imports = outerComponents.reduce(
      (acc, component) => {
        let relativePath = getModuleRelativePath(
          this.context.dirname!,
          component.context.path!,
        );
        relativePath = relativePath.slice(0, relativePath.lastIndexOf('.'));

        if (!acc[relativePath]) {
          acc[relativePath] = [];
        }
        acc[relativePath].push(component.name);

        return acc;
      },
      {} as {
        [x: string]: string[];
      },
    );

    const result = Object.keys(imports).map(
      (path) => `import { ${[...new Set(imports[path])]} } from "${path}";`,
    );

    return result;
  }

  extractGlobalsFromTemplate(
    template: string | undefined,
    delimiter = ': ',
  ): string[] {
    const globals = template
      ?.match(/(^|[^\w])global_\w+/gi)
      ?.map(
        (global) => `${global.replace(/[^\w]/, '')}${delimiter}${global.replace(
          /(^|[^\w])global_/,
          '',
        )}`,
      ) || [];
    return [...new Set(globals)];
  }

  returnGetAccessorBlock(
    _argumentPattern: BindingPattern,
    _options: toStringOptions,
    _spreadVar: BindingElement,
  ) {
    return new Block([], true);
  }

  getViewSpreadAccessor(members: Array<Property | Method>) {
    const viewFunction = this.decorators[0].getViewFunction();
    const argumentPattern = getViewFunctionBindingPattern(viewFunction);
    const spreadVar = argumentPattern.elements.find(
      (p: BindingElement) => p.dotDotDotToken === '...',
    );

    const props = getProps(members).filter(
      (m) => !argumentPattern.elements.some(
        (e) => !e.dotDotDotToken && e.name.toString() === m._name.toString(),
      ),
    );

    if (spreadVar) {
      return this.createViewSpreadAccessor(
        new Identifier(`${spreadVar.name.toString()}`),
        this.returnGetAccessorBlock(
          argumentPattern,
          { members: this.members },
          spreadVar,
        ),
        props,
      );
    } return undefined;
  }

  createViewSpreadAccessor(name: Identifier, body: Block, _props: Property[]) {
    return new GetAccessor(undefined, undefined, name, [], undefined, body);
  }
}
