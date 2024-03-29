import {
  SimpleExpression,
  BaseClassMember,
  Call,
  Identifier,
  Conditional,
  Decorator,
  ObjectLiteral,
  Binary,
  SyntaxKind,
  GeneratorContext,
  getModuleRelativePath,
  Component,
  getProps,
  Block,
  ReturnStatement,
  capitalizeFirstLetter,
  removePlural,
  PropertyAssignment,
  SpreadAssignment,
  SimpleTypeExpression,
  isTypeArray,
  ArrayTypeNode,
  VariableStatement,
  VariableDeclarationList,
  VariableDeclaration,
  BindingElement,
  BindingPattern,
  BaseFunction,
  TypeReferenceNode,
  Dependency,
} from '@devextreme-generator/core';
import { GetAccessor } from './class-members/get-accessor';
import { Method } from './class-members/method';
import { calculatePropertyType, Property } from './class-members/property';
import { PropsGetAccessor } from './class-members/props-get-accessor';
import { Function } from './functions/function';
import { Parameter } from './functions/parameter';
import { PropertyAccess } from './property-access';
import { getEventName } from './utils';
import { VueComponentInput } from './vue-component-input';
import { InitializedTemplateType, toStringOptions } from '../types';

export function getComponentListFromContext(context: GeneratorContext) {
  return Object.keys(context.components || {})
    .filter((k) => {
      const component = context.components?.[k];
      return component instanceof VueComponent;
    })
    .map((k) => context.components![k]) as VueComponent[];
}

export class VueComponent extends Component {
  template?: string;

