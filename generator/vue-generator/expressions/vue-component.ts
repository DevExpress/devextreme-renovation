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
import { capitalizeFirstLetter } from "../../base-generator/utils/string";
import { Decorator } from "../../base-generator/expressions/decorator";
import { ObjectLiteral } from "../../base-generator/expressions/literal";
import { PropertyAccess } from "./property-access";
import { PropertyAssignment } from "../../base-generator/expressions/property-assignment";
import { SimpleTypeExpression } from "../../base-generator/expressions/type";
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
              new Identifier("children"),
              undefined,
              new PropertyAccess(
                new SimpleExpression("this"),
                new Identifier("$options._renderChildren || []")
              )
            ),
            new VariableDeclaration(
              new Identifier("nestedComponents"),
              undefined,
              new SimpleExpression(
                `children.filter(child => child.tag === typeName)`
              )
            ),
          ],
          SyntaxKind.ConstKeyword
        )
      ),
      new ReturnStatement(
        new SimpleExpression(
          "nestedComponents.map(child => child.data?.attrs || {})"
        )
      ),
    ];

    return new Method(
      undefined,
      undefined,
      undefined,
      new Identifier("__getNestedFromChild"),
      undefined,
      [],
      [
        new Parameter(
          [],
          [],
          "",
          new Identifier("typeName"),
          undefined,
          "string",
          undefined
        ),
      ],
      new SimpleTypeExpression("{ [name:string]: any }[]"),
      new Block(statements, true)
    );
  }

  createPropsGetter(members: Array<Property | Method>) {
    const defaultStatePropsName = members
      .filter((p) => p.isState)
      .map((m) => `default${capitalizeFirstLetter(m.name)}`);
    const props = getProps(members).filter(
      (m) => !defaultStatePropsName.some((s) => s === m.name)
    );
    const expression = new ObjectLiteral(
      props.map(
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
            new SimpleExpression(
              `this.default${capitalizeFirstLetter(base.name)}`
            )
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
        props = `(()=>{
                      const twoWayProps = [${this.state.map(
                        (s) => `"${s.name}"`
                      )}];
                      return Object.keys(${props}).reduce((props, propName)=>{
                          const prop = {...${props}[propName]};
                          
                          const twoWayPropName = propName.indexOf("default") === 0 &&
                                  twoWayProps.find(p=>"default"+p.charAt(0).toUpperCase() + p.slice(1)===propName);
                          const defaultPropName = twoWayPropName? twoWayPropName: propName;
  
                          if(typeof prop.default === "function"){
                              const defaultValue = prop.default;
                              prop.default = function() {
                                  return this._defaultOptions[defaultPropName] !== undefined
                                      ? this._defaultOptions[defaultPropName] 
                                      : defaultValue();
                              }
                          } else if(!twoWayProps.some(p=>p===propName)){
                              const defaultValue = prop.default;
                              prop.default = function() {
                                  return this._defaultOptions[defaultPropName] !== undefined
                                      ? this._defaultOptions[defaultPropName] 
                                      : defaultValue;
                              }
                          }
  
                          props[propName] = prop;
                          return props;
                      }, {});
                  })()`;
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
        this.internalState.map((i) => i.toString())
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

  generateMethods(externalStatements: string[]) {
    const statements: string[] = [];

    statements.push.apply(
      statements,
      this.methods
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

    return `methods: {
              ${statements.concat(externalStatements).join(",\n")}
           }`;
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

  generateComponents() {
    const components = Object.keys(this.context.components || {}).filter(
      (k) => {
        const component = this.context.components?.[k];
        return component instanceof VueComponent && component !== this;
      }
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
      statements.push(
        "this._defaultOptions = convertRulesToOptions(__defaultOptionRules);"
      );
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

  compileImports() {
    const imports: string[] = [];
    this.compileDefaultOptionsImport(imports);

    return imports.join(";\n");
  }

  compileComponentExport(statements: string[]) {
    const exportClause = this.modifiers.join(" ");
    const head =
      exportClause === "export" ? `export const ${this.name} =` : exportClause;
    const tail = exportClause === "export" ? `export default ${this.name}` : ``;
    return `${head} {
              ${statements.join(",\n")}
          }
          ${tail}`;
  }

  toString() {
    this.compileTemplate();

    const methods: string[] = [];

    const statements = [
      this.generateComponents(),
      this.generateProps(),
      this.generateModel(),
      this.generateData(),
      this.generateWatch(methods),
      this.generateMethods(methods),
      this.generateBeforeCreate(),
      this.generateCreated(),
      this.generateMounted(),
      this.generateUpdated(),
      this.generateDestroyed(),
    ].filter((s) => s);

    return `
          ${this.compileImports()}
          ${this.compileDefaultOptionsMethod(
            this.defaultOptionRules ? this.defaultOptionRules.toString() : "[]",
            []
          )}
          ${this.compileDefaultProps()}
          ${this.compileComponentExport(statements)}`;
  }
}
