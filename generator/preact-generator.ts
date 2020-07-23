import {
  ReactGenerator,
  ReactComponent,
  Property as BaseProperty,
  JsxAttribute,
  JsxOpeningElement as ReactJsxOpeningElement,
  JsxClosingElement as ReactJsxClosingElement,
  HeritageClause,
  ComponentInput as BaseComponentInput,
  TypeReferenceNode as BaseTypeReferenceNode,
  getPropName,
} from "./react-generator";
import path from "path";
import { Expression } from "./base-generator/expressions/base";
import { Identifier } from "./base-generator/expressions/common";
import {
  ImportClause,
  ImportDeclaration,
  isNamedImports,
} from "./base-generator/expressions/import";
import {
  StringLiteral,
  ObjectLiteral,
} from "./base-generator/expressions/literal";
import { TypeExpression } from "./base-generator/expressions/type";
import { getModuleRelativePath } from "./base-generator/utils/path-utils";
import {
  GeneratorContext as BaseGeneratorContext,
  GeneratorOptions as BaseGeneratorOptions,
} from "./base-generator/types";
import { Decorator } from "./base-generator/expressions/decorator";
import { Method } from "./base-generator/expressions/class-members";
import {
  capitalizeFirstLetter,
  compileType,
} from "./base-generator/utils/string";

const BASE_JQUERY_WIDGET = "BASE_JQUERY_WIDGET";

const processModuleFileName = (module: string) => `${module}`;

export class ComponentInput extends BaseComponentInput {
  createProperty(
    decorators: Decorator[],
    modifiers: string[] | undefined,
    name: Identifier,
    questionOrExclamationToken?: string,
    type?: TypeExpression,
    initializer?: Expression
  ) {
    return new Property(
      decorators,
      modifiers,
      name,
      questionOrExclamationToken,
      type,
      initializer
    );
  }
  createChildrenForNested(members: Array<BaseProperty | Method>) {
    return null;
  }
}

export class PreactComponent extends ReactComponent {
  context!: GeneratorContext;

  constructor(
    decorator: Decorator,
    modifiers: string[],
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
    context: GeneratorContext
  ) {
    super(
      decorator,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      context
    );
  }

  compileImportStatements(hooks: string[], compats: string[]) {
    const imports = [`import * as Preact from "preact"`];
    if (hooks.length) {
      imports.push(
        `import {${hooks
          .filter((hook) => hook !== "useMemo")
          .join(",")}} from "preact/hooks"`
      );
    }

    if (compats.length) {
      imports.push(`import {${compats.join(",")}} from "preact/compat"`);
    }

    return imports;
  }

  processModuleFileName(module: string) {
    return processModuleFileName(module);
  }

  defaultPropsDest() {
    return `(${this.name} as any).defaultProps`;
  }

  compileRestProps() {
    return "declare type RestProps = { className?: string; style?: { [name: string]: any }; [x: string]: any }";
  }

  createNestedGetter() {
    return null;
  }

  compileDefaultComponentExport() {
    return "";
  }

  compileNestedComponents() {
    return "";
  }
  getJQueryBaseComponentName(): string | undefined {
    const jqueryProp = this.decorators[0].getParameter(
      "jQuery"
    ) as ObjectLiteral;
    const context = this.context;
    if (
      !context.jqueryBaseComponentModule ||
      !context.jqueryBaseComponentModule ||
      jqueryProp?.getProperty("register")?.toString() !== "true"
    ) {
      return undefined;
    }
    return super.getJQueryBaseComponentName() || BASE_JQUERY_WIDGET;
  }
  createNestedPropertyGetter() {
    return "";
  }
}

class JQueryComponent {
  constructor(private source: PreactComponent) {}

  compileGetProps() {
    const statements: string[] = [];

    const templates = this.source.props.filter((p) =>
      p.decorators.find((d) => d.name === "Template")
    );
    statements.splice(
      -1,
      0,
      ...templates.map(
        (t) =>
          `props.${t.name} = this._createTemplateComponent(props, props.${t.name});`
      )
    );

    if (this.source.props.find((p) => p.name === "onKeyDown" && p.isEvent)) {
      statements.push(
        "props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);"
      );
    }

    if (!statements.length) {
      return "";
    }

    return `
        getProps() {
            const props = super.getProps();
            ${statements.join("\n")}
            return props;
        }
        `;
  }

