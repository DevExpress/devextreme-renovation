import path from 'path';

import {
  Call,
  compileType,
  dasherize,
  Decorator,
  Decorators,
  Expression,
  GeneratorContext as BaseGeneratorContext,
  GeneratorOptions as BaseGeneratorOptions,
  getModuleRelativePath,
  Identifier,
  ImportClause,
  ImportDeclaration as BaseImportDeclaration,
  isNamedImports,
  kebabSvgAttributes,
  mergeTypeExpressionImports,
  Method,
  ObjectLiteral,
  Parameter,
  reduceTypeExpressionImports,
  StringLiteral,
  toStringOptions,
  TypeExpression,
  UnionTypeNode,
} from '@devextreme-generator/core';
import {
  ComponentInput as BaseComponentInput,
  HeritageClause,
  JsxAttribute as ReactJsxAttribute,
  JsxClosingElement as ReactJsxClosingElement,
  JsxOpeningElement as ReactJsxOpeningElement,
  Property as ReactProperty,
  ReactComponent,
  ReactGenerator,
  TypeReferenceNode as ReactTypeReferenceNode,
} from '@devextreme-generator/react';

const BASE_JQUERY_WIDGET = 'BASE_JQUERY_WIDGET';

const processModuleFileName = (module: string) => `${module}`;

export class ComponentInput extends BaseComponentInput {
  context!: GeneratorContext;

  constructor(
    decorators: Decorator[],
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: any[],
    heritageClauses: HeritageClause[] = [],
    members: Array<Property | Method>,
    context: GeneratorContext,
  ) {
    super(
      decorators,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      context,
    );
  }

  createProperty(
    decorators: Decorator[],
    modifiers: string[] | undefined,
    name: Identifier,
    questionOrExclamationToken?: string,
    type?: TypeExpression,
    initializer?: Expression,
  ) {
    return new Property(
      decorators,
      modifiers,
      name,
      questionOrExclamationToken,
      type,
      initializer,
    );
  }

  processMembers(members: Array<Property | Method>) {
    members = members.map((m) => {
      if (m.isNested) {
        const index = m.decorators.findIndex(
          (d) => d.name === Decorators.Nested,
        );
        if (index > -1) {
          m.decorators[index] = this.createDecorator(
            new Call(new Identifier(Decorators.OneWay), undefined, []),
            {},
          );
        }
      }
      return m;
    });

    return super.processMembers(members);
  }

  buildTemplateProperties() {
    return [];
  }
}

export class PreactComponent extends ReactComponent {
  context!: GeneratorContext;

  get REF_OBJECT_TYPE() {
    return 'RefObject';
  }

  compilePortalComponentCore() {
    return `
    declare type PortalProps = {
      container?: HTMLElement | null;
      children: any,
    }
    const Portal = ({ container, children }: PortalProps): any => {
      if(container) {
        return createPortal(children, container);
      }
      return null;
    }`;
  }

  compileImportStatements(hooks: string[], compats: string[], core: string[]) {
    const imports = ["import * as Preact from 'preact'"];
    if (core.length) {
      imports.push(`import {${core.join(',')}} from "preact"`);
    }
    if (hooks.length) {
      imports.push(`import {${hooks.join(',')}} from "preact/hooks"`);
    }

    if (compats.length) {
      imports.push(`import {${compats.join(',')}} from "preact/compat"`);
    }

    return imports;
  }

  compileRestProps() {
    return 'declare type RestProps = { className?: string; style?: { [name: string]: any }, key?: any, ref?: any }';
  }

  compileDefaultComponentExport() {
    return '';
  }

  compileNestedComponents() {
    return '';
  }

  getJQueryBaseComponentName(): string | undefined {
    const jqueryProp = this.decorators[0].getParameter(
      'jQuery',
    ) as ObjectLiteral;
    const context = this.context;
    if (
      !context.jqueryBaseComponentModule
      || !context.jqueryBaseComponentModule
      || jqueryProp?.getProperty('register')?.toString() !== 'true'
    ) {
      return undefined;
    }
    return super.getJQueryBaseComponentName() || BASE_JQUERY_WIDGET;
  }

  compileFunctionalComponentType() {
    return `Preact.FunctionalComponent<${this.compilePropsType()}> & { defaultProps: ${this.getPropsType()}}`;
  }

  compileTemplateGetter() {
    return this.props.some((p) => p.isTemplate)
      ? `const getTemplate = (TemplateProp: any) => (
          (TemplateProp && (TemplateProp.defaultProps ? (props: any) => <TemplateProp {...props} /> : TemplateProp))
        );`
      : '';
  }

