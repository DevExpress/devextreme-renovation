import {
  ArrayLiteral,
  BaseClassMember,
  BindingElement,
  BindingPattern,
  Block,
  Call,
  capitalizeFirstLetter,
  compileType,
  Component,
  Decorators,
  Dependency,
  Expression,
  extractComplexType,
  FunctionTypeNode,
  GeneratorContext,
  getProps,
  getRelativePath,
  getTemplate,
  HeritageClause,
  Identifier,
  If,
  isTypeArray,
  Method,
  ObjectLiteral,
  Parameter,
  PropertyAccess,
  PropertyAssignment,
  removePlural,
  ReturnStatement,
  SimpleExpression,
  SimpleTypeExpression,
  StringLiteral,
  SyntaxKind,
  Decorator as BaseDecorator,
} from '@devextreme-generator/core';
import path from 'path';

import { AngularGeneratorContext, toStringOptions } from '../types';
import { GetAccessor } from './class-members/get-accessor';
import { Method as AngularMethod } from './class-members/method';
import { Property } from './class-members/property';
import { PropsGetAccessor } from './class-members/props-get-accessor';
import { SetAccessor } from './class-members/set-accessor';
import { ComponentInput } from './component-input';
import { Decorator } from './decorator';
import { isElement } from './jsx/elements';
import {
  dynamicComponentDirective,
  dynamicComponentDirectiveCoreImports,
} from './templates/dynamic-component-directive';
import {
  angularPortalCdkImports,
  angularPortalCoreImports,
  angularPortalTemplate,
} from './templates/portal-component';

const CUSTOM_VALUE_ACCESSOR_PROVIDER = 'CUSTOM_VALUE_ACCESSOR_PROVIDER';

export function compileCoreImports(
  members: Array<Property | Method>,
  context: AngularGeneratorContext,
  imports: string[] = [],
  options?: toStringOptions,
  isPublicComponentWithPrivateProp = false,
) {
  if (
    members.some((m) => m.decorators.some(
      (d) => d.name === Decorators.OneWay
        || d.name === Decorators.RefProp
        || d.name === Decorators.Nested
        || d.name === Decorators.ForwardRefProp,
    )) || options?.mutableOptions?.hasRestAttributes || isPublicComponentWithPrivateProp
  ) {
    imports.push('Input');
  }
  if (members.some((m) => m.isState)) {
    imports.push('Input', 'Output', 'EventEmitter');
  }
  if (members.some((m) => m.isTemplate)) {
    imports.push('Input', 'TemplateRef');
  }
  if (members.some((m) => m.isEvent)) {
    imports.push('Output', 'EventEmitter');
  }

  if (members.some((m) => m.isSlot)) {
    imports.push('ViewChild', 'ElementRef');
  }

  if (members.some((m) => m.isNestedComp)) {
    imports.push('ContentChildren', 'QueryList', 'Directive');
  }

  if (members.some((m) => m.isForwardRef)) {
    imports.push('ElementRef');
  }

  const set = new Set(context.angularCoreImports);
  const needImport = imports.filter((name) => !set.has(name));
  context.angularCoreImports = [...set, ...needImport];

  if (needImport.length) {
    return `import {${[...new Set(needImport)].join(
      ',',
    )}} from "@angular/core"`;
  }

  return '';
}

function separateDependency(
  allDependency: Dependency[],
  internalState: Property[],
): [Dependency[], Dependency[]] {
  const result: [Dependency[], Dependency[]] = [[], []];
  return allDependency.reduce((r, d) => {
    if (internalState.find((m) => m === d)) {
      r[1].push(d);
    } else {
      r[0].push(d);
    }

    return r;
  }, result);
}

function getDependencyFromViewExpression(
  expression: Expression,
  options: toStringOptions,
): Dependency[] {
  const dependency = expression.getDependency(options)
    .filter((dep) => (dep instanceof BaseClassMember ? !dep.isMutable : true));

  const methods = dependency.filter((dep) => dep instanceof Method) as Method[];

  return methods.reduce(
    (d: Dependency[], m) => d.concat(
      m.getDependency({
        ...options,
        componentContext: SyntaxKind.ThisKeyword,
      }).filter((dep) => (dep instanceof BaseClassMember ? !dep.isMutable : true)),
    ),
    dependency.filter((d) => !methods.some((m) => m === d)),
  );
}

const ngOnChangesParameters = ['changes'];

export const getAngularSelector = (
  name: string | Identifier,
  postfix = '',
  isSVG = false,
) => {
  name = name.toString();
  const words = name
    .toString()
    .split(/(?=[A-Z])/)
    .map((w) => w.toLowerCase());

  if (isSVG) {
    return `g [${name}]`;
  }
  return [`dx${postfix}`].concat(words).join('-');
};

export const convertSelectorToName = (selector: string) => selector
  .replace(/dx[io]?-/g, '')
  .split(/[- ]/)
  .map((str) => capitalizeFirstLetter(str))
  .join('');

export class AngularComponent extends Component {
  decorator: Decorator;

  members!: (Property | Method)[];

  constructor(
    componentDecorator: Decorator,
    modifiers: string[],
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
    context: GeneratorContext,
  ) {
    super(
      componentDecorator,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      context,
    );
    componentDecorator.addParameter(
      'selector',
      new StringLiteral(this.selector),
    );
    componentDecorator.addParameter(
      'changeDetection',
      new SimpleExpression('ChangeDetectionStrategy.OnPush'),
    );
    this.decorator = componentDecorator;
  }

  createNestedState(
    name: string,
    questionOrExclamationToken: string,
    type: string,
  ) {
    return new Property(
      [],
      ['private'],
      new Identifier(`__${name}`),
      questionOrExclamationToken || SyntaxKind.QuestionToken,
      `${type}`,
      undefined,
    );
  }

  createNestedPropertySetter(
    decorator: BaseDecorator[],
    modifiers: string[],
    name: string,
    questionOrExclamationToken: string,
    type: string,
    onPushStrategy: boolean,
  ) {
    if (questionOrExclamationToken === '?') {
      type += '| undefined';
    }
    const statements = [new SimpleExpression(`this.__${name}=value;`)];
    if (onPushStrategy) {
      statements.push(new SimpleExpression('this._detectChanges();'));
    }

    return new SetAccessor(
      decorator,
      modifiers,
      new Identifier(`${name}`),
      [new Parameter([], [], undefined, new Identifier('value'), '', type)],
      new Block(statements, true),
    );
  }