  compileAPI() {
    return (this.source.members.filter((a) => a.isApiMethod) as Method[])
      .map(
        (a) => `${a.name}(${a.parameters})${compileType(a.type.toString())} {
                return this.viewRef.${a.name}(${a.parameters
          .map((p) => p.name)
          .join(",")});
            }`
      )
      .join("\n");
  }

  compileImports(component: string) {
    const context = this.source.context;

    const imports: string[] = [];

    imports.push(
      `import registerComponent from "${getModuleRelativePath(
        context.dirname!,
        context.jqueryComponentRegistratorModule!
      )}"`
    );

    if (component === BASE_JQUERY_WIDGET) {
      imports.push(
        `import BaseComponent from "${getModuleRelativePath(
          context.dirname!,
          context.jqueryBaseComponentModule!
        )}"`
      );
    } else {
      const importClause = context.noncomponentImports!.find(
        (i) =>
          i.importClause.name?.toString() === component ||
          (isNamedImports(i.importClause.namedBindings) &&
            i.importClause.namedBindings.node.some(
              (n) => n.toString() === component
            ))
      );
      if (importClause) {
        imports.push(importClause.toString());
      }
    }

    const relativePath = getModuleRelativePath(context.dirname!, context.path!);
    const defaultImport = this.source.modifiers.indexOf("default") !== -1;
    const widget = this.source.name;
    const widgetComponent = `${widget}Component`;
    imports.push(
      `import ${
        defaultImport
          ? `${widgetComponent}`
          : `{ ${widget} as ${widgetComponent} }`
      } from '${processModuleFileName(
        relativePath.replace(path.extname(relativePath), "")
      )}'`
    );

    return imports.join(";\n");
  }

  compileEventMap() {
    const statements = this.source.props.reduce((r: string[], p) => {
      if (
        p.isEvent &&
        !this.source.state.find((s) => `${s.name}Change` === p.name) &&
        p.name !== "onKeyDown"
      ) {
        const actionConfig = p.decorators
          .find((d) => d.name === "Event")!
          .getParameter("actionConfig");

        r.push(`${p.name}: ${(actionConfig as ObjectLiteral) || "{}"}`);
      }
      return r;
    }, []);

    if (!statements.length) {
      return "";
    }

    return `
        _getActionConfigs() {
            return {
                ${statements.join(",\n")}
            };
        }
        `;
  }