  processTemplates() {
    return this.props
      .filter((p) => p.isTemplate)
      .map((t) => `${t.name}: getTemplate(props.${t.name})`);
  }
}

class JQueryComponent {
  constructor(private source: PreactComponent) {}

  compileGetProps() {
    const statements: string[] = [];

    const templates = this.source.props.filter((p) => p.decorators.find((d) => d.name === 'Template'));
    statements.splice(
      -1,
      0,
      ...templates.map(
        (t) => `props.${t.name} = this._createTemplateComponent(props, props.${t.name});`,
      ),
    );

    if (this.source.props.find((p) => p.name === 'onKeyDown' && p.isEvent)) {
      statements.push(
        'props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);',
      );
    }

    if (!statements.length) {
      return '';
    }

    return `
        getProps() {
            const props = super.getProps();
            ${statements.join('\n')}
            return props;
        }
        `;
  }

  hasElementTypeParam(params: Parameter): boolean | undefined {
    return params.type?.toString()
      .split('|')
      .some((t) => t.endsWith('Element'));
  }

  compileAPI() {
    return (this.source.members.filter((a) => a.isApiMethod) as Method[])
      .map((a) => {
        const returnsElementType = a.type?.toString().endsWith('Element');
        const hasElementType = a.parameters.some((p) => this.hasElementTypeParam(p));
        const call = `this.viewRef?.${a._name}(${hasElementType ? `...args.map((a, index) => {
          return params[index];
        })` : 'arguments'})`;
        const getParams = (method: Method) => method.parameters.map((p) => {
          const param = p.name;
          return this.hasElementTypeParam(p) ? `this._patchElementParam(${param})` : param;
        }).join(',');

        return `${a._name}(${a.parameters})${compileType(a.type.toString())} | undefined {
          ${hasElementType ? `const params = [${getParams(a)}];
          const args = [].slice.call(arguments);` : ''}
          return ${returnsElementType ? `this._toPublicElement(${call})` : call};
        }`;
      })
      .join('\n');
  }

  compileImports(component: string, imports: string[] = []) {
    const context = this.source.context;

    imports.push(
      `import registerComponent from "${getModuleRelativePath(
        context.dirname!,
        context.jqueryComponentRegistratorModule!,
      )}"`,
    );

    if (component === BASE_JQUERY_WIDGET) {
      imports.push(
        `import BaseComponent from "${getModuleRelativePath(
          context.dirname!,
          context.jqueryBaseComponentModule!,
        )}"`,
      );
    } else {
      const importClause = context.nonComponentImports!.find(
        (i) => i.importClause.name?.toString() === component
          || (isNamedImports(i.importClause.namedBindings)
            && i.importClause.namedBindings.node.some(
              (n) => n.toString() === component,
            )),
      );
      if (importClause) {
        imports.push(importClause.toString());
      }
    }

    const relativePath = getModuleRelativePath(context.dirname!, context.path!);
    const defaultImport = this.source.modifiers.indexOf('default') !== -1;
    const widget = this.source.name;
    const widgetComponent = `${widget}Component`;
    imports.push(
      `import ${
        defaultImport
          ? `${widgetComponent}`
          : `{ ${widget} as ${widgetComponent} }`
      } from '${processModuleFileName(
        relativePath.replace(path.extname(relativePath), ''),
      )}'`,
    );

    return imports.join(';\n');
  }

  compileEventMap() {
    const statements = this.source.props.reduce((r: string[], p) => {
      if (
        p.isEvent
        && !this.source.state.find((s) => `${s.name}Change` === p.name)
        && p.name !== 'onKeyDown'
      ) {
        const actionConfig = p.decorators
          .find((d) => d.name === 'Event')!
          .getParameter('actionConfig');

        r.push(`${p.name}: ${(actionConfig as ObjectLiteral) || '{}'}`);
      }
      return r;
    }, []);

    if (!statements.length) {
      return '';
    }

    return `
        _getActionConfigs() {
            return {
                ${statements.join(',\n')}
            };
        }
        `;
  }

