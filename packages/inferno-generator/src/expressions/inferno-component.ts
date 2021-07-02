import {
  BaseClassMember,
  BindingElement,
  BindingPattern,
  Block,
  Decorators,
  getProps,
  Identifier,
  Method,
  ObjectLiteral,
  Property as BaseProperty,
  ReturnStatement,
  SimpleExpression,
  SimpleTypeExpression,
  SyntaxKind,
  toStringOptions,
  TypeExpression,
  VariableDeclarationList,
  VariableStatement,
} from '@devextreme-generator/core';
import { PreactComponent } from '@devextreme-generator/preact';

import { GetAccessor } from './class-members/get-accessor';
import { Property } from './class-members/property';
import { PropertyAccess } from './property-access';
import { VariableDeclaration } from './variable-declaration';

const getEffectRunParameter = (effect: BaseClassMember) => effect.decorators
  .find((d) => d.name === Decorators.Effect)
  ?.getParameter('run')
  ?.valueOf();

export class InfernoComponent extends PreactComponent {
  get REF_OBJECT_TYPE(): string {
    return 'RefObject';
  }

  compileImportStatements(hooks: string[]): string[] {
    const coreImports = [];
    const hooksSet = new Set(hooks);
    const imports = ['import { createElement as h } from "inferno-compat";'];

    if (hooksSet.has('useRef')) {
      coreImports.push('createRef as infernoCreateRef');
    }

    if (this.jQueryRegistered) {
      imports.push('import { createReRenderEffect } from "@devextreme/vdom";');
    }

    if (coreImports.length) {
      imports.push(`import { ${coreImports.join(',')} } from "inferno"`);
    }

    return imports;
  }

  compileApiRefImports() {}

  addPrefixToMembers(members: (Property | Method)[]): (Property | Method)[] {
    return members;
  }

  processMembers(members: (Property | Method)[]): (BaseProperty | Method)[] {
    return super.processMembers(members).map((m) => {
      if (m._name.toString() === 'restAttributes') {
        m.prefix = '';
      }
      return m;
    });
  }

  getToStringOptions(): toStringOptions {
    return {
      ...super.getToStringOptions(),
      newComponentContext: 'this',
    };
  }

  createGetAccessor(
    name: Identifier,
    type: TypeExpression | string,
    block: Block,
  ): GetAccessor {
    return new GetAccessor(undefined, undefined, name, [], type, block);
  }

  compileViewModelArguments(): string {
    return `${super.compileViewModelArguments()} as ${this.name}`;
  }

  compileStateProperty(): string {
    const state = this.internalState.concat(this.state);

    if (state.length) {
      const type = `{${state.map((p) => p.typeDeclaration())}}`;
      return `
      state: ${type};
      `;
    }

    return 'state = {};';
  }

  compileStateInitializer(): string {
    const state = this.internalState.concat(this.state);

    if (state.length) {
      return `this.state = {
        ${state.map((p) => p.defaultDeclaration()).join(',\n')}
      };`;
    }

    return '';
  }

  compileGetterCache(componentWillUpdate_Statements: string[]): string {
    const getters = this.members.filter(
      (m) => m instanceof GetAccessor && m.isMemorized(),
    );

    if (getters.length) {
      const statements = [
        `__getterCache: {
            ${getters.map((g) => `${g._name}?:${g.type}`).join(';\n')}
          } = {}`,
      ];

      componentWillUpdate_Statements.push(`const changesFunc = (oldObj: { [name: string]: any }, nextObj: { [name: string]: any }) =>
      Object.keys(nextObj).reduce((changes, nextObjKey) => {
        if (oldObj[nextObjKey] !== nextObj[nextObjKey])
          changes.push(nextObjKey);
        return changes;
      }, [] as string[]);
    const [propsChanges, stateChanges, contextChanges] = [
      changesFunc(this.props, nextProps),
      changesFunc(this.state, nextState),
      changesFunc(this.context, context),
    ];`);

      getters.forEach((g) => {
        const allDeps = g.getDependency({
          members: this.members,
          componentContext: SyntaxKind.ThisKeyword,
        });

        const deleteCacheStatement = `this.__getterCache["${g._name.toString()}"] = undefined;`;
        ['props', 'state', 'context'].forEach((dependency) => {
          if (allDeps.includes(dependency)) {
            componentWillUpdate_Statements.push(`if (${dependency}Changes.length){
              ${deleteCacheStatement}
            }`);
          }
        });
        const contextConsumers = this.members.map((member) => {
          if (member.isConsumer) {
            return {
              name: member._name.toString(),
              contextName: member?.decorators[0]?.expression?.arguments[0].toString(),
            };
          }
          return undefined;
        }).filter((contextConsumer) => contextConsumer) as Array<{
          name: string, contextName: string
        }>;
        if (allDeps.length) {
          const conditions = allDeps.map((dep) => {
            if (dep.indexOf('props.') === 0) {
              return `propsChanges.includes("${dep.replace('props.', '')}")`;
            }
            if (dep.indexOf('state.') === 0) {
              return `stateChanges.includes("${dep.replace('state.', '')}")`;
            }
            if (dep.indexOf('context.') === 0) {
              return `contextChanges.includes("${dep.replace('context.', '')}")`;
            }
            if (dep === 'props') {
              return 'propsChanges.length';
            }
            const dependencyContext = contextConsumers.find(
              (consumer) => consumer.name === dep,
            )?.contextName;
            return dependencyContext ? `contextChanges.includes("${dependencyContext}")` : 'false';
          });
          componentWillUpdate_Statements.push(`if (${conditions.join(' || ')}) {
            ${deleteCacheStatement}
          }`);
        }
      });
      return statements.join('\n');
    }
    return '';
  }