  get exportedName() {
    return `Dx${this.name}`;
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

  createNestedChildrenCollector() {
    const statements = [
      new ReturnStatement(
        new SimpleExpression(
          `children.reduce((acc, child) => {
            const name = child.componentOptions?.Ctor?.extendOptions?.propName;
            const tag = child.tag || "";
            const isUnregisteredDxTag = tag.indexOf("Dx") === 0;
            if(name) {
              const collectedChildren = {};
              const defaultProps =
                child.componentOptions?.Ctor?.extendOptions?.defaultProps || {};
              const childProps = Object.assign(
                {},
                defaultProps,
                child.componentOptions.propsData
              );
              if(child.componentOptions.children) {
                __collectChildren(child.componentOptions.children).forEach(
                  ({ __name, ...cProps }) => {
                    if(__name) {
                      if (!collectedChildren[__name]) {
                        collectedChildren[__name] = [];
                      }
                      collectedChildren[__name].push(cProps);
                    }
                  }
                );
              };
  
              acc.push({
                ...collectedChildren,
                ...childProps,
                __name: name,
              });
            } else if (isUnregisteredDxTag) {
              throw new Error(\`Unknown custom element: <\${tag}> - did you register the component correctly?'\`);
            }
            return acc;
          }, [])`,
        ),
      ),
    ];

    return new Function(
      undefined,
      undefined,
      '',
      new Identifier('__collectChildren'),
      [],
      [
        new Parameter(
          [],
          [],
          '',
          new Identifier('children'),
          undefined,
          new ArrayTypeNode(new SimpleTypeExpression('Object')),
          undefined,
        ),
      ],
      new SimpleTypeExpression('{ [name:string]: any }[]'),
      new Block(statements, true),
      this.context,
    );
  }

  createNestedDefaultPropsExtractor() {
    const statements = [
      new ReturnStatement(
        new SimpleExpression(`Object.entries(propsObject)
        .filter(([key, value]) => value?.default)
        .reduce((accObj, [key, value]) => {
          accObj[key] = value.default();
          return accObj;
        }, {});`),
      ),
    ];
    return new Function(
      undefined,
      undefined,
      '',
      new Identifier('__extractDefaultValues'),
      [],
      [
        new Parameter(
          [],
          [],
          undefined,
          new Identifier('propsObject'),
          undefined,
          new ArrayTypeNode(new SimpleTypeExpression('Object')),
          undefined,
        ),
      ],
      new SimpleTypeExpression('{ [name:string]: any }'),
      new Block(statements, true),
      this.context,
    );
  }

  createNestedChildrenGetter() {
    const statements = [
      new ReturnStatement(
        new Conditional(
          new SimpleExpression('this.$slots.default'),
          new SimpleExpression('__collectChildren(this.$slots.default)'),
          new SimpleExpression('[]'),
        ),
      ),
    ];
    const result = new GetAccessor(
      [],
      undefined,
      new Identifier('__nestedChildren'),
      [],
      undefined,
      new Block(statements, true),
    );

    return result;
  }

  createPropsGetter(members: Array<Property | Method>) {
    const props = getProps(members).filter(
      (m) => m.name !== '__defaultNestedValues',
    );

    const propertyAssignments = props.map((p) => {
      const expression = p.isForwardRefProp
        ? new SimpleExpression(`this.${p.name}?.()`)
        : new PropertyAccess(
          new PropertyAccess(
            new Identifier(SyntaxKind.ThisKeyword),
            new Identifier('props'),
          ),
          p._name,
        );

      const propertyAssignment = new PropertyAssignment(p._name, expression);

      if (p.isOptional && calculatePropertyType(p.type) === 'Boolean') {
        return new SpreadAssignment(
          new Binary(
            new Binary(
              expression,
              SyntaxKind.ExclamationEqualsEqualsToken,
              new SimpleExpression(SyntaxKind.UndefinedKeyword),
            ),
            SyntaxKind.AmpersandAmpersandToken,
            new ObjectLiteral([propertyAssignment], false),
          ),
        );
      }

      return propertyAssignment;
    });

    const expression = new ObjectLiteral(propertyAssignments, true);

    return new GetAccessor(
      [],
      [],
      new Identifier('props'),
      [],
      undefined,
      new Block([new ReturnStatement(expression)], true),
    );
  }

  addPrefixToMembers(members: Array<Property | Method>) {
    members
      .filter((m) => !m.isApiMethod)
      .forEach((m) => {
        m.prefix = '__';
      });
    return members;
  }

  processMembers(members: Array<Property | Method>) {
    members = super.processMembers(members);
    members = members.reduce((members, m) => {
      if (m.isState) {
        const base = m as Property;
        members.push(
          new Property(
            [
              new Decorator(
                new Call(new Identifier('InternalState'), undefined, []),
                {},
              ),
            ],
            [],
            new Identifier(`${m._name}_state`),
            '',
            m.type,
            new SimpleExpression(`this.${base.name}`),
          ),
        );
      }
      if (m.isForwardRef || m.isForwardRefProp) {
        members.push(
          new Method(
            [],
            [],
            undefined,
            new Identifier(`forwardRef_${m.name}`),
            undefined,
            [],
            [new Parameter([], [], undefined, new Identifier('ref'))],
            undefined,
            new Block(
              [
                new SimpleExpression(`
              if(arguments.length){
                this.$refs.${m.name}=ref;
                ${m.isForwardRefProp ? `this.${m.name}?.(ref);` : ''}
              }
              return this.$refs.${m.name}
            `),
              ],
              true,
            ),
          ),
        );
      }
      return members;
    }, members);

    members.push(this.createPropsGetter(members));

    if (members.some((m) => m.isNested)) {
      members.push(this.createNestedChildrenGetter());
    }
    (members.filter((m) => m.isNested) as Property[]).forEach((m) => {
      members.push(this.createNestedPropertyGetter(m));
    });
    const spreadGetAccessor = this.getViewSpreadAccessor(members);
    if (spreadGetAccessor) {
      members.push(spreadGetAccessor);
    }
    return members;
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
      imports.push(`import {convertRulesToOptions} from "${relativePath}"`);
    }
  }

  returnGetAccessorBlock(
    argumentPattern: BindingPattern,
    _options: toStringOptions,
    spreadVar: BindingElement,
  ) {
    return new Block(
      [
        new VariableDeclarationList(
          [
            new VariableDeclaration(
              argumentPattern,
              undefined,
              new PropertyAccess(
                new SimpleExpression('this'),
                new Identifier('props'),
              ),
            ),
          ],
          'const',
        ),
        new ReturnStatement(new SimpleExpression(spreadVar.name.toString())),
      ],
      true,
    );
  }

  createViewSpreadAccessor(name: Identifier, body: Block, props: Property[]) {
    return new PropsGetAccessor(
      undefined,
      undefined,
      name,
      [],
      undefined,
      body,
      props,
    );
  }