  compileTwoWayPropsInfo() {
    if (!this.source.state.length) {
      return "";
    }

    return `
        get _twoWayProps() {
            return [
                ${this.source.state.map(
                  (s) =>
                    `['${s.name}', 'default${capitalizeFirstLetter(
                      s.name
                    )}', '${s.name}Change']`
                )}
            ]
        }
        `;
  }

  toString() {
    const baseComponent = this.source.getJQueryBaseComponentName();
    if (!baseComponent) {
      return "";
    }

    return `
        ${this.compileImports(baseComponent)}

        export default class ${this.source.name} extends ${
      baseComponent === BASE_JQUERY_WIDGET
        ? "BaseComponent"
        : baseComponent.toString()
    } {
            ${this.compileGetProps()}
            
            ${this.compileAPI()}
    
            ${this.compileEventMap()}

            ${this.compileTwoWayPropsInfo()}

            get _viewComponent() {
                return ${this.source.name}Component;
            }
        }
    
        registerComponent("dxr${this.source.name}", ${this.source.name});
        `;
  }
}

export class Property extends BaseProperty {
  typeDeclaration() {
    if (this.decorators.find((d) => d.name === "Slot")) {
      return `${this.name}${this.questionOrExclamationToken}:any`;
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
      true
    );
  }

  getDependency() {
    const baseValue = super.getDependency();
    if (this.isNested) {
      return [baseValue[0]];
    }
    return baseValue;
  }

  getter(componentContext?: string) {
    if (this.isNested) {
      componentContext = this.processComponentContext(componentContext);
      const scope = this.processComponentContext(this.scope);
      return getPropName(this.name, componentContext, scope);
    }
    return super.getter(componentContext);
  }
}

const processTagName = (tagName: Expression) =>
  tagName.toString() === "Fragment"
    ? new Identifier("Preact.Fragment")
    : tagName;

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

export class TypeReferenceNode extends BaseTypeReferenceNode {
  toString() {
    if (this.typeName.toString().startsWith("JSX.")) {
      return "any";
    }
    return super.toString();
  }
}

export type GeneratorOptions = {
  jqueryComponentRegistratorModule?: string;
  jqueryBaseComponentModule?: string;
  noncomponentImports?: ImportDeclaration[];
  generateJQueryOnly?: boolean;
} & BaseGeneratorOptions;

export type GeneratorContext = BaseGeneratorContext & GeneratorOptions;

export class PreactGenerator extends ReactGenerator {
  options: GeneratorOptions = {};

  context: GeneratorContext[] = [];

  setContext(context: GeneratorContext | null) {
    context &&
      !context.noncomponentImports &&
      (context.noncomponentImports = []);
    super.setContext(context);
  }

  getInitialContext(): GeneratorContext {
    const options = this.options;
    return {
      ...super.getInitialContext(),
      jqueryComponentRegistratorModule:
        options.jqueryComponentRegistratorModule &&
        path.resolve(options.jqueryComponentRegistratorModule),
      jqueryBaseComponentModule:
        options.jqueryBaseComponentModule &&
        path.resolve(options.jqueryBaseComponentModule),
    };
  }

  generate(factory: any): { path?: string; code: string }[] {
    const result = super.generate(factory);

    const { path } = this.getContext();
    const source =
      path && this.cache[path].find((e: any) => e instanceof PreactComponent);
    if (source) {
      result.push({
        path: `${path!.replace(/\.tsx$/, ".j.tsx")}`,
        code: this.format(new JQueryComponent(source).toString()),
      });
    }

    if (this.options.generateJQueryOnly) {
      return result[1] ? [result[1]] : [{ code: "" }];
    }

    return result;
  }

  createImportDeclaration(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    importClause: ImportClause = new ImportClause(),
    moduleSpecifier: StringLiteral
  ) {
    const importStatement = super.createImportDeclaration(
      decorators,
      modifiers,
      importClause,
      moduleSpecifier
    );

    const module = moduleSpecifier.expression.toString();
    const modulePath = `${module}.tsx`;
    const context = this.getContext() as GeneratorContext;
    if (context.dirname) {
      const fullPath = path.resolve(context.dirname, modulePath);
      if (this.cache[fullPath]) {
        (importStatement as ImportDeclaration).replaceSpecifier(
          module,
          processModuleFileName(module)
        );
      } else {
        importStatement &&
          context.noncomponentImports!.push(
            importStatement as ImportDeclaration
          );
      }
    }
    return importStatement;
  }

  processSourceFileName(name: string) {
    return name.replace(/\.tsx$/, ".tsx");
  }

  createComponent(
    componentDecorator: Decorator,
    modifiers: string[],
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>
  ) {
    return new PreactComponent(
      componentDecorator,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      this.getContext()
    );
  }

  createJsxOpeningElement(
    tagName: Identifier,
    typeArguments: any[],
    attributes: JsxAttribute[] = []
  ) {
    return new JsxOpeningElement(
      tagName,
      typeArguments,
      attributes,
      this.getContext()
    );
  }

  createJsxClosingElement(tagName: Identifier) {
    return new JsxClosingElement(tagName);
  }

  createTypeReferenceNode(
    typeName: Identifier,
    typeArguments?: TypeExpression[]
  ) {
    return new TypeReferenceNode(typeName, typeArguments, this.getContext());
  }

  createProperty(
    decorators: Decorator[],
    modifiers: string[] = [],
    name: Identifier,
    questionOrExclamationToken: string = "",
    type?: TypeExpression,
    initializer?: Expression
  ) {
    return new Property(
      decorators,
      modifiers,
      name,
      questionOrExclamationToken,
      type,
      initializer
    );
  }

  createComponentBindings(
    decorators: Decorator[],
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>
  ) {
    return new ComponentInput(
      decorators,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      this.getContext()
    );
  }

  removeJQueryBaseModule() {}
}

export default new PreactGenerator();