  compileComponentWillUpdate(statements: string[]): string {
    const superStatement = this.jQueryRegistered ? 'super.componentWillUpdate();' : '';
    if (statements.length > 1) {
      return `componentWillUpdate(nextProps, nextState, context) {
        ${statements.join('\n')}
        ${superStatement}
      }`;
    }
    return '';
  }

  compileEffects(): string {
    const createEffectsStatements: string[] = [];
    const updateEffectsStatements: string[] = [];
    if (this.effects.length || this.jQueryRegistered) {
      const dependencies = this.effects.map((e) => e.getDependency(this.getToStringOptions()).map((d) => `this.${d}`));

      const create = this.effects.map((e, i) => {
        const dependency = getEffectRunParameter(e) !== 'once' ? dependencies[i] : [];
        return `new InfernoEffect(this.${e.name}, [${dependency.join(',')}])`;
      });

      if (this.jQueryRegistered) {
        create.push('createReRenderEffect()');
      }

      createEffectsStatements.push(`
        return [
          ${create.join(',')}
        ];
      `);

      const update = this.effects.reduce((result: string[], effect, index) => {
        const run = getEffectRunParameter(effect);

        if (run !== 'once') {
          const dependency = dependencies[index];
          result.push(
            `this._effects[${index}]?.update([${dependency.join(',')}])`,
          );
        }
        return result;
      }, []);

      if (update.length) {
        updateEffectsStatements.push(update.join(';\n'));
      }
    }

    return `
      ${this.compileLifeCycle('createEffects', createEffectsStatements)}
      ${this.compileLifeCycle('updateEffects', updateEffectsStatements)}
    `;
  }

  compileLifeCycle(name: string, statements: string[]): string {
    if (statements.length) {
      return `${name}(){
        ${statements.join(';\n')}
      }`;
    }

    return '';
  }

  compileProviders(_providers: Property[], viewCallExpression: string): string {
    return viewCallExpression;
  }

  compileGetChildContext(): string {
    const providers = this.members.filter((m) => m.isProvider);

    if (providers.length) {
      const providersString = providers
        .map((p) => `${p.context}: this.${p.name}`)
        .join(',\n');
      return this.compileLifeCycle('getChildContext', [
        `return {
          ...this.context,
          ${providersString}
        }
      `,
      ]);
    }

    return '';
  }

  get jQueryRegistered(): boolean {
    const jqueryProp = this.decorators[0].getParameter('jQuery') as
      | ObjectLiteral
      | undefined;
    return jqueryProp?.getProperty('register')?.toString() === 'true';
  }

  // TODO: remove after inferno fixed https://github.com/infernojs/inferno/issues/1536
  createRestPropsGetter(members: BaseClassMember[]): GetAccessor {
    const props = getProps(members);
    const bindingElements = props
      .reduce((bindingElements, p) => {
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
      }, [] as BindingElement[])
      .concat([
        new BindingElement(
          SyntaxKind.DotDotDotToken,
          undefined,
          new Identifier('restProps'),
        ),
      ]);

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
      new ReturnStatement(new SimpleExpression('restProps')),
    ];

    return this.createGetAccessor(
      new Identifier('restAttributes'),
      new SimpleTypeExpression('RestProps'),
      new Block(statements, true),
    );
  }

  compileInstance(): string {
    const state = this.internalState;

    if (state.length) {
      return state
        .map((p) => (p as Property).instanceDeclaration())
        .join(';\n');
    }

    return '';
  }

  toString(): string {
    // TODO: uncomment after inferno fixed https://github.com/infernojs/inferno/issues/1536
    // const propsType = this.compilePropsType();
    const propsType = 'any';

    const properties = this.members.filter(
      (m) => m instanceof Property && !m.inherited && !m.isInternalState,
    );
    const bindMethods = this.members
      .filter((m) => m instanceof Method && !(m instanceof GetAccessor))
      .map((m) => `this.${m.name} = this.${m.name}.bind(this)`)
      .join(';\n');

    const hasEffects = this.effects.length > 0;
    const component = this.jQueryRegistered
      ? 'InfernoWrapperComponent'
      : hasEffects
        ? 'InfernoComponent'
        : 'BaseInfernoComponent';

    const componentWillUpdate: string[] = [];
    return `
            ${this.compileImports()}
            ${this.compileRestProps()}
            ${this.compileTemplateGetter()}
            ${this.modifiers.join(' ')} class ${
  this.name
} extends ${component}<${propsType}> {
                ${this.compileStateProperty()}
                refs: any;
                ${properties
    .map((p) => p.toString(this.getToStringOptions()))
    .join(';\n')}
                  
                constructor(props: ${propsType}) {
                    super(props);
                    ${this.compileStateInitializer()}
                    ${bindMethods}
                }

                ${this.compileInstance()};

                ${this.compileEffects()}
                
                ${this.compileGetChildContext()}

                ${this.effects
    .concat(this.methods)
    .concat(this.members.filter((m) => m.isApiMethod) as Method[])
    .map((m) => m.toString(this.getToStringOptions()))
    .join('\n')}
                ${this.compileGetterCache(componentWillUpdate)}
                ${this.compileComponentWillUpdate(componentWillUpdate)}
                render(){
                    const props = this.props;
                    return ${this.compileViewCall()}
                }
            }

            ${this.compileDefaultProps()}

            ${this.compileDefaultOptionsMethod()}
        `;
  }
}