  compileTemplate(methods: string[], options: toStringOptions) {
    const viewFunction = this.decorators[0].getViewFunction();
    if (viewFunction) {
      this.template = viewFunction.getTemplate(options);

      if (options.hasStyle) {
        this.methods.push(
          new Method(
            [],
            [],
            undefined,
            new Identifier('__processStyle'),
            undefined,
            [],
            [
              new Parameter(
                [],
                [],
                undefined,
                new Identifier('value'),
                undefined,
                undefined,
                undefined,
              ),
            ],
            undefined,
            new Block(
              [
                new ReturnStatement(
                  new SimpleExpression('normalizeStyles(value)'),
                ),
              ],
              true,
            ),
          ),
        );
      }

      const forwardRefs = this.members.filter((m) => m.isForwardRefProp);

      if (forwardRefs.length) {
        methods.push(`__forwardRef(){
          ${forwardRefs
    .filter((m) => options.forwardRefs?.some((forwardRef) => forwardRef === m))
    .map((m) => {
      const token = (m as Property).isOptional ? '?.' : '';
      return `this.${m._name}${token}(this.$refs.${m._name});`;
    })
    .join('\n')}
                }`);
      }
    }
  }

  generateProps() {
    if (this.isJSXComponent) {
      let props = this.heritageClauses[0].propsType.toString();

      if (this.needGenerateDefaultOptions) {
        props = `Object.keys(${props}).reduce((props, propName)=>({
                          ...props,
                          [propName]: {...${props}[propName]}
                        }), {})`;
      }

      return `props: ${props}`;
    }
    return '';
  }

  generateModel() {
    if (!this.modelProp) {
      return '';
    }
    return `model: {
              prop: "${this.modelProp._name}",
              event: "${getEventName(`${this.modelProp._name}Change`, [
    this.modelProp,
  ])}"
          }`;
  }

  generateData() {
    const statements: string[] = this.extractGlobalsFromTemplate(this.template);
    const states = ([] as Property[])
      .concat(this.internalState)
      .concat(this.mutable);
    if (states.length) {
      statements.push.apply(
        statements,
        states.map((i) => i.toString({
          members: this.members,
        })),
      );
    }

    if (statements.length) {
      return `data() {
                  return {
                      ${statements.join(',\n')}
                  };
              }`;
    }
    return '';
  }

  createNestedPropertyGetter(property: Property) {
    const isArray = isTypeArray(property.type);
    const indexGetter = isArray ? '' : '?.[0]';
    let nestedName = capitalizeFirstLetter(property.name);
    if (isArray) {
      nestedName = removePlural(nestedName);
    }
    const propName = `${SyntaxKind.ThisKeyword}.${property.name}`;
    const hasDefaultValues = property.isNested && property.initializer;
    const statements = [
      new VariableStatement(
        undefined,
        new VariableDeclarationList(
          [
            new VariableDeclaration(
              new Identifier('nested'),
              undefined,
              new SimpleExpression(
                `this.__nestedChildren.filter(child => child.__name === "${
                  property.name
                }")${
                  hasDefaultValues
                    ? `.map((n) => {
                          if (
                            !Object.keys(n).some(
                              (k) => k !== "__name" && k !== "__defaultNestedValues"
                            )
                          ) {
                            return n?.__defaultNestedValues || n;
                          }
                          return n;
                        });`
                    : ''
                }`,
              ),
            ),
          ],
          SyntaxKind.ConstKeyword,
        ),
      ),
      new ReturnStatement(
        new Conditional(
          new SimpleExpression(propName),
          new SimpleExpression(propName),
          new Conditional(
            new SimpleExpression('nested.length'),
            new SimpleExpression(`nested${indexGetter}`),
            new SimpleExpression(
              hasDefaultValues
                ? `this?.__defaultNestedValues?.${property.name}`
                : 'undefined',
            ),
          ),
        ),
      ),
    ];
    return new GetAccessor(
      undefined,
      undefined,
      new Identifier(`__getNested${nestedName}`),
      [],
      undefined,
      new Block(statements, true),
    );
  }

  generateComputed() {
    const statements: string[] = this.methods
      .filter((m) => m instanceof GetAccessor)
      .map((m) => m.toString({
        members: this.members,
        componentContext: 'this',
        newComponentContext: 'this',
      }));

    return `computed: {
              ${statements.join(',\n')},
           }`;
  }