  createNestedPropertyGetter(
    modifiers: string[],
    name: string,
    questionOrExclamationToken: string,
    type: string,
    componentName: string,
    initializer?: Expression,
  ) {
    const isArray = isTypeArray(type);
    const indexGetter = isArray ? '' : '[0]';
    if (questionOrExclamationToken === '?') {
      type += '| undefined';
    }

    return new GetAccessor(
      [],
      modifiers,
      new Identifier(`${name}`),
      [],
      type,
      new Block(
        [
          new SimpleExpression(`if (this.__${name}) {
          return this.__${name};
        }
        const nested = this.${name}Nested?.toArray();
        if (nested && nested.length) {
          return nested${indexGetter};
        }
        ${initializer ? `return ${componentName}.__defaultNestedValues.${name}`
    : ''
}`),
        ],
        true,
      ),
    );
  }

  createContentChildrenProperty(
    decorator: Decorator[],
    modifiers: string[],
    name: string,
    questionOrExclamationToken: string,
    type: string,
  ) {
    return new Property(
      decorator,
      modifiers,
      new Identifier(`${name}Nested`),
      questionOrExclamationToken,
      type,
      undefined,
    );
  }

  processNestedProperty(
    property: Property,
    onPushStrategy = false,
    parentName = `Dx${convertSelectorToName(this.selector)}`,
    componentName: string = this.heritageClauses[0].propsType.toString(),
  ) {
    const {
      decorators,
      modifiers,
      questionOrExclamationToken,
      type,
      name,
      initializer,
    } = property;

    const nestedCompDecorator = [
      new Decorator(
        new Call(new Identifier(Decorators.NestedComp), undefined, []),
        {},
      ),
    ];

    const nestedName = `${parentName}${capitalizeFirstLetter(
      isTypeArray(type) ? removePlural(name) : name,
    )}`;

    const complexType = type
      .toString()
      .replace(extractComplexType(type), nestedName);

    return [
      this.createNestedState(name, questionOrExclamationToken, complexType),
      this.createContentChildrenProperty(
        nestedCompDecorator,
        modifiers,
        name,
        SyntaxKind.QuestionToken,
        nestedName,
      ),
      this.createNestedPropertySetter(
        decorators,
        modifiers,
        name,
        questionOrExclamationToken,
        complexType,
        onPushStrategy,
      ),
      this.createNestedPropertyGetter(
        modifiers,
        name,
        questionOrExclamationToken,
        complexType,
        componentName,
        initializer,
      ),
    ];
  }

  processMembers(members: Array<Property | Method>) {
    members = super.processMembers(members);
    members = members.concat(
      (members.filter((m) => m.isForwardRefProp) as Property[]).map(
        (m) => new Property(
          [
            new Decorator(
              new Call(new Identifier(Decorators.Ref), [], []),
              this.context,
            ),
          ],
          [],
          new Identifier(`${m.name}__Ref__`),
          '!',
          m.type,
          undefined,
          false,
          m,
        ),
      ),
    );
    members.map((m) => {
      if (m instanceof GetAccessor) {
        const memberWithTypes = m;
        memberWithTypes.contextTypes = {
          ...this.context.externalTypes,
          ...this.context.externalInterfaces,
          ...this.context.types,
          ...this.context.interfaces,
        };
        return memberWithTypes;
      }
      return m;
    });

    members = members.concat(
      members
        .filter((m) => m.isForwardRef || m.isForwardRefProp)
        .map((m) => {
          const property = m as Property;
          const forwardRefPropertyName = `this.${m.name}${m.isForwardRefProp ? '__Ref__' : ''}`;
          const type = new SimpleTypeExpression(`ElementRef<${m.type}>`);
          const isOptional = property.questionOrExclamationToken === SyntaxKind.QuestionToken;
          const questionDotTokenIfNeed = isOptional
            ? SyntaxKind.QuestionDotToken
            : '';
          const returnType = `${type}${isOptional ? '|undefined' : ''}`;
          const parameter = new Parameter(
            [],
            [],
            undefined,
            new Identifier('ref'),
            SyntaxKind.QuestionToken,
            type,
          );
          return new GetAccessor(
            [],
            [],
            new Identifier(`forwardRef_${m.name}`),
            [],
            new FunctionTypeNode(
              [],
              [parameter],
              new SimpleTypeExpression(returnType),
            ),
            new Block(
              [
                new SimpleExpression(
                  `return (function(this: ${this.name}, ${parameter}): ${returnType}{
                    if(arguments.length){
                      if(ref) {
                        ${forwardRefPropertyName} = ref;
                      } else {
                        ${forwardRefPropertyName} = new UndefinedNativeElementRef();
                      }
                      ${m.isForwardRefProp ? `this.${m.name}${questionDotTokenIfNeed}(${forwardRefPropertyName})` : ''}
                    }
                  return this.${m.name}${m.isForwardRefProp ? `${questionDotTokenIfNeed}()` : ''}
                }).bind(this)`,
                ),
              ],
              true,
            ),
          );
        }),
    );

    members = members.reduce((acc, m) => {
      if (m.isNested && m instanceof Property) {
        return acc.concat(this.processNestedProperty(m, true));
      }
      if (m.isConsumer) {
        return acc.concat(
          new Property(
            [],
            [],
            new Identifier(`${m.name}Consumer`),
            undefined,
            m.type,
          ),
          m,
        );
      }
      acc.push(m);
      return acc;
    }, [] as Array<Property | Method>);

    const slots = members.filter((m) => m.isSlot);
    slots.forEach((s) => {
      const name = new Identifier(`slot${capitalizeFirstLetter(s.name)}`);
      const decorators = [
        new Decorator(
          new Call(new Identifier('ViewChild'), undefined, [
            new SimpleExpression(`"${name}"`),
          ]),
          {},
        ),
      ];
      const parameters = [
        new Parameter(
          [],
          [],
          undefined,
          new Identifier('slot'),
          undefined,
          new SimpleTypeExpression('ElementRef<HTMLDivElement>'),
        ),
      ];
      const body = new Block(
        [
          new SimpleExpression(`
          const oldValue = this.${s.name};
          this.__${name} = slot;
          const newValue = this.${s.name};
          if(!!oldValue !== !!newValue){
            this._detectChanges();
          }
        `),
        ],
        true,
      );

      members.push(new SetAccessor(decorators, [], name, parameters, body));
    });

    members.push(
      new Method(
        undefined,
        undefined,
        undefined,
        new Identifier('_detectChanges'),
        undefined,
        undefined,
        [],
        SyntaxKind.VoidKeyword,
        new Block(
          [
            new SimpleExpression(`setTimeout(() => {
            ${new If(
    new SimpleExpression(
      'this.changeDetection && !(this.changeDetection as ViewRef).destroyed',
    ),
    new SimpleExpression('this.changeDetection.detectChanges()'),
  )}
          })`),
          ],
          true,
        ),
      ),
    );

    return members;
  }