  compilePropsInfo() {
    const withNullType = this.source.props
      .concat(this.source.state)
      .reduce((arr: string[], prop) => {
        if (prop.type instanceof UnionTypeNode) {
          if (prop.type.types.some((t) => t.toString() === 'null')) {
            return [...arr, `'${prop.name}'`];
          }
        }
        return arr;
      }, []);

    const withElementType = this.source.props.reduce((arr: string[], prop) => {
      if (
        prop.type
          .toString()
          .split('|')
          .some((t) => t.endsWith('Element'))
      ) {
        return [...arr, `'${prop.name}'`];
      }

      return arr;
    }, []);

    const withoutInitializer = this.source.state.filter((s) => !s.initializer);
    if (withoutInitializer.length) {
      throw `You should specify default value other than 'undefined' for the following TwoWay props: ${withoutInitializer
        .map((s) => s.name)
        .join(', ')}`;
    }

    const templateList = this.source.props.reduce((arr: string[], prop) => {
      if (prop.isTemplate) {
        return [...arr, `'${prop.name}'`];
      }
      return arr;
    }, []);

    return `
        get _propsInfo() {
            return {
                twoWay: [${this.source.state.map(
    (s) => `['${s.name}', ${s.initializer}, '${s.name}Change']`,
  )}],
                allowNull: [${withNullType}],
                elements: [${withElementType}],
                templates: [${templateList}],
                props: [${[...this.source.props, ...this.source.state].map(({ name }) => `'${name}'`)}]
            };
        }
        `;
  }

  compileImportTypes(): string {
    const context: GeneratorContext = {
      ...this.source.context,
      imports: {},
      types: {},
      interfaces: {},
      path: `${this.source.context.dirname}/jquery.tsx`,
    };

    const missedImports = reduceTypeExpressionImports(
      this.source.members.filter((a) => a.isApiMethod) as Method[],
      context,
    );

    return mergeTypeExpressionImports(missedImports).join('\n');
  }

  toString() {
    const baseComponent = this.source.getJQueryBaseComponentName();
    if (!baseComponent) {
      return '';
    }

    return `
        ${this.compileImports(baseComponent)}

        ${this.compileImportTypes()}

        export default class ${this.source.name} extends ${
  baseComponent === BASE_JQUERY_WIDGET
    ? 'BaseComponent'
    : baseComponent.toString()
} {
            ${this.compileGetProps()}

            ${this.compileAPI()}

            ${this.compileEventMap()}

            ${this.compilePropsInfo()}

            get _viewComponent() {
                return ${this.source.name}Component;
            }
        }

        registerComponent("dx${this.source.name}", ${this.source.name});
        `;
  }
}

export class Property extends ReactProperty {
  typeDeclaration() {
    if (this.isSlot || this.isTemplate) {
      return `${this.name}${this.compileTypeDeclarationType('any')}`;
    }
    return super.typeDeclaration();
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
    if (this.isRef || this.isForwardRef) {
      return `const ${
        this.name
      }:RefObject<${this.compileRefType()}>=useRef<${this.compileRefType()}>(null)`;
    }
    return super.toString(options);
  }
}

const processTagName = (tagName: Expression) => (tagName.toString() === 'Fragment'
  ? new Identifier('Preact.Fragment')
  : tagName);

class JsxOpeningElement extends ReactJsxOpeningElement {
  processTagName(tagName: Expression) {
    return processTagName(tagName);
  }
}

class JsxClosingElement extends ReactJsxClosingElement {
  processTagName(tagName: Expression) {
    return processTagName(tagName);
  }
}

export class JsxAttribute extends ReactJsxAttribute {
  processName(name: string, options?: toStringOptions) {
    if (!options?.jsxComponent && kebabSvgAttributes.has(name)) {
      return dasherize(name);
    }
    return super.processName(name, options);
  }
}

export class TypeReferenceNode extends ReactTypeReferenceNode {
  constructor(
    public typeName: Identifier,
    public typeArguments: TypeExpression[] = [],
    public context: GeneratorContext,
  ) {
    super(typeName, typeArguments, context);
    if (typeName.toString() === 'RefObject') {
      this.typeName = new Identifier('any');
      this.typeArguments = [];
    }
    if (typeName.toString() === 'CSSAttributes') {
      this.typeName = new Identifier('any');
    }
  }

  toString() {
    if (this.typeName.toString().startsWith('JSX.')) {
      return 'any';
    }
    return super.toString();
  }
}

export type GeneratorOptions = {
  jqueryComponentRegistratorModule?: string;
  jqueryBaseComponentModule?: string;
  nonComponentImports?: ImportDeclaration[];
  generateJQueryOnly?: boolean;
} & BaseGeneratorOptions;

export type GeneratorContext = BaseGeneratorContext & GeneratorOptions;

