import { Identifier, Call } from "../../base-generator/expressions/common";
import { Decorators } from "../../component_declaration/decorators";
import { Decorator } from "../../base-generator/expressions/decorator";
import { BaseClassMember } from "../../base-generator/expressions/class-members";
import {
  getProps,
  Component,
} from "../../base-generator/expressions/component";
import {
  BindingElement,
  BindingPattern,
} from "../../base-generator/expressions/binding-pattern";
import SyntaxKind from "../../base-generator/syntaxKind";
import {
  VariableStatement,
  VariableDeclaration,
  VariableDeclarationList,
} from "../../base-generator/expressions/variables";
import { PropertyAccess } from "./property-access";
import {
  SimpleExpression,
  Expression,
} from "../../base-generator/expressions/base";
import {
  ReturnStatement,
  Block,
} from "../../base-generator/expressions/statements";
import {
  SimpleTypeExpression,
  ArrayTypeNode,
  extractComplexType,
  isTypeArray,
} from "../../base-generator/expressions/type";
import { TypeParameterDeclaration } from "../../base-generator/expressions/type-parameter-declaration";
import {
  Parameter,
  Function,
} from "../../base-generator/expressions/functions";
import { getModuleRelativePath } from "../../base-generator/utils/path-utils";
import { Property, getPropName } from "./class-members/property";
import { Property as BaseProperty } from "../../base-generator/expressions/class-members";
import { Method } from "./class-members/method";
import { GetAccessor } from "./class-members/get-accessor";
import { ObjectLiteral } from "../../base-generator/expressions/literal";
import path from "path";
import { ComponentInput, getTemplatePropName } from "./react-component-input";
import {
  capitalizeFirstLetter,
  removePlural,
} from "../../base-generator/utils/string";
import { Conditional } from "../../base-generator/expressions/conditions";