  addPrefixToMembers(members: Array<Property | Method>) {
    members
      .filter((m) => !m.isApiMethod)
      .forEach((m) => {
        m.prefix = '__';
      });
    members = members.reduce((members, member) => {
      if (member.isInternalState) {
        members.push(
          new SetAccessor(
            undefined,
            undefined,
            new Identifier(`_${member.name}`),
            [
              new Parameter(
                [],
                [],
                undefined,
                member._name,
                '',
                member.type,
                undefined,
              ),
            ],
            new Block(
              [
                new SimpleExpression(`this.${member.name}=${member._name}`),
                new SimpleExpression('this._detectChanges()'),
              ],
              false,
            ),
          ),
        );
      }
      return members;
    }, members);
    return members;
  }

  get selector() {
    return getAngularSelector(this._name, '', this.isSVGComponent);
  }

  get module() {
    return `Dx${this._name}Module`;
  }

  get isPublicComponentWithPrivateProp(): boolean {
    return this.decorator.isPublicComponentWithPrivateProp(this.members);
  }

  get isWrappedByTemplate(): boolean {
    return this.decorator.isWrappedByTemplate(this.members);
  }

  compileImports(coreImports: string[] = [], options?: toStringOptions) {
    const core = ['Component', 'NgModule'].concat(coreImports);

    if (this.refs.length || this.apiRefs.length) {
      core.push('ViewChild');
    }
    if (this.refs.length || this.needHostElementRef(options)) {
      core.push('ElementRef');
    }

    if (this.modelProp) {
      core.push('forwardRef', 'HostListener');
    }

    const imports = [
      `${compileCoreImports(
        this.members.filter((m) => !m.inherited),
        this.context,
        core,
        options,
        this.isPublicComponentWithPrivateProp,
      )}`,
      'import {CommonModule} from "@angular/common"',
      ...(this.modelProp
        ? [
          "import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'",
        ]
        : []),
    ];

    this.compileDefaultOptionsImport(imports);
    this.compileDefaultPropsImport(imports, options);

    return imports.join(';\n');
  }

  compileDefaultPropsImport(imports: string[], options?: toStringOptions): void {
    const propsWithDefault = this.getPropsWithDefault();
    const hasRefProperty = this.members.some((m) => m.isForwardRef || m.isRef);
    const runTimeImports = [
      ...(options?.mutableOptions?.hasRestAttributes ? ['getAttributes'] : []),
      ...(propsWithDefault.length ? ['updateUndefinedFromDefaults', 'DefaultEntries'] : []),
      ...(hasRefProperty ? ['UndefinedNativeElementRef'] : []),
    ];
    if (runTimeImports.length > 0) {
      imports.push(`import {${runTimeImports.join(' ,')}} from '@devextreme/runtime/angular'`);
    }
    if (options?.hasStyle) {
      imports.push('import { normalizeStyles } from \'@devextreme/runtime/common\'');
    }
  }

  createRestPropsGetter(_members: BaseClassMember[]): GetAccessor {
    const propNames = getProps(_members)
      .map((member) => member._name.toString())
      .map((name) => (name === 'export' ? 'export: exportProp' : name));
    return new GetAccessor(
      undefined,
      undefined,
      new Identifier('restAttributes'),
      [],
      undefined,
      new Block([new SimpleExpression(`
        const 
          ${propNames.length ? `{ ${propNames.join(',\n')}, ...restAttributes } ` : 'restAttributes'}
          = getAttributes(this._elementRef);
        return {
          ...restAttributes,
          ...this._restAttributes
        };
      `)], true),
    );
  }

  compileGetterCache(ngOnChangesStatements: string[],
    options?: toStringOptions,
    resetDependantGetters: string[] = []): string {
    const getters = this.members.filter(
      (m) => m instanceof GetAccessor && m.isMemorized(options),
    );

    if (getters.length) {
      const statements = [
        `__getterCache: {
            ${getters.map((g) => `${g._name}?:${g.type}`).join(';\n')}
          } = {}`,
      ];

      getters.forEach((g) => {
        const allDeps = g.getDependency({
          members: this.members,
          componentContext: SyntaxKind.ThisKeyword,
        }).filter((dep) => (dep instanceof BaseClassMember ? !dep.isMutable : true));
        const [propsDependency, internalStateDependency] = separateDependency(
          allDeps,
          this.internalState,
        );
        const deleteCacheStatement = `this.__getterCache["${g._name.toString()}"] = undefined;`;

        if (propsDependency.length) {
          const contextDependencies = propsDependency.reduce((acc, dep) => (
            dep instanceof BaseClassMember && dep.isConsumer
              ? [...acc, dep]
              : acc), [] as Dependency[]);
          const conditionArray = [];

          const dependenciesWithoutContext = propsDependency.filter(
            (dep) => !contextDependencies.includes(dep),
          );
          if (dependenciesWithoutContext.length) {
            conditionArray.push(
              `[${dependenciesWithoutContext.map((d) => `"${d instanceof BaseClassMember ? d._name : d}"`).join(',')}].some(d=>${ngOnChangesParameters[0]
              }[d])`,
            );
          }
          if (propsDependency.includes('props')) {
            ngOnChangesStatements.push(deleteCacheStatement);
          } else if (conditionArray.length) {
            ngOnChangesStatements.push(`
                        if (${conditionArray.join('&&')}) {
                            ${deleteCacheStatement}
                        }`);
          }

          if (contextDependencies.length) {
            resetDependantGetters.push(deleteCacheStatement);
          }
        }

        internalStateDependency.forEach((dep) => {
          const name = dep instanceof BaseClassMember ? dep._name.toString() : dep;
          const setter = this.members.find(
            (p) => p.name === `_${name}`,
          ) as SetAccessor;
          if (setter) {
            setter.body?.statements.push(
              new SimpleExpression(deleteCacheStatement),
            );
          }
        });
      });
      if (resetDependantGetters.length) {
        statements.push(`resetDependantGetters(): void {
          ${resetDependantGetters.join('\n;')}
        }`);
      }
      return statements.join('\n;');
    }

    return '';
  }