export class ImportDeclaration extends BaseImportDeclaration {
  compileComponentDeclarationImport() {
    const preact: string[] = [];
    const compat: string[] = [];

    const result: string[] = [];

    if (this.has('createContext')) {
      preact.push('createContext');
    }
    if (this.has('Portal')) {
      compat.push('createPortal');
    }

    if (preact.length) {
      result.push(`import { ${preact} } from "preact"`);
    }
    if (compat.length) {
      result.push(`import { ${compat} } from "preact/compat"`);
    }
    if (result.length) {
      return result.join(';\n');
    }
    return super.compileComponentDeclarationImport();
  }
}

export class PreactGenerator extends ReactGenerator {
  options: GeneratorOptions = {};

  context: GeneratorContext[] = [];

  setContext(context: GeneratorContext | null) {
    if (context && !context.nonComponentImports) {
      context.nonComponentImports = [];
    }
    super.setContext(context);
  }

  getInitialContext(): GeneratorContext {
    const options = this.options;
    return {
      ...super.getInitialContext(),
      jqueryComponentRegistratorModule:
        options.jqueryComponentRegistratorModule
        && path.resolve(options.jqueryComponentRegistratorModule),
      jqueryBaseComponentModule:
        options.jqueryBaseComponentModule
        && path.resolve(options.jqueryBaseComponentModule),
    };
  }

  generate(
    factory: any,
    createFactoryOnly: boolean,
  ): { path?: string; code: string }[] {
    const result = super.generate(factory, createFactoryOnly);

    const { path } = this.getContext();
    const source = path && this.cache[path].find((e: any) => e instanceof PreactComponent);
    if (source) {
      result.push({
        path: `${path!.replace(/\.tsx$/, '.j.tsx')}`,
        code: this.format(new JQueryComponent(source).toString()),
      });
    }

    if (this.options.generateJQueryOnly) {
      return result[1] ? [result[1]] : [{ code: '' }];
    }

    return result;
  }

  createImportDeclaration(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    importClause: ImportClause = new ImportClause(),
    moduleSpecifier: StringLiteral,
  ) {
    const importStatement = super.createImportDeclaration(
      decorators,
      modifiers,
      importClause,
      moduleSpecifier,
    );

    const module = moduleSpecifier.expression.toString();
    const modulePath = `${module}.tsx`;
    const context = this.getContext() as GeneratorContext;
    if (context.dirname) {
      const fullPath = path.resolve(context.dirname, modulePath);
      if (this.cache[fullPath]) {
        (importStatement as ImportDeclaration).replaceSpecifier(
          module,
          processModuleFileName(module),
        );
      } else if (importStatement) {
        context.nonComponentImports!.push(
          importStatement as ImportDeclaration,
        );
      }
    }
    return importStatement;
  }

  processSourceFileName(name: string) {
    return name.replace(/\.tsx$/, '.tsx');
  }

  createComponent(
    componentDecorator: Decorator,
    modifiers: string[],
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
  ) {
    return new PreactComponent(
      componentDecorator,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      this.getContext(),
    );
  }

  createJsxOpeningElement(
    tagName: Identifier,
    typeArguments: any[],
    attributes: JsxAttribute[] = [],
  ) {
    return new JsxOpeningElement(
      tagName,
      typeArguments,
      attributes,
      this.getContext(),
    );
  }

  createJsxClosingElement(tagName: Identifier) {
    return new JsxClosingElement(tagName);
  }

  createJsxAttribute(name: Identifier, initializer: Expression) {
    return new JsxAttribute(name, initializer);
  }

  createTypeReferenceNode(
    typeName: Identifier,
    typeArguments?: TypeExpression[],
  ) {
    return new TypeReferenceNode(typeName, typeArguments, this.getContext());
  }

  createProperty(
    decorators: Decorator[],
    modifiers: string[] = [],
    name: Identifier,
    questionOrExclamationToken = '',
    type?: TypeExpression,
    initializer?: Expression,
  ) {
    return new Property(
      decorators,
      modifiers,
      name,
      questionOrExclamationToken,
      type,
      initializer,
    );
  }

  createComponentBindings(
    decorators: Decorator[],
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
  ) {
    return new ComponentInput(
      decorators,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      this.getContext(),
    );
  }

  createImportDeclarationCore(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    importClause: ImportClause,
    moduleSpecifier: StringLiteral,
  ) {
    return new ImportDeclaration(
      decorators,
      modifiers,
      importClause,
      moduleSpecifier,
      this.getContext(),
    );
  }

  removeJQueryBaseModule() {}
}

export default new PreactGenerator();