  generateMethods(externalStatements: string[]) {
    const statements: string[] = [];

    statements.push.apply(
      statements,
      this.methods
        .filter((m) => m instanceof Method && !(m instanceof GetAccessor))
        .concat(this.effects)
        .concat(this.members.filter((m) => m.isApiMethod) as Method[])
        .map((m) => m.toString({
          members: this.members,
          componentContext: 'this',
          newComponentContext: 'this',
        })),
    );

    this.members
      .filter((m) => m.isEvent)
      .forEach((m) => {
        statements.push(`${m._name}(...args){
                  this.$emit("${getEventName(
    m._name,
    this.members.filter((m) => m.isState),
  )}", ...args);
              }`);
      });

    if (statements.length || externalStatements.length) {
      return `methods: {
        ${statements.concat(externalStatements).join(',\n')}
      }`;
    }

    return '';
  }

  generateWatch(methods: string[]) {
    const watches: { [name: string]: string[] } = {};

    const startMethodsLength = methods.length;

    this.effects.forEach((effect, index) => {
      let dependency = effect.getDependency({
        members: this.members,
        componentContext: SyntaxKind.ThisKeyword,
      });
      if (dependency.indexOf('props') > -1) {
        const props = getProps(this.members);
        dependency = dependency.filter(
          (d) => !(d instanceof BaseClassMember
              && props.includes(d as Property))
            || d.isState,
        );
        dependency = dependency.reduce((arr: Dependency[], dep) => {
          if (dep === 'props') {
            arr.push(...props);
          } else {
            arr.push(dep);
          }
          return arr;
        }, []);
      }

      const scheduleEffectName = `__schedule_${effect._name}`;

      if (dependency.length) {
        methods.push(`${scheduleEffectName}() {
                      this.__scheduleEffect(${index}, "${effect.name}");
                  }`);
      }

      dependency
        .map((dep) => (dep instanceof BaseClassMember ? dep._name.toString() : dep))
        .filter((d) => d !== 'props')
        .forEach((d) => {
          watches[d] = watches[d] || [];
          watches[d].push(`"${scheduleEffectName}"`);
        });
    });

    this.members
      .filter((m) => m.isProvider && m instanceof GetAccessor)
      .forEach((m) => {
        watches[m.name] = watches[m.name] || [];
        const methodName = `provide${capitalizeFirstLetter(m.name)}`;
        methods.push(`${methodName}(){
        this._provided.${m.context}.value = ${m.getter(SyntaxKind.ThisKeyword)}
      }`);
        watches[m.name].push(`"${methodName}"`);
      });

    if (methods.length !== startMethodsLength) {
      methods.push(
        `__scheduleEffect(index, name) {
            if(!this.__scheduleEffects[index]){
                this.__scheduleEffects[index]=()=>{
                    this.__destroyEffects[index]&&this.__destroyEffects[index]();
                    this.__destroyEffects[index]=this[name]();
                    this.__scheduleEffects[index] = null;
                }
                this.$nextTick(()=>this.__scheduleEffects[index]&&this.__scheduleEffects[index]());
            }
        }`,
      );
    }

    this.state.forEach((p) => {
      const stateName = p.name.toString();
      const stateWatcherName = `__${stateName}_watcher`;
      methods.push(`${stateWatcherName}(s) {
                      this.${stateName}_state = s;
                  }`);
      watches[stateName] = watches[stateName] || [];
      watches[stateName].push(`"${stateWatcherName}"`);
    });

    const watchStatements = Object.keys(watches).map((k) => `${k}: [
                  ${watches[k].join(',\n')}
              ]`);

    if (watchStatements.length) {
      return `watch: {
                  ${watchStatements.join(',\n')}
              }`;
    }

    return '';
  }

  generateComponents(components: string[] = []) {
    components = components.concat(
      Object.keys(this.context.components || {}).filter((k) => {
        const component = this.context.components?.[k];
        return component instanceof VueComponent && component !== this;
      }),
    );

    if (components.length) {
      return `components: {
                  ${components.join(',\n')}
              }`;
    }

    return '';
  }