  compileEffects(
    ngAfterViewInitStatements: string[],
    ngOnDestroyStatements: string[],
    ngOnChanges: string[],
    ngAfterViewCheckedStatements: string[],
    ngDoCheckStatements: string[],
  ): string {
    const effects = this.members.filter((m) => m.isEffect) as Method[];
    let hasInternalStateDependency = false;

    if (effects.length) {
      const statements = [
        '__destroyEffects: any[] = [];',
        '__viewCheckedSubscribeEvent: Array<(()=>void)|null> = [];',
        '_effectTimeout: any;',
      ];
      let usedIterables = new Set();

      const subscribe = (e: Method) => `this.${e.getter()}()`;
      effects.forEach((e, i) => {
        const allDeps = e.getDependency({
          members: this.members,
          componentContext: SyntaxKind.ThisKeyword,
        }).filter((dep) => (dep instanceof BaseClassMember ? !dep.isMutable : true));
        const [propsDependency, internalStateDependency] = separateDependency(
          allDeps,
          this.internalState,
        );
        const iterableDeps = allDeps
          .filter((dep) => dep instanceof BaseClassMember && isTypeArray(dep.type));

        const updateEffectMethod = `__schedule_${e._name}`;
        if (propsDependency.length || internalStateDependency.length) {
          statements.push(`${updateEffectMethod}(){
                        this.__destroyEffects[${i}]?.();
                        this.__viewCheckedSubscribeEvent[${i}] = ()=>{
                            this.__destroyEffects[${i}] = ${subscribe(e)}
                        }
                    }`);
        }
        if (propsDependency.length) {
          const conditionArray = ['this.__destroyEffects.length'];
          if (propsDependency.indexOf('props') === -1) {
            conditionArray.push(
              `[${propsDependency.map((d) => `"${d instanceof BaseClassMember ? d._name.toString() : d}"`).join(',')}].some(d=>${ngOnChangesParameters[0]
              }[d])`,
            );
          }

          const iterableProps = propsDependency
            .filter((dep) => dep instanceof BaseClassMember && isTypeArray(dep.type));
          const assignments = iterableProps
            .map(
              (p) => {
                const pName = p instanceof BaseClassMember ? p._name.toString() : p;
                return `if (${ngOnChangesParameters[0]}["${pName}"]) {
            this.__cachedObservables["${pName}"] = [...${ngOnChangesParameters[0]}["${pName}"].currentValue];
          }`;
              },
            )
            .join('\n');
          ngOnChanges.push(`
                        if (${conditionArray.join('&&')}) {
                            ${assignments}
                            this.${updateEffectMethod}();
                        }`);
        }

        if (iterableDeps.length) {
          usedIterables = new Set([...usedIterables].concat(iterableDeps));
          const observableConditionArray = ['this.__destroyEffects.length'];
          observableConditionArray.push(
            `this.__checkObservables([${iterableDeps
              .map((d) => `"${d instanceof BaseClassMember ? d._name.toString() : d}"`)
              .join(',')}])`,
          );

          ngDoCheckStatements.push(`
          if (${observableConditionArray.join('&&')}) {
              this._detectChanges();
              this.${updateEffectMethod}();
          }`);
        }

        internalStateDependency.forEach((dep) => {
          const name = dep instanceof BaseClassMember ? dep._name.toString() : dep;
          const setter = this.members.find(
            (p) => p.name === `_${name}`,
          ) as SetAccessor;
          if (setter) {
            if (
              usedIterables.has(dep)
              && !setter.body?.statements.some(
                (expr) => expr.toString()
                  === `this.__cachedObservables["${name}"] = [...${name}];`,
              )
            ) {
              setter.body?.statements.push(
                new SimpleExpression(
                  `this.__cachedObservables["${name}"] = [...${name}];`,
                ),
              );
            }
            setter.body?.statements.push(
              new SimpleExpression(`
                if (this.__destroyEffects.length) {
                    this.${updateEffectMethod}();
                }`),
            );
            setter.body?.statements.push(
              new SimpleExpression('this._updateEffects()'),
            );
            hasInternalStateDependency = true;
          }
        });
      });
      if (ngOnChanges.length || hasInternalStateDependency) {
        statements.push(`
          _updateEffects(){
            if(this.__viewCheckedSubscribeEvent.length && !this._effectTimeout){
              this._effectTimeout = setTimeout(()=> {
                this._effectTimeout = undefined;
                this.__viewCheckedSubscribeEvent.forEach((s, i)=>{
                  s?.();
                  if(this.__viewCheckedSubscribeEvent[i]===s){
                    this.__viewCheckedSubscribeEvent[i]=null;
                  }
                });
              });
            }
          }
        `);
        ngAfterViewCheckedStatements.push('this._updateEffects()');
      }
      if (usedIterables.size > 0) {
        statements.push(
          '__cachedObservables: { [name: string]: Array<any> } = {}',
        );
        statements.push(`__checkObservables(keys: string[]) {
          let isChanged = false;
          keys.forEach((key) => {
            const cached = this.__cachedObservables[key];
            const current = (this as any)[key];
            if (cached.length !== current.length || !cached.every((v, i) => current[i] === v)) {
              isChanged = true;
              this.__cachedObservables[key] = [...current];
            }
          })

          return isChanged;
        }`);
        usedIterables.forEach((i) => {
          const iName = i instanceof BaseClassMember ? i._name.toString() : i;
          ngAfterViewInitStatements.push(
            `this.__cachedObservables["${iName}"] = this.${iName}`,
          );
        });
      }
      ngAfterViewInitStatements.push(
        `this.__destroyEffects.push(${effects
          .map((e) => subscribe(e))
          .join(',')});`,
      );
      ngOnDestroyStatements.push(
        `this.__destroyEffects.forEach(d => d && d());
         clearTimeout(this._effectTimeout);
        `,
      );
      return statements.join('\n');
    }

    return '';
  }

  compileTrackBy(options: toStringOptions): string {
    return (
      options.trackBy
        ?.map((trackBy) => trackBy.getTrackByDeclaration())
        .join('\n') || ''
    );
  }

