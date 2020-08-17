import { GeneratorContext } from "../../base-generator/types";
import {
  Component,
  getProps,
} from "../../base-generator/expressions/component";
import { BaseClassMember } from "../../base-generator/expressions/class-members";
import { GetAccessor } from "./class-members/get-accessor";
import { Identifier, Call } from "../../base-generator/expressions/common";
import {
  Block,
  ReturnStatement,
} from "../../base-generator/expressions/statements";
import { SimpleExpression } from "../../base-generator/expressions/base";
import {
  VariableStatement,
  VariableDeclarationList,
  VariableDeclaration,
} from "../../base-generator/expressions/variables";
import { Method } from "./class-members/method";
import { Parameter } from "./functions/parameter";
import { toStringOptions } from "../types";
import { getEventName } from "./utils";
import { getModuleRelativePath } from "../../base-generator/utils/path-utils";
import {
  capitalizeFirstLetter,
  removePlural,
} from "../../base-generator/utils/string";
import { Decorator } from "../../base-generator/expressions/decorator";
import { ObjectLiteral } from "../../base-generator/expressions/literal";
import { PropertyAccess } from "./property-access";
import { PropertyAssignment } from "../../base-generator/expressions/property-assignment";
import {
  SimpleTypeExpression,
  isTypeArray,
  ArrayTypeNode,
} from "../../base-generator/expressions/type";
import SyntaxKind from "../../base-generator/syntaxKind";
import { Property } from "./class-members/property";

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

  createRestPropsGetter(members: BaseClassMember[]) {
    return new GetAccessor(
      undefined,
      undefined,
      new Identifier("restAttributes"),
      [],
      undefined,
      new Block([new SimpleExpression("return {}")], true)
    );
  }

  createNestedGetter() {
    const statements = [
      new VariableStatement(
        undefined,
        new VariableDeclarationList(
          [
            new VariableDeclaration(
              new Identifier("nestedComponents"),
              undefined,
              new SimpleExpression(
                `children.filter(child => child.tag?.startsWith("Dx"))`
              )
            ),
          ],
          SyntaxKind.ConstKeyword
        )
      ),
      new ReturnStatement(
        new SimpleExpression(
          `nestedComponents.map(child => {
            let name = (child.tag.replace("Dx" , ""))
            name = name[0].toLowerCase() + name.slice(1);
            const collectedChildren = {};
            if(child.children) {
              this.__collectChildren(child.children).forEach(
                ({ __name, ...cProps }) => {
                  if (!collectedChildren[__name]) {
                    collectedChildren[__name] = [];
                    collectedChildren[__name + "s"] = [];
                  }
                  collectedChildren[__name].push(cProps);
                  collectedChildren[__name + "s"].push(cProps);
                }
              );
            };
            const childProps = {};
            if (child.data) {
              Object.keys(child.data.attrs).forEach(key => {
                let attr = key.split("-");
                attr = ([attr[0], ...attr.slice(1).map(a => a[0].toUpperCase() + a.slice(1))]).join("");
                childProps[attr] = child.data.attrs[key];
              })
            }

            return {
              ...collectedChildren,
              ...childProps,
              __name: name,
            };

          })`
        )
      ),
    ];

    return new Method(
      undefined,
      undefined,
      undefined,
      new Identifier("__collectChildren"),
      undefined,
      [],
      [
        new Parameter(
          [],
          [],
          "",
          new Identifier("children"),
          undefined,
          new ArrayTypeNode(new Identifier("Object")),
          undefined
        ),
      ],
      new SimpleTypeExpression("{ [name:string]: any }[]"),
      new Block(statements, true)
    );
  }

  createPropsGetter(members: Array<Property | Method>) {
    const expression = new ObjectLiteral(
      getProps(members).map(
        (p) =>
          new PropertyAssignment(
            p._name,
            new PropertyAccess(
              new PropertyAccess(
                new Identifier(SyntaxKind.ThisKeyword),
                new Identifier("props")
              ),
              p._name
            )
          )
      ),
      true
    );

    return new GetAccessor(
      [],
      [],
      new Identifier("props"),
      [],
      undefined,
      new Block([new ReturnStatement(expression)], true)
    );
  }

  addPrefixToMembers(members: Array<Property | Method>) {
    members
      .filter((m) => !m.isApiMethod)
      .forEach((m) => {
        m.prefix = "__";
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
                new Call(new Identifier("InternalState"), undefined, []),
                {}
              ),
            ],
            [],
            new Identifier(`${m._name}_state`),
            "",
            m.type,
            new SimpleExpression(`this.${base.name}`)
          )
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
            [new Parameter([], [], undefined, new Identifier("ref"))],
            undefined,
            new Block([new SimpleExpression(`this.$refs.${m.name}=ref`)], true)
          )
        );
      }
      return members;
    }, members);

    members.push(this.createPropsGetter(members));

    return members;
  }

  compileDefaultOptionsImport(imports: string[]): void {
    if (
      !this.context.defaultOptionsImport &&
      this.needGenerateDefaultOptions &&
      this.context.defaultOptionsModule &&
      this.context.dirname
    ) {
      const relativePath = getModuleRelativePath(
        this.context.dirname,
        this.context.defaultOptionsModule
      );
      imports.push(`import {convertRulesToOptions} from "${relativePath}"`);
    }
  }

  compileTemplate() {
    const viewFunction = this.decorators[0].getViewFunction();
    if (viewFunction) {
      const options: toStringOptions = {
        members: this.members,
        newComponentContext: "",
      };
      this.template = viewFunction.getTemplate(options);

      if (options.hasStyle) {
        this.methods.push(
          new Method(
            [],
            [],
            undefined,
            new Identifier("__processStyle"),
            undefined,
            [],
            [
              new Parameter(
                [],
                [],
                undefined,
                new Identifier("value"),
                undefined,
                undefined,
                undefined
              ),
            ],
            undefined,
            new Block(
              [
                new SimpleExpression(`
                              if (typeof value === "object") {
                                  return Object.keys(value).reduce((v, k) => {
                                      if (typeof value[k] === "number") {
                                          v[k] = value[k] + "px";
                                      } else {
                                          v[k] = value[k];
                                      }
                                      return v;
                                  }, {});
                              }
                              return value;`),
              ],
              true
            )
          )
        );
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
    return "";
  }

  generateModel() {
    if (!this.modelProp) {
      return "";
    }
    return `model: {
              prop: "${this.modelProp._name}",
              event: "${getEventName(`${this.modelProp._name}Change`, [
                this.modelProp,
              ])}"
          }`;
  }

  generateData() {
    const statements: string[] = [];
    if (this.internalState.length) {
      statements.push.apply(
        statements,
        this.internalState.map((i) =>
          i.toString({
            members: this.members,
          })
        )
      );
    }

    if (statements.length) {
      return `data() {
                  return {
                      ${statements.join(",\n")}
                  };
              }`;
    }
    return "";
  }

  createNestedPropertyGetter(property: Property) {
    const isArray = isTypeArray(property.type);
    const indexGetter = isArray ? "" : "?.[0]";
    let nestedName = capitalizeFirstLetter(property.name);
    if (isArray) {
      nestedName = removePlural(nestedName);
    }
    const propName = `${SyntaxKind.ThisKeyword}.${property.name}`;
    const condition = `${propName}`.concat(
      isArray ? `&& ${propName}.length` : ""
    );

    return `__getNested${nestedName}() {
      if (${condition}) {
        return ${propName};
      }
      if(this.$slots.default) {
        const nested = ${SyntaxKind.ThisKeyword}.__collectChildren(this.$slots.default);
        if (nested.length) {
          return nested${indexGetter}
        }
      }
    }`;
  }

  generateComputed() {
    const nestedGetters = (this.members.filter(
      (m) => m.isNested
    ) as Property[]).map((m) => this.createNestedPropertyGetter(m));
    const statements: string[] = this.methods
      .filter((m) => m instanceof GetAccessor)
      .map((m) =>
        m.toString({
          members: this.members,
          componentContext: "this",
          newComponentContext: "this",
        })
      );

    return `computed: {
              ${statements.join(",\n")},
              ${nestedGetters.join(",\n")}
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
        .map((m) =>
          m.toString({
            members: this.members,
            componentContext: "this",
            newComponentContext: "this",
          })
        )
    );

    this.members
      .filter((m) => m.isEvent)
      .forEach((m) => {
        statements.push(`${m._name}(...args){
                  this.$emit("${getEventName(
                    m._name,
                    this.members.filter((m) => m.isState)
                  )}", ...args);
              }`);
      });

    const forwardRefs = this.members.filter((m) => m.isForwardRefProp);

    if (forwardRefs.length) {
      statements.push(`__forwardRef(){
                  ${forwardRefs
                    .map((m) => `this.${m._name}(this.$refs.${m._name});`)
                    .join("\n")}
              }`);
    }

    if (statements.length || externalStatements.length) {
      return `methods: {
        ${statements.concat(externalStatements).join(",\n")}
      }`;
    }

    return "";
  }

  generateWatch(methods: string[]) {
    const watches: { [name: string]: string[] } = {};

    const startMethodsLength = methods.length;

    this.effects.forEach((effect, index) => {
      const dependency = effect.getDependency(this.members);

      const scheduleEffectName = `__schedule_${effect._name}`;

      if (dependency.length) {
        methods.push(`${scheduleEffectName}() {
                      this.__scheduleEffect(${index}, "${effect.name}");
                  }`);
      }

      dependency
        .filter((d) => d !== "props")
        .forEach((d) => {
          watches[d] = watches[d] || [];
          watches[d].push(`"${scheduleEffectName}"`);
        });
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
        }`
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

    const watchStatements = Object.keys(watches).map((k) => {
      return `${k}: [
                  ${watches[k].join(",\n")}
              ]`;
    });

    if (watchStatements.length) {
      return `watch: {
                  ${watchStatements.join(",\n")}
              }`;
    }

    return "";
  }

  generateComponents(components: string[] = []) {
    components = components.concat(
      Object.keys(this.context.components || {}).filter((k) => {
        const component = this.context.components?.[k];
        return component instanceof VueComponent && component !== this;
      })
    );

    if (components.length) {
      return `components: {
                  ${components.join(",\n")}
              }`;
    }

    return "";
  }

  generateMounted() {
    const statements: string[] = [];

    if (this.members.filter((m) => m.isForwardRefProp).length) {
      statements.push(`this.__forwardRef()`);
    }

    this.effects.forEach((e, i) => {
      statements.push(`this.__destroyEffects[${i}]=this.${e.name}()`);
    });

    if (statements.length) {
      return `mounted(){
                  ${statements.join(";\n")}
              }`;
    }

    return "";
  }

  generateCreated() {
    const statements: string[] = [];

    if (this.effects.length) {
      statements.push("this.__destroyEffects=[]");
      statements.push("this.__scheduleEffects=[]");
    }

    if (statements.length) {
      return `created(){
                  ${statements.join(";\n")}
              }`;
    }

    return "";
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
                  ${statements.join(";\n")}
              }`;
    }

    return "";
  }

  generateUpdated() {
    const statements: string[] = [];

    if (this.members.filter((m) => m.isForwardRefProp).length) {
      statements.push(`this.__forwardRef()`);
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
                  ${statements.join(";\n")}
              }`;
    }

    return "";
  }

  generateDestroyed() {
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
      return `destroyed(){
                  ${statements.join("\n")}
              }`;
    }

    return "";
  }

  compileDefaultOptionsRuleTypeName() {
    return "";
  }

  compileDefaultOptionRulesType() {
    return "";
  }

  compileImports(imports: string[] = []) {
    this.compileDefaultOptionsImport(imports);

    return imports.join(";\n");
  }

  compileComponentExport(statements: string[]) {
    const name = this.exportedName;
    return `export const ${name} = {
              ${statements.join(",\n")}
          }
          export default ${name}`;
  }

  generateContextProviders(): string {
    const providers = this.members.filter((m) => m.isProvider) as Property[];
    if (providers.length) {
      return `provide(){
        return {
          ${providers
            .map((p) => {
              return `${p.name}: ${p.context}(${p.initializer})`;
            })
            .join(",")}
        };
      }`;
    }
    return "";
  }

  generateInject(): string {
    const consumers = this.members.filter((m) => m.isConsumer);
    if (consumers.length) {
      return `inject: [${consumers.map((c) => `"${c.name}"`)}]`;
    }
    return "";
  }

  compilePortalComponent(imports: string[], components: string[]) {
    imports.push('import Vue from "vue"');
    components.push("DxPortal");
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

  toString() {
    this.compileTemplate();

    const methods: string[] = [];
    const imports: string[] = [];
    const components: string[] = [];

    const portalComponent = this.containsPortal()
      ? this.compilePortalComponent(imports, components)
      : "";

    const statements = [
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
      this.generateDestroyed(),
    ].filter((s) => s);

    return `
          ${this.compileImports(imports)}
          ${portalComponent}
          ${this.compileDefaultOptionsMethod(
            this.defaultOptionRules ? this.defaultOptionRules.toString() : "[]",
            []
          )}
          ${this.compileDefaultProps()}
          ${this.compileComponentExport(statements)}`;
  }
}