  generateMounted() {
    const statements: string[] = [];

    if (this.members.filter((m) => m.isForwardRefProp).length) {
      statements.push('this.__forwardRef()');
    }

    this.effects.forEach((e, i) => {
      statements.push(`this.__destroyEffects[${i}]=this.${e.name}()`);
    });

    if (statements.length) {
      return `mounted(){
                  ${statements.join(';\n')}
              }`;
    }

    return '';
  }

  generateCreated() {
    const statements: string[] = [];

    if (this.effects.length) {
      statements.push('this.__destroyEffects=[]');
      statements.push('this.__scheduleEffects=[]');
    }

    const providers = this.members.filter((p) => p.isProvider) as Property[];
    if (providers.length) {
      statements.push(
        providers
          .map((p) => {
            if (!(p instanceof GetAccessor)) {
              return `this.${p.name} = this._provided.${p.context}`;
            }
            return `this.provide${capitalizeFirstLetter(p.name)}()`;
          })
          .join(';'),
      );
    }

    if (statements.length) {
      return `created(){
                  ${statements.join(';\n')}
              }`;
    }

    return '';
  }

  generateBeforeCreate() {
    const statements: string[] = [];

    if (this.needGenerateDefaultOptions) {
      statements.push(`const defaultOptions = convertRulesToOptions(__defaultOptionRules);
        Object.keys(this.$options.props).forEach((propName) => {
          const defaultValue = defaultOptions[propName];
          const prop = this.$options.props[propName];
          if (defaultValue !== undefined) {
            prop.default = prop.type !== Function ? () => defaultValue : defaultValue;
          }
        });`);
    }

    if (statements.length) {
      return `beforeCreate(){
                  ${statements.join(';\n')}
              }`;
    }

    return '';
  }

  generateUpdated() {
    const statements: string[] = [];

    if (this.members.filter((m) => m.isForwardRefProp).length) {
      statements.push('this.__forwardRef()');
    }

    if (this.effects.length) {
      statements.push(`
                  this.__scheduleEffects.forEach((_,i)=>{
                      this.__scheduleEffects[i]&&this.__scheduleEffects[i]()
                  });
              `);
    }

    if (statements.length) {
      return `updated(){
                  ${statements.join(';\n')}
              }`;
    }

    return '';
  }

  generateBeforeDestroy() {
    const statements: string[] = [];

    if (this.effects.length) {
      statements.push(`
        this.__destroyEffects.forEach((_,i)=>{
            this.__destroyEffects[i]&&this.__destroyEffects[i]()
        });
        this.__destroyEffects = null;
    `);
    }

    if (statements.length) {
      return `beforeDestroy(){
                  ${statements.join('\n')}
              }`;
    }

    return '';
  }

  compileDefaultOptionsRuleTypeName() {
    return '';
  }

  compileDefaultOptionRulesType() {
    return '';
  }

  compileImports(options: toStringOptions) {
    const imports: string[] = options.hasStyle ? [
      'import { normalizeStyles } from \'@devextreme/runtime/common\'',
    ] : [];
    this.compileDefaultOptionsImport(imports);

    return imports.join(';\n');
  }

  compileComponentExport(statements: string[]) {
    const name = this.exportedName;
    return `export const ${name} = {
              ${statements.join(',\n')}
          }
          export default ${name}`;
  }

  generateContextProviders(): string {
    const providers = this.members.filter((m) => m.isProvider) as Property[];
    if (providers.length) {
      return `provide(){
        return {
          ${providers
    .map((p) => `${p.context}: ${p.context}(${p.initializer})`)
    .join(',')}
        };
      }`;
    }
    return '';
  }

  generateInject(): string {
    const consumers = this.members.filter((m) => m.isConsumer);
    if (consumers.length) {
      return `inject: {
        ${consumers.map(
    (c) => `${c.name}: {
          from: "${c.context}",
          default: ${c.context}()
        }`,
  )}
      }`;
    }
    return '';
  }

  compilePortalComponent(components: string[]) {
    components.push('DxPortal');
    return `const DxPortal = Vue.extend({
      render: function (createElement) {
        if(this.$attrs.container()) {
          return createElement(
            'div',
            {
              style: {
                display: "contents"
              }
            },
            this.$slots.default
          )
        }
        return null;
      },
      mounted: function () {
        this.$nextTick(this.__renderPortal);
      },
      updated: function () {
        this.$nextTick(this.__renderPortal);
      },
      methods: {
        __renderPortal() {
          const container = this.$attrs.container();
          if (container) {
            container.append(this.$el);
          }
        }
      }
    });`;
  }