  compileSpreadAttributes(
    ngOnChangesStatements: string[],
    coreImports: string[],
    ngAfterViewInitStatements: string[],
    ngAfterViewCheckedStatements: string[],
    memberToStringOptions?: toStringOptions,
  ): string {
    const viewFunction = this.decorator.getViewFunction();
    if (viewFunction) {
      const options: toStringOptions = {
        members: this.members,
        newComponentContext: this.viewModel ? '_viewModel' : '',
        mutableOptions: memberToStringOptions?.mutableOptions,
      };
      const expression = getTemplate(viewFunction, options);
      const allDependency: Dependency[] = [];
      if (isElement(expression)) {
        options.newComponentContext = SyntaxKind.ThisKeyword;
        const members: string[] = [];

        const statements = expression.getSpreadAttributes(memberToStringOptions).map((o, i) => {
          const expressionString = o.expression.toString(options);

          allDependency.push(...getDependencyFromViewExpression(o.expression, options));

          const refString = `${o.refExpression instanceof SimpleExpression
            ? `this.${o.refExpression.toString()}`
            : o.refExpression.toString(options)
          }?.nativeElement`;
          if (o.refExpression instanceof SimpleExpression) {
            coreImports.push('ViewChild', 'ElementRef');
            const viewChildMemberString = `@ViewChild("${o.refExpression.toString()}", { static: false }) ${o.refExpression.toString()}?: ElementRef<HTMLDivElement>`;
            if (!members.includes(viewChildMemberString)) {
              members.push(
                viewChildMemberString,
              );
            }
          }
          return `
                    const _attr_${i}:{[name: string]:any } = ${expressionString} || {};
                    const _ref_${i} = ${refString};
                    if(_ref_${i}){
                        for(let key in _attr_${i}) {
                            _ref_${i}.setAttribute(key, _attr_${i}[key].toString());
                        }
                    }
                    `;
        });

        if (this.needHostElementRef(options)) {
          statements.push('this._elementRef.nativeElement.removeAttribute(\'id\');');
        }

        if (statements.length) {
          const methodName = '__applyAttributes__';
          const scheduledApplyAttributes = 'scheduledApplyAttributes';
          ngAfterViewCheckedStatements.push(`if(this.${scheduledApplyAttributes}){
            this.${methodName}();
            this.${scheduledApplyAttributes} = false;
          }`);

          const [propsDependency, internalStateDependency] = separateDependency(
            allDependency.filter(
              (d) => !(d instanceof Method),
            ),
            this.members.filter((m) => m.isInternalState) as Property[],
          );

          internalStateDependency.forEach((dep) => {
            const name = dep instanceof BaseClassMember ? dep._name.toString() : dep;
            const setter = this.members.find(
              (p) => p.name === `_${name}`,
            ) as SetAccessor;
            if (setter) {
              const expression = `this.${scheduledApplyAttributes} = true`;
              if (
                !setter.body?.statements.some(
                  (expr) => expr.toString() === expression,
                )
              ) {
                setter.body?.statements.push(new SimpleExpression(expression));
              }
            }
          });

          if (propsDependency.length) {
            ngOnChangesStatements.push(`if([${propsDependency
              .map((d) => `"${d instanceof BaseClassMember ? d._name.toString() : d}"`)
              .join(',')}].some(d=>
              ${ngOnChangesParameters[0]}[d] && !${ngOnChangesParameters[0]}[d].firstChange)){
                this.${scheduledApplyAttributes} = true;
            }`);
          }

          ngAfterViewInitStatements.push(`this.${methodName}()`);

          members.push(`
            ${scheduledApplyAttributes} = false;
            ${methodName}(){
              ${statements.join('\n')}
            }`);

          return members.join(';\n');
        }
      }
    }
    return '';
  }

  compileNgStyleProcessor(options: toStringOptions): string {
    if (options.hasStyle) {
      return `__processNgStyle(value:any){
                    return normalizeStyles(value);
                }`;
    }
    return '';
  }

  compileLifeCycle(
    name: string,
    statements: string[],
    parameters: string[] = [],
  ): string {
    if (statements.length || (name !== 'ngOnChanges' && parameters.length)) {
      return `${name}(${parameters.join(',')}){
                ${statements.join('\n')}
            }`;
    }
    return '';
  }

  compileDefaultOptionsPropsType() {
    return `Partial<${super.compileDefaultOptionsPropsType()}>`;
  }

  compileDefaultOptions(constructorStatements: string[]): string {
    if (this.needGenerateDefaultOptions) {
      constructorStatements.push(`
            const defaultOptions = convertRulesToOptions<${this.compilePropsType()}>(__defaultOptionRules);
            Object.keys(defaultOptions).forEach(option=>{
                (this as any)[option] = (defaultOptions as any)[option];
            });`);

      return this.compileDefaultOptionsMethod(
        this.defaultOptionRules ? this.defaultOptionRules.toString() : '[]',
        [],
      );
    }
    return '';
  }

  compileNgModel() {
    if (!this.modelProp) {
      return '';
    }

    const disabledProp = getProps(this.members).find(
      (m) => m._name.toString() === 'disabled',
    );

    return `
        @HostListener('${this.modelProp.name}Change', ['$event']) change() { }
        @HostListener('onBlur', ['$event']) touched = () => {};

        writeValue(value: any): void {
            this.${this.modelProp.name} = value;
            this._detectChanges();
        }

        ${disabledProp
    ? `setDisabledState(isDisabled: boolean): void {
            this.disabled = isDisabled;
        }`
    : ''
}

        registerOnChange(fn: () => void): void { this.change = fn; }
        registerOnTouched(fn: () => void): void { this.touched = fn; }
        `;
  }

  getNestedExports(component: ComponentInput, name: string, selector = '') {
    const innerNested = (component.members.filter(
      (m) => m.isNested,
    ) as Property[])
      .map((m) => this.processNestedProperty(m, false, name, component.name).join('\n'))
      .join('\n');

    return `
      @Directive({
        selector: "${selector}"
      })
      export class ${name} extends ${component.name} {
        ${innerNested}
      }
    `;
  }

  getNestedFromComponentInput(
    component: ComponentInput,
    parentSelector: string = this.selector,
  ): { component: ComponentInput; name: string }[] {
    const nestedProps = component.members.filter(
      (m) => m.isNested,
    ) as Property[];
    const components = component.context.components!;

    const nested = Object.keys(components).reduce(
      (acc, key) => {
        const propertyArr = nestedProps.filter(
          ({ type }) => extractComplexType(type) === key,
        );
        if (propertyArr.length > 0) {
          propertyArr.forEach((property) => {
            const { name: propName, type: propType } = property;
            const isArray = isTypeArray(propType);
            const postfix = isArray ? 'i' : 'o';
            const selectorName = isArray ? removePlural(propName) : propName;
            const selector = getAngularSelector(selectorName, postfix);

            acc.push({
              component: components[key] as ComponentInput,
              name: `${parentSelector} ${selector}`,
            });
          });
        }
        return acc;
      },
      [] as {
        component: ComponentInput;
        name: string;
      }[],
    );

    return nested.concat(
      nested.reduce(
        (acc, el) => acc.concat(this.getNestedFromComponentInput(el.component, el.name)),
        [] as {
          component: ComponentInput;
          name: string;
        }[],
      ),
    );
  }