function getSubscriptions(methods: Method[]) {
  return methods
    .map((m) => {
      const [event, parameters] = m.decorators.find(
        (d) => d.name === "Listen"
      )!.expression.arguments;

      let target: string | undefined;
      if (parameters instanceof ObjectLiteral) {
        target = parameters.getProperty("target")?.toString();
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
  processMembers(members: Array<BaseProperty | Method>) {
    members.forEach((m) => {
      const forwardRefIndex = m.decorators.findIndex(
        (d) => d.name === Decorators.ForwardRef
      );
      if (forwardRefIndex > -1) {
        m.decorators[forwardRefIndex] = new Decorator(
          new Call(new Identifier(Decorators.Ref), undefined, []),
          {}
        );
      }
    });

    members = super.processMembers(members).map((p) => {
      if (p.inherited) {
        p.scope = "props";
      }
      return p;
    });

    if (members.some((m) => m.isNested)) {
      members.push(this.createNestedChildrenGetter());
    }
    (members.filter((m) => m.isNested) as Property[]).forEach((m) => {
      members.push(this.createNestedPropertyGetter(m));
    });

    return members;
  }

  createNestedChildrenGetter() {
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
                    new Identifier("children")
                  ),
                ],
                "object"
              ),
              undefined,
              new PropertyAccess(
                new SimpleExpression("this"),
                new Identifier("props")
              )
            ),
          ],
          SyntaxKind.ConstKeyword
        )
      ),
      new ReturnStatement(new SimpleExpression(`__collectChildren(children)`)),
    ];
    return new Method(
      [],
      undefined,
      undefined,
      new Identifier("__nestedChildren"),
      undefined,
      [new TypeParameterDeclaration(new Identifier("T"))],
      [],
      new ArrayTypeNode(new Identifier("T")),
      new Block(statements, true)
    );
  }

  createRestPropsGetter(members: BaseClassMember[]) {
    const props = getProps(members);
    const bindingElements = props
      .reduce((bindingElements, p) => {
        if (p._name.toString() === "export") {
          bindingElements.push(
            new BindingElement(undefined, p._name, "exportProp")
          );
        } else {
          bindingElements.push(
            new BindingElement(undefined, undefined, p._name)
          );
        }
        return bindingElements;
      }, [] as BindingElement[])
      .concat([
        new BindingElement(
          SyntaxKind.DotDotDotToken,
          undefined,
          new Identifier("restProps")
        ),
      ]);

    const statements = [
      new VariableStatement(
        undefined,
        new VariableDeclarationList(
          [
            new VariableDeclaration(
              new BindingPattern(bindingElements, "object"),
              undefined,
              new PropertyAccess(
                new SimpleExpression("this"),
                new Identifier("props")
              )
            ),
          ],
          SyntaxKind.ConstKeyword
        )
      ),
      new ReturnStatement(new SimpleExpression("restProps")),
    ];

    return new GetAccessor(
      undefined,
      undefined,
      new Identifier("restAttributes"),
      [],
      new SimpleTypeExpression("RestProps"),
      new Block(statements, true)
    );
  }

  createNestedChildrenCollector() {
    const statements = [
      new ReturnStatement(
        new SimpleExpression(`(React.Children.toArray(children)
            .filter((child) =>
              React.isValidElement(child) &&
              typeof child.type !== "string") as (React.ReactElement & { type: { propName: string } })[])
            .map(child => {
              const { children: childChildren, ...childProps } = child.props;
              const collectedChildren = {} as any;
              __collectChildren(childChildren).forEach(({ __name, ...restProps }: any) => {
                  if(__name) {
                    if(!collectedChildren[__name]) {
                      collectedChildren[__name] = [];
                    }
                    collectedChildren[__name].push(restProps);
                  }
                }
              );
              return {
                ...collectedChildren,
                ...childProps,
                __name: child.type.propName,
              }
            })`)
      ),
    ];

    return new Function(
      undefined,
      undefined,
      "",
      new Identifier("__collectChildren"),
      [new TypeParameterDeclaration(new Identifier("T"))],
      [
        new Parameter(
          [],
          [],
          "",
          new Identifier("children"),
          undefined,
          "React.ReactNode",
          undefined
        ),
      ],
      new ArrayTypeNode(new Identifier("T")),
      new Block(statements, true),
      this.context
    );
  }

  compileImportStatements(hooks: string[], compats: string[]) {
    const imports = [
      `import React, {${hooks
        .concat(compats)
        .concat(["HtmlHTMLAttributes"])
        .join(",")}} from 'react';`,
    ];

    return imports;
  }

  compileImports() {
    const imports: string[] = [];
    const hooks: string[] = [];
    const compats: string[] = [];

    if (
      this.internalState.length ||
      this.state.length ||
      this.members.some((m) => m.isProvider)
    ) {
      hooks.push("useState");
    }

    if (this.members.some((m) => m.isConsumer)) {
      hooks.push("useContext");
    }

    if (this.listeners.length || this.methods.length) {
      hooks.push("useCallback");
    }

    if (getSubscriptions(this.listeners).length || this.effects.length) {
      hooks.push("useEffect");
    }

    if (this.refs.length || this.apiRefs.length) {
      hooks.push("useRef");
    }

    if (this.members.some((m) => m.isRefProp || m.isForwardRefProp)) {
      hooks.push("RefObject");
    }

    if (this.members.filter((a) => a.isApiMethod).length) {
      hooks.push("useImperativeHandle");
      compats.push("forwardRef");
    }

    if (this.apiRefs.length) {
      imports.splice(
        -1,
        0,
        ...this.apiRefs.reduce((imports: string[], ref) => {
          const baseComponent = this.context.components![
            ref.type!.toString()
          ] as ReactComponent;
          if (this.context.dirname) {
            const relativePath = getModuleRelativePath(
              this.context.dirname,
              baseComponent.context.path!
            );
            imports.push(
              `import {${baseComponent.name}Ref as ${
                ref.type
              }Ref} from "${this.processModuleFileName(
                relativePath.replace(path.extname(relativePath), "")
              )}"`
            );
          }
          return imports;
        }, [])
      );
    }

    this.compileDefaultOptionsImport(imports);

    return imports
      .concat(this.compileImportStatements(hooks, compats))
      .join(";\n");
  }

  defaultPropsDest() {
    return `${this.name.toString()}.defaultProps`;
  }

  compileConvertRulesToOptions(rules: string | Expression) {
    return this.state.length
      ? `__processTwoWayProps(convertRulesToOptions(${rules}))`
      : `convertRulesToOptions<${this.getPropsType()}>(${rules})`;
  }

  compileDefaultProps() {
    const defaultProps = this.heritageClauses
      .filter((h) => h.defaultProps.length)
      .map((h) => `...${h.defaultProps}`)
      .concat(
        this.props
          .filter((p) => !p.inherited && p.initializer)
          .map((p) => (p as Property).defaultProps())
      );

    if (this.defaultOptionRules && this.needGenerateDefaultOptions) {
      defaultProps.push(
        `...${this.compileConvertRulesToOptions(this.defaultOptionRules)}`
      );
    }

    if (this.needGenerateDefaultOptions) {
      return `
                  ${
                    this.state.length
                      ? `function __processTwoWayProps(defaultProps: ${this.compilePropsType()}){
                          const twoWayProps:string[] = [${this.state.map(
                            (s) => `"${s.name}"`
                          )}];
                          
                          return Object.keys(defaultProps).reduce((props, propName)=>{
                              const propValue = (defaultProps as any)[propName];
                              const defaultPropName = twoWayProps.some(p=>p===propName) ? "default"+propName.charAt(0).toUpperCase() + propName.slice(1): propName;
                              (props as any)[defaultPropName] = propValue;
                              return props;
                          }, {});
                      }`
                      : ""
                  }
                  
                  function __createDefaultProps(){
                      return {
                          ${defaultProps.join(",\n")}
                      }
                  }
                  ${this.defaultPropsDest()}= __createDefaultProps();
              `;
    }
    if (defaultProps.length) {
      return `${this.defaultPropsDest()} = {
                  ${defaultProps.join(",\n")}
              }`;
    }

    return "";
  }

  stateDeclaration() {
    return `${this.state
      .concat(this.internalState)
      .map((p) => p.toString(this.getToStringOptions()))
      .join(";\n")}`;
  }

  compileUseEffect() {
    const subscriptions = getSubscriptions(this.listeners);

    let subscriptionsString = "";
    if (subscriptions.length) {
      const { add, cleanup } = subscriptions.reduce(
        ({ add, cleanup }, s) => {
          (add as string[]).push(
            `${s.target}.addEventListener(${s.eventName}, ${s.name});`
          );
          (cleanup as string[]).push(
            `${s.target}.removeEventListener(${s.eventName}, ${s.name});`
          );
          return { add, cleanup };
        },
        { add: [], cleanup: [] }
      );

      subscriptionsString = `useEffect(()=>{
                      ${add.join("\n")}
                      return function cleanup(){
                          ${cleanup.join("\n")}
                      }
                  });`;
    }
    return (
      subscriptionsString +
      this.effects
        .map(
          (e) =>
            `useEffect(${e.arrowDeclaration(
              this.getToStringOptions()
            )}, [${e.getDependency(this.members)}])`
        )
        .join(";\n")
    );
  }

  compileComponentRef() {
    const api = this.members.filter((a) => a.isApiMethod);
    if (api.length) {
      return `export type ${this.name}Ref = {${api.map((a) =>
        a.typeDeclaration()
      )}}`;
    }
    return "";
  }

  compileUseImperativeHandle() {
    const api = this.members.reduce(
      (r: { methods: string[]; deps: string[] }, a) => {
        if (a.isApiMethod) {
          r.methods.push(
            `${a.name}: ${(a as Method).arrowDeclaration(
              this.getToStringOptions()
            )}`
          );

          r.deps = [...new Set(r.deps.concat(a.getDependency(this.members)))];
        }

        return r;
      },
      { methods: [], deps: [] }
    );

    return api.methods.length
      ? `useImperativeHandle(ref, () => ({${api.methods.join(
          ",\n"
        )}}), [${api.deps.join(",")}])`
      : "";
  }

  compileUseRef() {
    return this.refs
      .map((r) => {
        return `const ${r.name}=useRef<${r.type}>()`;
      })
      .concat(
        this.apiRefs.map((r) => {
          return `const ${r.name}=useRef<${r.type}Ref>()`;
        })
      )
      .join(";\n");
  }

  compileComponentInterface() {
    const props = this.isJSXComponent
      ? [`props: ${this.compilePropsType()}`]
      : [];

    return `interface ${this.name}{
              ${props
                .concat(
                  this.members
                    .filter(
                      (m) => !m.inherited && !m.isEffect && !m.isApiMethod
                    )
                    .map((m) => m.typeDeclaration())
                )
                .join(";\n")}
          }`;
  }

  compileViewModelArguments(): string[] {
    const compileState = (state: BaseProperty[]) =>
      state.map((s) => `${s.name}:${s.getter()}`);
    const state = compileState(this.state);
    const internalState = compileState(this.internalState);

    const template = this.props
      .filter((p) => p.isTemplate)
      .map(
        (t) =>
          `${t.name}: getTemplate(props, "${t.name}", "${getTemplatePropName(
            t.name,
            "render"
          )}", "${getTemplatePropName(t.name, "component")}")`
      );

    const nestedProps = this.members
      .filter((m) => m.isNested)
      .map((n) => `${n.name}: ${n.getter()}`);

    const props = this.isJSXComponent
      ? [
          `props:{${["...props"]
            .concat(state)
            .concat(template)
            .concat(nestedProps)
            .join(",\n")}}`,
        ].concat(internalState)
      : ["...props"].concat(internalState).concat(state).concat(nestedProps);

    return props
      .concat(this.listeners.map((l) => l.name.toString()))
      .concat(this.refs.map((r) => r.name.toString()))
      .concat(this.apiRefs.map((r) => r.name.toString()))
      .concat(
        this.members
          .filter(
            (m) => (m.isConsumer || m.isProvider) && !(m instanceof GetAccessor)
          )
          .map((m) => m.name.toString())
      )
      .concat(
        this.methods.map((m) =>
          m._name.toString() !== m.getter()
            ? `${m._name}:${m.getter()}`
            : m.getter()
        )
      );
  }

  compileRestProps(): string {
    return `declare type RestProps = Omit<HtmlHTMLAttributes<HTMLDivElement>, keyof ${this.getPropsType()}>`;
  }

  getPropsType() {
    if (this.isJSXComponent) {
      const type = this.heritageClauses[0].types[0];
      if (
        type.expression instanceof Call &&
        type.expression.typeArguments?.length
      ) {
        return type.expression.typeArguments[0].toString();
      }

      return this.compileDefaultOptionsPropsType();
    }
    return `{
              ${this.props
                .concat(this.state)
                .concat(this.slots)
                .map((p) => p.typeDeclaration())
                .join(",\n")}
          }`;
  }

  compilePropsType() {
    return this.getPropsType().concat(" & RestProps");
  }

  compileDefaultOptionsPropsType() {
    const heritageClause = this.heritageClauses[0];
    return `typeof ${heritageClause.propsType}`;
  }

  getToStringOptions() {
    return {
      members: this.members,
      componentContext: "this",
      newComponentContext: "",
    };
  }

  getNestedImports(components: ComponentInput[]) {
    const outerComponents = components.filter(
      ({ name }) => !this.context.components![name]
    );
    const imports = outerComponents.reduce(
      (acc, component) => {
        const path = component.context.path;
        if (path) {
          let relativePath = getModuleRelativePath(
            this.context.dirname!,
            component.context.path!
          );
          relativePath = relativePath.slice(0, relativePath.lastIndexOf("."));

          if (!acc[relativePath]) {
            acc[relativePath] = [];
          }
          acc[relativePath].push(`${component.name}Type`);
        }

        return acc;
      },
      {} as {
        [x: string]: string[];
      }
    );

    const result = Object.keys(imports).map((path) => {
      return `import { ${imports[path].join(", ")} } from "${path}";`;
    });

    return result;
  }

  getNestedExports(component: ComponentInput, name: string, propName: string) {
    return `export const ${name}: React.FunctionComponent<${component.name}Type> & { propName: string } = () => null;
      ${name}.propName="${propName}"`;
  }

  getNestedFromComponentInput(
    component: ComponentInput,
    parentName: string = ""
  ): {
    component: ComponentInput;
    name: string;
    propName: string;
  }[] {
    const nestedProps = component.members.filter((m) => m.isNested);
    const components = component.context.components!;

    const nested = Object.keys(components).reduce(
      (acc, key) => {
        const property = nestedProps.find(
          ({ type }) => extractComplexType(type) === key
        ) as Property;
        if (property) {
          const componentName = capitalizeFirstLetter(
            isTypeArray(property.type)
              ? removePlural(property.name)
              : property.name
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
        propName: string;
      }[]
    );

    return nested.concat(
      nested.reduce(
        (acc, { component, name }) =>
          acc.concat(this.getNestedFromComponentInput(component, name)),
        [] as {
          component: ComponentInput;
          name: string;
          propName: string;
        }[]
      )
    );
  }

  compileNestedComponents() {
    const components = this.context.components!;
    if (this.heritageClauses.length) {
      const heritage = this.heritageClauses[0].typeNodes[0];
      if (heritage instanceof Call && heritage.arguments.length) {
        const inheritFrom = heritage.arguments[0].toString();
        const heritageInput = components[inheritFrom] as ComponentInput;

        const bindings = this.getNestedFromComponentInput(heritageInput);
        const imports = this.getNestedImports(
          bindings.map(({ component }) => component)
        );
        const nested = bindings.map(({ component, name, propName }) =>
          this.getNestedExports(component, name, propName)
        );

        return imports.concat(nested).join("\n");
      }
    }
    return "";
  }

  createNestedPropertyGetter(property: Property) {
    const propName = getPropName(property.name);
    const isArray = isTypeArray(property.type);
    const type = extractComplexType(property.type);
    const indexGetter = isArray ? "" : "?.[0]";
    const undefinedType =
      property.questionOrExclamationToken === "?" ? " | undefined" : "";

    const getterName = `__getNested${capitalizeFirstLetter(property.name)}`;
    const getterType = property.type
      .toString()
      .replace(`typeof ${type}`, `${type}Type`);
    const condition = `${propName}`.concat(
      isArray ? `&& ${propName}.length` : ""
    );

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
                    new Identifier(property.name)
                  ),
                ],
                "object"
              ),
              undefined,
              new PropertyAccess(
                new SimpleExpression("this"),
                new Identifier("props")
              )
            ),
            new VariableDeclaration(
              new Identifier("nested"),
              undefined,
              new SimpleExpression(
                `__nestedChildren<${type}Type & { __name: string }>().filter(child => child.__name === "${property.name}")`
              )
            ),
          ],
          SyntaxKind.ConstKeyword
        )
      ),
      new ReturnStatement(
        new Conditional(
          new SimpleExpression(condition),
          new SimpleExpression(propName),
          new Conditional(
            new SimpleExpression("nested.length"),
            new SimpleExpression(`nested${indexGetter}`),
            new SimpleExpression("undefined")
          )
        )
      ),
    ];
    return new GetAccessor(
      undefined,
      undefined,
      new Identifier(getterName),
      [],
      new SimpleTypeExpression(`${getterType}${undefinedType}`),
      new Block(statements, true)
    );
  }

  compilePortalComponent() {
    return `import { createPortal } from "react-dom";
      declare type PortalProps = {
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

  compileViewCall() {
    const viewFunction = this.context.viewFunctions?.[this.view];
    const callView = `${this.view}(
        ${
          viewFunction?.parameters.length
            ? `${this.viewModel}({
                ${this.compileViewModelArguments().join(",\n")}
            })`
            : ""
        }
    )`;

    const providers = this.members.filter((m) => m.isProvider);

    if (providers.length) {
      return providers.reduce((result, p) => {
        return `<${p.context}.Provider value={${p.getter()}}>
              ${result}
            </${p.context}.Provider>`;
      }, `{${callView}}`);
    }

    return callView;
  }

  toString() {
    const getTemplateFunc = this.props.some((p) => p.isTemplate)
      ? `
          function getTemplate(props: any, template: string, render: string, component: string) {
              const getRender = (render: any) => (props: any) => (("data" in props) ? render(props.data, props.index) : render(props));
              const Component = props[component];
              
              return props[template] ||
                          (props[render] && getRender(props[render])) ||
                          (Component && ((props: any) => <Component {...props} />));
          }
          `
      : "";

    const portal = this.containsPortal() ? this.compilePortalComponent() : "";

    return `
              ${this.compileImports()}
              ${portal}
              ${
                this.members.some((m) => m.isNested)
                  ? this.createNestedChildrenCollector()
                  : ""
              }
              ${this.compileNestedComponents()}
              ${this.compileComponentRef()}
              ${this.compileRestProps()}
              ${this.compileComponentInterface()}
              ${getTemplateFunc}
              ${
                this.members.filter((m) => m.isApiMethod).length === 0
                  ? `${this.modifiers.join(" ")} function ${
                      this.name
                    }(props: ${this.compilePropsType()}){`
                  : `const ${this.name} = forwardRef<${
                      this.name
                    }Ref, ${this.compilePropsType()}>((props: ${this.compilePropsType()}, ref) => {`
              }
                  ${this.compileUseRef()}
                  ${this.stateDeclaration()}
                  ${this.compileUseImperativeHandle()}
                  ${this.members
                    .filter(
                      (m) =>
                        (m.isConsumer || m.isProvider) &&
                        !(m instanceof GetAccessor)
                    )
                    .map((m) => m.toString(this.getToStringOptions()))
                    .join(";\n")}
                  ${this.listeners
                    .concat(this.methods)
                    .map((m) => {
                      return `const ${m.name}=useCallback(${m.declaration(
                        this.getToStringOptions()
                      )}, [${m.getDependency(this.members)}]);`;
                    })
                    .join("\n")}
                  ${this.compileUseEffect()}
                  return ${this.compileViewCall()}
              ${
                this.members.filter((m) => m.isApiMethod).length === 0
                  ? `}`
                  : `});\n${this.modifiers.join(" ")} ${
                      this.modifiers.join(" ") === "export"
                        ? `{${this.name}}`
                        : this.name
                    };`
              }
              
              ${this.compileDefaultComponentExport()}
  
              ${this.compileDefaultProps()}
              ${this.compileDefaultOptionsMethod("[]", [
                `${this.defaultPropsDest()} = {
                      ...__createDefaultProps(),
                      ...${this.compileConvertRulesToOptions(
                        "__defaultOptionRules"
                      )}
                  };`,
              ])}`;
  }
}