  collectNestedComponents() {
    return super.collectNestedComponents() as {
      component: VueComponentInput;
      name: string;
      propName: string;
    }[];
  }

  compileNestedComponents() {
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

  getNestedExports(
    component: VueComponentInput,
    name: string,
    propName: string,
  ) {
    return `export const Dx${name} = {
      ${`props: ${component.name}`}
    }
    Dx${name}.propName="${propName}"
    Dx${name}.defaultProps=__extractDefaultValues(${component.name})`;
  }

  getInitializedTemplates(): Array<InitializedTemplateType> {
    const result: Array<InitializedTemplateType> = [];
    this.props.forEach((p) => {
      if (p.isTemplate
        && this.context.components
        && p.initializer
        && !this.context.components?.[p.initializer.toString()]
      ) {
        if ((p.type instanceof TypeReferenceNode)
          && (p.type as TypeReferenceNode).context.path !== this.context.path
          && p.initializer instanceof BaseFunction) {
          // TODO  link to Card https://trello.com/c/hjjipgX8/2881-renovationvue
          throw new Error('Template default as a function in isolated props object is not supported. Please contact with Renovation team ');
        }
        const componentInputInstance = (Object.values(this.context.components)
          .find((component) => p.initializer
          && (component as VueComponentInput).context
            .components?.[p.initializer.toString()]) as VueComponentInput);
        if (componentInputInstance
          && (p.type instanceof TypeReferenceNode)
          && (p.type as TypeReferenceNode).context.path !== this.context.path
          && p.initializer instanceof BaseFunction) {
          // TODO  link to Card https://trello.com/c/hjjipgX8/2881-renovationvue
          throw new Error('Template default as a function in isolated props object is not supported. Please contact with Renovation team ');
        }
        if (componentInputInstance) {
          result.push({
            propName: p.name,
            defaultName: `${p.initializer.toString()}Default`,
            initializer: p.initializer,
            componentInput: componentInputInstance.name.toString(),
          });
        }
      }
    });
    return result;
  }

  compileDefaultExactors(options: toStringOptions, components: string[]):string {
    const Exactors: string[] = [];
    if (options.initializedTemplates) {
      options.initializedTemplates
        .forEach((c) => {
          components.push(c.defaultName);
          Exactors.push(`const ${c.defaultName} = ${c.componentInput}.${c.propName}.defaultTemplate()`);
        });
    }
    return Exactors.join('\n');
  }

  toString() {
    const methods: string[] = [];
    const components: string[] = [];
    const options: toStringOptions = {
      members: this.members,
      newComponentContext: '',
      isSVG: this.isSVGComponent,
      initializedTemplates: this.getInitializedTemplates(),
    };

    this.compileTemplate(methods, options);

    const portalComponent = this.containsPortal()
      ? this.compilePortalComponent(components)
      : '';
    const Exactors = this.compileDefaultExactors(options, components);
    const statements = [
      `name: "${this.name}"`,
      this.generateComponents(components),
      this.generateProps(),
      this.generateModel(),
      this.generateData(),
      this.generateComputed(),
      this.generateInject(),
      this.generateContextProviders(),
      this.generateWatch(methods),
      this.generateMethods(methods),
      this.generateBeforeCreate(),
      this.generateCreated(),
      this.generateMounted(),
      this.generateUpdated(),
      this.generateBeforeDestroy(),
    ].filter((s) => s);

    return `
          ${this.compileImports(options)}
          ${Exactors}
          ${
  this.members.some((m) => m.isNested)
    ? this.createNestedChildrenCollector()
    : ''
}
          ${
  this.members.some((m) => m.isNested)
    ? this.createNestedDefaultPropsExtractor()
    : ''
}
          ${this.compileNestedComponents()}
          ${portalComponent}
          ${this.compileDefaultOptionsMethod(
    this.defaultOptionRules ? this.defaultOptionRules.toString() : '[]',
    [],
  )}
          ${this.compileDefaultProps()}
          ${this.compileComponentExport(statements)}`;
  }
}