  collectNestedComponents() {
    return super.collectNestedComponents() as {
      component: ComponentInput;
      name: string;
    }[];
  }

  compileNestedComponents(nestedModules: string[]) {
    const collectedComponents = this.collectNestedComponents();
    if (collectedComponents.length) {
      const imports = this.getNestedImports(
        collectedComponents.map(({ component }) => component),
      );
      const nestedComponents = collectedComponents
        .map(({ component, name: fullSelector }) => {
          const name = `Dx${convertSelectorToName(fullSelector)}`;
          const selector = fullSelector.split(' ').pop();

          nestedModules.push(name);
          return this.getNestedExports(component, name, selector);
        })
        .reverse();

      return imports.concat(nestedComponents).join('\n');
    }
    return '';
  }

  compileBindEvents(constructorStatements: string[], options: toStringOptions): string {
    const events = this.members.filter((m) => m.isEvent);

    return events
      .map((e) => {
        const twoWayMember = this.members.find((m) => m.isState && e.name === `${m.name}Change`);
        const resetGetterStatement = (name: string) => `this.__getterCache["${name}"] = undefined`;

        let resetStatements: string[] = [];
        if (twoWayMember) {
          const dependentGetters = this.members.filter(
            (m) => m instanceof GetAccessor
              && m.isMemorized(options)
              && m.getDependency(options).includes(twoWayMember),
          );
          resetStatements = dependentGetters.map((g) => resetGetterStatement(g._name.toString()));
        }

        constructorStatements.push(
          `this._${e.name}=(e:any) => {
            this.${e.name}.emit(e);
            ${resetStatements.join(';\n')}
            ${twoWayMember ? 'this._detectChanges();' : ''
}
          }`,
        );
        return `_${e.name}${compileType('any')}`;
      })
      .join(';\n');
  }

  compilePortalComponent(
    coreImports: string[],
    cdkImports: string[],
    importModules: string[],
  ) {
    coreImports.push(...angularPortalCoreImports);
    cdkImports.push(...angularPortalCdkImports);
    importModules.push('DxPortal');

    // TODO change on import
    return angularPortalTemplate;
  }

  compileDynamicComponentDirective(
    decoratorToStringOptions: toStringOptions,
    coreImports: string[],
    importModules: string[],
  ) {
    if (!decoratorToStringOptions.hasDynamicComponents) {
      return '';
    }

    coreImports.push(...dynamicComponentDirectiveCoreImports);
    importModules.push('DynamicComponentDirective');

    // TODO change on import
    return dynamicComponentDirective;
  }

  compileCdkImports(cdkImports: string[] = []) {
    if (cdkImports.length) {
      return `import { ${[...new Set(cdkImports)].join(
        ',',
      )} } from "@angular/cdk/portal"`;
    }
    return '';
  }

  fillProviders() {
    let providers: string[] = [];

    const contextProperties = this.members.filter(
      (m) => m.isProvider,
    );

    if (contextProperties.length) {
      providers = [
        ...providers,
        ...new Set(contextProperties.map((p) => p.context.toString())),
      ];
    }

    if (this.modelProp) {
      providers.push(CUSTOM_VALUE_ACCESSOR_PROVIDER);
    }

    if (providers.length) {
      this.decorator.addParameter(
        'providers',
        new ArrayLiteral(
          providers.map((p) => new SimpleExpression(p)),
          true,
        ),
      );
    }
  }

  compileValueAccessor(implementedInterfaces: string[]): string {
    if (this.modelProp) {
      implementedInterfaces.push('ControlValueAccessor');
      return `const ${CUSTOM_VALUE_ACCESSOR_PROVIDER} = {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ${this.name}),
                multi: true
            }`;
    }

    return '';
  }

  needHostElementRef(options?: toStringOptions): boolean {
    return options?.mutableOptions?.hasRestAttributes
      || this.isPublicComponentWithPrivateProp;
  }

  compileContext(
    constructorStatements: string[],
    constructorArguments: string[],
    ngDoCheckStatements: string[],
    ngOnDestroyStatements: string[],
    resetDependantGetters: string[],
    options?: toStringOptions,
  ): string {
    let destroyContext = '';
    this.members.forEach((m) => {
      if (m.isProvider) {
        const name = m instanceof GetAccessor ? `${m._name}Provider` : m.name;
        constructorArguments.push(`@Host() private ${name}: ${m.context}`);

        if (!(m instanceof GetAccessor)) {
          constructorStatements.push(
            `this.${m.name}.value = ${(m as Property).initializer}`,
          );
        } else if (m instanceof GetAccessor) {
          ngDoCheckStatements.push(m.getter(SyntaxKind.ThisKeyword));
        }
      }
      if (m.isConsumer) {
        constructorArguments.push(
          `@SkipSelf() @Optional() private ${m.name}: ${m.context}`,
        );
        destroyContext = '_destroyContext: Array<()=>void> = [];';
        constructorStatements.push(
          `if(!${m.name}){
            this.${m.name} = new ${m.context}();
          } else {
            const changeHandler = (value: ${m.type})=>{
              this.${m.name}Consumer = value;
              ${resetDependantGetters.length ? 'this.resetDependantGetters();' : ''}
              this._detectChanges();
            };
            const subscription = ${m.name}.change.subscribe(changeHandler);
            this._destroyContext.push(()=>{
              subscription.unsubscribe();
            });
          }
          this.${m.name}Consumer = this.${m.name}.value;
          `,
        );
      }
    });

    if (this.needHostElementRef(options)) {
      constructorArguments.push('private _elementRef: ElementRef<HTMLElement>');
    }

    if (destroyContext.length) {
      ngOnDestroyStatements.push('this._destroyContext.forEach(d=>d())');
    }
    return destroyContext;
  }

  compileDefaultPropsForTemplates(options: toStringOptions) {
    if (options.templateComponents?.length) {
      return options.templateComponents
        .map((c) => {
          const defaults = getProps(c.members)
            .filter((p) => p.initializer)
            .map((p) => `${p.name}: ${p.initializer}`)
            .join(',');
          return defaults ? `${c.name}Defaults = {${defaults}}` : '';
        })
        .filter((d) => d)
        .join('\n');
    }
    return '';
  }

  returnGetAccessorBlock(
    argumentPattern: BindingPattern,
    options: toStringOptions,
    _spreadVar: BindingElement,
  ): Block {
    const props = getProps(options.members);
    const args = argumentPattern.getAllDependency(options);
    const res = props
      .filter((p) => !args.includes(p))
      .map((r) => r._name.toString())
      .map(
        (r) => new PropertyAssignment(
          new Identifier(r),
          new PropertyAccess(
            new PropertyAccess(
              new SimpleExpression(SyntaxKind.ThisKeyword),
              new Identifier('props'),
            ),
            new Identifier(r),
          ),
        ),
      );
    return new Block(
      [new ReturnStatement(new ObjectLiteral(res, false))],
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

  compileDynamicComponents(
    decoratorToStringOptions: toStringOptions,
    coreImports: string[],
    ngAfterViewInitStatements: string[],
    ngAfterViewCheckedStatements: string[],
  ): string {
    if (decoratorToStringOptions.hasDynamicComponents) {
      coreImports.push('ViewChildren', 'EventEmitter', 'QueryList');

      ngAfterViewInitStatements.push('this.createDynamicComponents()');
      ngAfterViewCheckedStatements.push('this.createDynamicComponents()');

      return `
      @ViewChildren(DynamicComponentDirective) dynamicComponentHost!: QueryList<
      DynamicComponentDirective
      >;
      createDynamicComponents(){
        this.dynamicComponentHost.toArray().forEach(container=>{
          container.createComponent(this);
        });
      }`;
    }
    return '';
  }

  compileDefaultTemplateImports(
    missedDefautTemplatesImports:
    ({ module: string, name: string, path: string, isDefault: boolean } | undefined)[][]
    | undefined,
  ): string {
    return missedDefautTemplatesImports
      ? missedDefautTemplatesImports
        .map((m) => m
          .map((c) => {
            if (c) {
              return `import ${c.isDefault ? `${c.name}, {` : `{ ${c.name},`} ${c.module}} from '${c.path}';`;
            }
            return '';
          })
          .join(';')).join('\n') : '';
  }

  findMissedTemplates(decoratorToStringOptions: toStringOptions,
    modules: string[],
    entryComponents: string[]):
    ({ module: string, name: string, path: string, isDefault: boolean } | undefined)[][]
    | undefined {
    return decoratorToStringOptions?.templateComponents
      ?.map((c) => getProps(c.members)
        .map((p) => {
          const missedComponent = p.initializer && (c as AngularComponent)
            .context.components?.[p.initializer.toString()] ? (c as AngularComponent)
              .context.components?.[p.initializer.toString()] as AngularComponent : undefined;
          if (this.context.dirname
            && missedComponent
            && missedComponent.context.path
            && missedComponent.context.dirname
          ) {
            modules.push(missedComponent.module);
            entryComponents.push(missedComponent.name);
            const relativePath = getRelativePath(missedComponent.context.dirname,
              this.context.dirname, path.basename(missedComponent.context.path));
            const importPath = relativePath.replace(path.extname(relativePath), '');
            return {
              module: missedComponent.module,
              name: missedComponent.name,
              path: importPath,
              isDefault: missedComponent.modifiers.includes('default'),
            };
          }
          return undefined;
        }));
  }

  getPropsWithDefault(): Property[] {
    return this.members.filter((m) => m instanceof Property
      && (m.isState || m._hasDecorator(Decorators.OneWay))
      && m.initializer && m.initializer.toString()) as Property[];
  }

  compileDefaultInputValues(
    ngOnChangesStatements: string[],
    constructorStatements: string[],
  ): string {
    const propsWithDefault = this.getPropsWithDefault();

    if (propsWithDefault.length) {
      ngOnChangesStatements.push('updateUndefinedFromDefaults(this as Record<string, unknown>, changes, this.defaultEntries)');

      const propsClass = this.heritageClauses
        .filter((h) => h.isJsxComponent)
        .map((h) => h.types.map((t) => t.type.toString()))[0];

      constructorStatements.push(
        `const defaultProps = new ${propsClass}() as {[key: string]: any};`,
        `this.defaultEntries = [${propsWithDefault.map((p) => `"${p.name}"`).join(',')}].map(key=>({key, value: defaultProps[key]}))`,
      );

      return 'defaultEntries: DefaultEntries';
    }
    return '';
  }

  getContentTemplateOutlet(refName: string): string {
    return `<ng-content *ngTemplateOutlet="${refName}?.widgetTemplate"></ng-content>`;
  }

  compileRestAttributesProp(options: toStringOptions): string {
    if (options.mutableOptions?.hasRestAttributes) {
      const property = new Property(
        [new Decorator(new Call(
          new Identifier('OneWay'),
          undefined,
          [],
        ), this.context)],
        undefined,
        new Identifier('_restAttributes'),
        '?',
        'Record<string, unknown>',
        undefined,
      );

      return property.toString();
    }
    return '';
  }

  compilePrivateProperty(): string {
    if (this.isPublicComponentWithPrivateProp) {
      return '@Input() _private = false';
    }
    return '';
  }

  bindMethods(constructorStatements: string[]): void {
    this.members.forEach((member) => {
      if (member instanceof AngularMethod && member.needBind) {
        constructorStatements.push(`this.${member.name} = this.${member.name}.bind(this);`);
      }
    });
  }

  compileConstructor(constructorArguments: string[], constructorStatements: string[]): string {
    this.bindMethods(constructorStatements);
    return this.compileLifeCycle(
      'constructor',
      (constructorStatements.length || constructorArguments.length)
        && this.heritageClauses.length
        ? ['super()'].concat(constructorStatements)
        : constructorStatements,
      constructorArguments,
    );
  }

  toString() {
    const props = this.heritageClauses
      .filter((h) => h.isJsxComponent)
      .map((h) => h.types.map((t) => t.type.toString()));

    const components = this.context.components || {};

    const modules = Object.keys(components)
      .map((k) => components[k])
      .filter((c) => c instanceof AngularComponent && c !== this)
      .map((c) => (c as AngularComponent).module)
      .concat(['CommonModule']);

    const entryComponents = Object.keys(components).filter(
      (k) => components[k] instanceof AngularComponent && components[k] !== this,
    );

    const resetDependantGetters: string[] = [];
    const ngOnChangesStatements: string[] = [];
    const ngAfterViewInitStatements: string[] = [];
    const ngOnDestroyStatements: string[] = [];
    const ngAfterViewCheckedStatements: string[] = [];
    const ngDoCheckStatements: string[] = [];
    const constructorStatements: string[] = [];
    const coreImports: string[] = [
      'ChangeDetectionStrategy',
      'ChangeDetectorRef',
      'ViewContainerRef',
      'Renderer2',
      'ViewRef',
    ];
    const constructorArguments: string[] = [
      'private changeDetection: ChangeDetectorRef',
      'private renderer: Renderer2',
      'private viewContainerRef: ViewContainerRef',
    ];

    const cdkImports: string[] = [];

    const spreadGetAccessor = this.getViewSpreadAccessor(this.members);
    if (spreadGetAccessor) {
      this.members.push(spreadGetAccessor);
    }

    const decoratorToStringOptions: toStringOptions = {
      members: this.members,
      newComponentContext: this.viewModel ? '_viewModel' : '',
      disableTemplates: true,
      templateComponents: [],
      isSVG: this.isSVGComponent,
      mutableOptions: {},
    };

    const implementedInterfaces: string[] = [];

    this.fillProviders();

    const componentDecorator = this.decorator.toString(
      decoratorToStringOptions,
    );

    const spreadAttributes = this.compileSpreadAttributes(
      ngOnChangesStatements,
      coreImports,
      ngAfterViewInitStatements,
      ngAfterViewCheckedStatements,
      decoratorToStringOptions,
    );

    this.members
      .filter(
        (m) => m.isForwardRefProp
          && decoratorToStringOptions.forwardRefs?.some(
            (forwardRef) => forwardRef === m,
          ),
      )
      .forEach((m) => {
        const token = (m as Property).isOptional ? '?.' : '';
        ngAfterViewInitStatements.push(`
                this.${m.name}${token}(this.${m.name}__Ref__);
            `);
      });

    const nestedModules: string[] = [];
    const importModules: string[] = [];

    const portalComponent = this.containsPortal()
      ? this.compilePortalComponent(coreImports, cdkImports, importModules)
      : '';

    if (this.members.some((m) => m.isNestedComp)) {
      ngAfterViewInitStatements.push('this._detectChanges()');
    }

    const trackBy = this.compileTrackBy(decoratorToStringOptions);

    const dynamicComponents = this.compileDynamicComponents(
      decoratorToStringOptions,
      coreImports,
      ngAfterViewInitStatements,
      ngAfterViewCheckedStatements,
    );

    const dynamicComponentDirective = this.compileDynamicComponentDirective(
      decoratorToStringOptions,
      coreImports,
      importModules,
    );

    const missedDefautTemplatesImports = this.findMissedTemplates(
      decoratorToStringOptions,
      modules,
      entryComponents,
    );

    coreImports.push('ViewChild', 'TemplateRef');

    const memberToStringOptions: toStringOptions = {
      members: this.members,
      componentContext: SyntaxKind.ThisKeyword,
      newComponentContext: SyntaxKind.ThisKeyword,
      forwardRefs: decoratorToStringOptions.forwardRefs,
      isComponent: true,
      mutableOptions: decoratorToStringOptions.mutableOptions,
      hasStyle: decoratorToStringOptions.hasStyle,
    };

    const memberStatements = this.members
      .filter((m) => !m.inherited && !(m instanceof SetAccessor))
      .map((m) => {
        memberToStringOptions.variables = {};
        return m.toString(memberToStringOptions);
      })
      .filter((m) => m)
      .join('\n');

    return `
        ${this.compileImports(coreImports, memberToStringOptions)}
        ${this.compileCdkImports(cdkImports)}
        ${this.compileDefaultTemplateImports(missedDefautTemplatesImports)}
        ${this.compileNestedComponents(nestedModules)}
        ${dynamicComponentDirective}
        ${portalComponent}
        ${this.compileDefaultOptions(constructorStatements)}
        ${this.compileValueAccessor(implementedInterfaces)}
        ${componentDecorator}
        ${this.modifiers.join(' ')} class ${this.name} ${props.length ? `extends ${props.join(' ')}` : ''} ${implementedInterfaces.length
  ? `implements ${implementedInterfaces.join(',')}`
  : ''
} {
            ${this.extractGlobalsFromTemplate(
    componentDecorator + trackBy,
    ' = ',
  ).join(';\n')}
            ${this.compileDefaultInputValues(ngOnChangesStatements, constructorStatements)}
            ${this.compileRestAttributesProp(memberToStringOptions)}
            ${this.compilePrivateProperty()}
            ${memberStatements}
            ${spreadAttributes}
            ${trackBy}
            ${dynamicComponents}
            ${this.compileEffects(
    ngAfterViewInitStatements,
    ngOnDestroyStatements,
    ngOnChangesStatements,
    ngAfterViewCheckedStatements,
    ngDoCheckStatements,
  )}
            ${this.compileGetterCache(ngOnChangesStatements,
    { ...decoratorToStringOptions, componentContext: SyntaxKind.ThisKeyword },
    resetDependantGetters)}
            ${this.compileContext(
    constructorStatements,
    constructorArguments,
    ngDoCheckStatements,
    ngOnDestroyStatements,
    resetDependantGetters,
    memberToStringOptions,
  )}
            ${this.compileNgModel()}
            ${this.compileLifeCycle(
    'ngAfterViewInit',
    ngAfterViewInitStatements,
  )}
            ${this.compileLifeCycle('ngOnChanges', ngOnChangesStatements, [
    `${ngOnChangesParameters[0]}: {[name:string]: any}`,
  ])}
            ${this.compileLifeCycle('ngOnDestroy', ngOnDestroyStatements)}
            ${this.compileLifeCycle(
    'ngAfterViewChecked',
    ngAfterViewCheckedStatements,
  )}
            ${this.compileLifeCycle('ngDoCheck', ngDoCheckStatements)}
            ${this.compileBindEvents(constructorStatements, { ...decoratorToStringOptions, componentContext: SyntaxKind.ThisKeyword })}
            @ViewChild('widgetTemplate', { static: true }) widgetTemplate!: TemplateRef<any>;
            ${this.compileConstructor(constructorArguments, constructorStatements)}
            ${this.members.filter((m) => m instanceof SetAccessor).join('\n')}
            ${this.compileNgStyleProcessor(decoratorToStringOptions)}
            ${this.compileDefaultPropsForTemplates(decoratorToStringOptions)}
        }
        @NgModule({
            declarations: [${this.name}, ${nestedModules
  .concat(importModules)
  .join(', ')}],
            imports: [
                ${modules.join(',\n')}
            ],
            ${entryComponents.length
    ? `entryComponents: [
              ${entryComponents.join(',\n')}
            ],`
    : ''
}
            exports: [${this.name}, ${nestedModules.join(', ')}]
        })
        export class ${this.module} {}
        export { ${this.name} as Dx${this.name}Component };
        ${this.compileDefaultComponentExport()}
        `;
  }
}
