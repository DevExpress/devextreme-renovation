import {
  Component,
  getProps,
} from "../../base-generator/expressions/component";
import { Decorator } from "./decorator";
import {
  StringLiteral,
  ArrayLiteral,
} from "../../base-generator/expressions/literal";
import { HeritageClause } from "../../base-generator/expressions/class";
import { Identifier, Call } from "../../base-generator/expressions/common";
import {
  SimpleExpression,
  Expression,
} from "../../base-generator/expressions/base";
import { Block } from "../../base-generator/expressions/statements";
import { toStringOptions, AngularGeneratorContext } from "../types";
import SyntaxKind from "../../base-generator/syntaxKind";
import {
  Parameter,
  getTemplate,
} from "../../base-generator/expressions/functions";
import {
  SimpleTypeExpression,
  FunctionTypeNode,
  isTypeArray,
  extractComplexType,
} from "../../base-generator/expressions/type";
import { Property } from "./class-members/property";
import { Method } from "../../base-generator/expressions/class-members";
import { GetAccessor } from "./class-members/get-accessor";
import { SetAccessor } from "./class-members/set-accessor";
import { Decorators } from "../../component_declaration/decorators";
import { isElement } from "./jsx/elements";
import { GeneratorContext } from "../../base-generator/types";
import { ComponentInput } from "./component-input";
import { getModuleRelativePath } from "../../base-generator/utils/path-utils";
import { removePlural, compileType } from "../../base-generator/utils/string";

export function compileCoreImports(
  members: Array<Property | Method>,
  context: AngularGeneratorContext,
  imports: string[] = []
) {
  if (
    members.some((m) =>
      m.decorators.some(
        (d) =>
          d.name === Decorators.OneWay ||
          d.name === Decorators.RefProp ||
          d.name === Decorators.Nested ||
          d.name === Decorators.ForwardRefProp
      )
    )
  ) {
    imports.push("Input");
  }
  if (members.some((m) => m.isState)) {
    imports.push("Input", "Output", "EventEmitter");
  }
  if (members.some((m) => m.isTemplate)) {
    imports.push("Input", "TemplateRef");
  }
  if (members.some((m) => m.isEvent)) {
    imports.push("Output", "EventEmitter");
  }

  if (members.some((m) => m.isSlot)) {
    imports.push("ViewChild", "ElementRef");
  }

  if (members.some((m) => m.isNestedComp)) {
    imports.push("ContentChildren", "QueryList", "Directive");
  }

  if (members.some((m) => m.isForwardRef)) {
    imports.push("ElementRef");
  }

  const set = new Set(context.angularCoreImports);
  const needImport = imports.filter((name) => !set.has(name));
  context.angularCoreImports = [...set, ...needImport];

  if (needImport.length) {
    return `import {${[...new Set(needImport)].join(
      ","
    )}} from "@angular/core"`;
  }

  return "";
}

function separateDependency(
  allDependency: string[],
  internalState: Property[]
): [string[], string[]] {
  const result: [string[], string[]] = [[], []];
  return allDependency.reduce((r, d) => {
    if (internalState.find((m) => m.name.toString() === d)) {
      r[1].push(d);
    } else {
      r[0].push(d);
    }

    return r;
  }, result);
}

const ngOnChangesParameters = ["changes"];

export const getAngularSelector = (
  name: string | Identifier,
  postfix: string = ""
) => {
  name = name.toString();
  const words = name
    .toString()
    .split(/(?=[A-Z])/)
    .map((w) => w.toLowerCase());
  return [`dx${postfix}`].concat(words).join("-");
};

export class AngularComponent extends Component {
  decorator: Decorator;
  constructor(
    componentDecorator: Decorator,
    modifiers: string[],
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>,
    context: GeneratorContext
  ) {
    super(
      componentDecorator,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      context
    );
    componentDecorator.addParameter(
      "selector",
      new StringLiteral(this.selector)
    );
    this.decorator = componentDecorator;
  }

  createNestedState(
    name: string,
    questionOrExclamationToken: string,
    type: string,
    initializer?: Expression
  ) {
    return new Property(
      [],
      ["private"],
      new Identifier(`__${name}`),
      questionOrExclamationToken,
      `${type}`,
      initializer
    );
  }

  createNestedPropertySetter(
    decorator: Decorator[],
    modifiers: string[],
    name: string,
    questionOrExclamationToken: string,
    type: string
  ) {
    if (questionOrExclamationToken === "?") {
      type = type + "| undefined";
    }
    return new SetAccessor(
      decorator,
      modifiers,
      new Identifier(`${name}`),
      [new Parameter([], [], undefined, new Identifier("value"), "", type)],
      new Block([new SimpleExpression(`this.__${name}=value;`)], true)
    );
  }

  createNestedPropertyGetter(
    modifiers: string[],
    name: string,
    questionOrExclamationToken: string,
    type: string
  ) {
    const indexGetter = isTypeArray(type) ? "" : "[0]";
    if (questionOrExclamationToken === "?") {
      type = type + "| undefined";
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
        const nested = this.${name}Nested.toArray();
        if (nested.length) {
          return nested${indexGetter};
        }`),
        ],
        true
      )
    );
  }

  createContentChildrenProperty(
    decorator: Decorator[],
    modifiers: string[],
    name: string,
    questionOrExclamationToken: string,
    type: string,
    initializer?: Expression
  ) {
    return new Property(
      decorator,
      modifiers,
      new Identifier(`${name}Nested`),
      questionOrExclamationToken,
      `Dx${type}`,
      initializer
    );
  }

  processNestedProperty(m: Property) {
    const {
      decorators,
      modifiers,
      questionOrExclamationToken,
      initializer,
      type,
      name,
    } = m;

    const nestedCompDecorator = [
      new Decorator(
        new Call(new Identifier(Decorators.NestedComp), undefined, []),
        {}
      ),
    ];
    const nestedType = extractComplexType(type);
    const complexType = type.toString().replace(nestedType, `Dx${nestedType}`);

    return [
      this.createNestedState(
        name,
        questionOrExclamationToken,
        complexType,
        initializer
      ),
      this.createContentChildrenProperty(
        nestedCompDecorator,
        modifiers,
        name,
        questionOrExclamationToken,
        nestedType,
        initializer
      ),
      this.createNestedPropertySetter(
        decorators,
        modifiers,
        name,
        questionOrExclamationToken,
        complexType
      ),
      this.createNestedPropertyGetter(
        modifiers,
        name,
        questionOrExclamationToken,
        complexType
      ),
    ];
  }

  processMembers(members: Array<Property | Method>) {
    members = super.processMembers(members);
    members = members.concat(
      (members.filter((m) => m.isForwardRefProp) as Property[]).map((m) => {
        return new Property(
          [
            new Decorator(
              new Call(new Identifier(Decorators.Ref), [], []),
              this.context
            ),
          ],
          [],
          new Identifier(`${m.name}Ref`),
          m.questionOrExclamationToken,
          m.type
        );
      })
    );

    members = members.concat(
      members
        .filter((m) => m.isForwardRef || m.isForwardRefProp)
        .map((m) => {
          return new GetAccessor(
            [],
            [],
            new Identifier(`forwardRef_${m.name}`),
            [],
            new FunctionTypeNode(
              [],
              [
                new Parameter(
                  [],
                  [],
                  undefined,
                  new Identifier("ref"),
                  undefined,
                  new SimpleTypeExpression("any")
                ),
              ],
              new SimpleTypeExpression("void")
            ),
            new Block(
              [
                new SimpleExpression(
                  `return (ref)=>this.${m.name}${
                    m.isForwardRefProp ? "Ref" : ""
                  }=ref`
                ),
              ],
              true
            )
          );
        })
    );

    members = members.reduce((acc, m) => {
      if (m.isNested && m instanceof Property) {
        return acc.concat(this.processNestedProperty(m));
      }
      acc.push(m);
      return acc;
    }, [] as Array<Property | Method>);

    return members;
  }

  addPrefixToMembers(members: Array<Property | Method>) {
    members
      .filter((m) => !m.isApiMethod)
      .forEach((m) => {
        m.prefix = "__";
      });
    members = members.reduce((members, member) => {
      if (member.isInternalState) {
        const property = member as Property;
        const token =
          property.questionOrExclamationToken === SyntaxKind.QuestionToken &&
          property.type.toString() !== "any"
            ? SyntaxKind.QuestionToken
            : undefined;

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
                token,
                member.type,
                undefined
              ),
            ],
            new Block(
              [new SimpleExpression(`this.${member.name}=${member._name}`)],
              false
            )
          )
        );
      }
      return members;
    }, members);
    return members;
  }

  get selector() {
    return getAngularSelector(this._name);
  }

  get module() {
    return `Dx${this._name}Module`;
  }

  compileImports(coreImports: string[] = []) {
    const core = ["Component", "NgModule"].concat(coreImports);

    if (this.refs.length || this.apiRefs.length) {
      core.push("ViewChild");
    }
    if (this.refs.length) {
      core.push("ElementRef");
    }

    if (this.modelProp) {
      core.push("forwardRef", "HostListener");
    }

    const imports = [
      `${compileCoreImports(
        this.members.filter((m) => !m.inherited),
        this.context,
        core
      )}`,
      'import {CommonModule} from "@angular/common"',
      ...(this.modelProp
        ? [
            "import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'",
          ]
        : []),
    ];

    this.compileDefaultOptionsImport(imports);

    return imports.join(";\n");
  }

  compileGetterCache(ngOnChanges: string[]): string {
    const getters = this.members.filter(
      (m) => m instanceof GetAccessor && m.isMemorized()
    );

    if (getters.length) {
      const statements = [
        `__getterCache: {
                    ${getters.map((g) => `${g._name}?:${g.type}`).join(";\n")}
                } = {}`,
      ];

      getters.map((g) => {
        const allDeps = g.getDependency(this.members);
        const [propsDependency, internalStateDependency] = separateDependency(
          allDeps,
          this.internalState
        );
        const deleteCacheStatement = `this.__getterCache["${g._name.toString()}"] = undefined;`;

        if (propsDependency.length) {
          const conditionArray = [];
          if (propsDependency.indexOf("props") === -1) {
            conditionArray.push(
              `[${propsDependency.map((d) => `"${d}"`).join(",")}].some(d=>${
                ngOnChangesParameters[0]
              }[d])`
            );
          }

          if (conditionArray.length) {
            ngOnChanges.push(`
                        if (${conditionArray.join("&&")}) {
                            ${deleteCacheStatement}
                        }`);
          } else {
            ngOnChanges.push(deleteCacheStatement);
          }
        }

        internalStateDependency.forEach((name) => {
          const setter = this.members.find(
            (p) => p.name === `_${name}`
          ) as SetAccessor;
          if (setter) {
            setter.body.statements.push(
              new SimpleExpression(deleteCacheStatement)
            );
          }
        });
      });

      return statements.join("\n");
    }

    return "";
  }

  compileEffects(
    ngAfterViewInitStatements: string[],
    ngOnDestroyStatements: string[],
    ngOnChanges: string[],
    ngAfterViewCheckedStatements: string[],
    ngDoCheckStatements: string[]
  ) {
    const effects = this.members.filter((m) => m.isEffect) as Method[];
    let hasInternalStateDependency = false;

    if (effects.length) {
      const statements = [
        "__destroyEffects: any[] = [];",
        "__viewCheckedSubscribeEvent: Array<()=>void> = [];",
        "_effectTimeout: any;",
      ];
      let usedIterables = new Set();

      const subscribe = (e: Method) => `this.${e.getter()}()`;
      effects.map((e, i) => {
        const allDeps = e.getDependency(this.members);
        const [propsDependency, internalStateDependency] = separateDependency(
          allDeps,
          this.internalState
        );
        const iterableDeps = allDeps.filter((dep) =>
          isTypeArray(this.members.find((m) => m.name === dep)?.type)
        );

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
          const conditionArray = ["this.__destroyEffects.length"];
          if (propsDependency.indexOf("props") === -1) {
            conditionArray.push(
              `[${propsDependency.map((d) => `"${d}"`).join(",")}].some(d=>${
                ngOnChangesParameters[0]
              }[d])`
            );
          }

          const iterableProps = propsDependency.filter((dep) =>
            isTypeArray(this.members.find((m) => m.name === dep)?.type)
          );
          const assignments = iterableProps
            .map(
              (p) => `if (${ngOnChangesParameters[0]}["${p}"]) {
            this.__cachedObservables["${p}"] = [...${ngOnChangesParameters[0]}["${p}"].currentValue];
          }`
            )
            .join("\n");
          ngOnChanges.push(`
                        if (${conditionArray.join("&&")}) {
                            ${assignments}
                            this.${updateEffectMethod}();
                        }`);
        }

        if (iterableDeps.length) {
          usedIterables = new Set([...usedIterables].concat(iterableDeps));
          const observableConditionArray = ["this.__destroyEffects.length"];
          observableConditionArray.push(
            `this.__checkObservables([${iterableDeps
              .map((d) => `"${d}"`)
              .join(",")}])`
          );

          ngDoCheckStatements.push(`
          if (${observableConditionArray.join("&&")}) {
              this.${updateEffectMethod}();
          }`);
        }

        internalStateDependency.forEach((name) => {
          const setter = this.members.find(
            (p) => p.name === `_${name}`
          ) as SetAccessor;
          if (setter) {
            if (
              usedIterables.has(name) &&
              !setter.body.statements.some(
                (expr) =>
                  expr.toString() ===
                  `this.__cachedObservables["${name}"] = [...${name}];`
              )
            ) {
              setter.body.statements.push(
                new SimpleExpression(
                  `this.__cachedObservables["${name}"] = [...${name}];`
                )
              );
            }
            setter.body.statements.push(
              new SimpleExpression(`
                            if (this.__destroyEffects.length) {
                                this.${updateEffectMethod}();
                            }`)
            );
            hasInternalStateDependency = true;
          }
        });
      });
      if (ngOnChanges.length || hasInternalStateDependency) {
        ngAfterViewCheckedStatements.push(`
                if(this.__viewCheckedSubscribeEvent.length){
                this._effectTimeout = setTimeout(()=>{
                    this.__viewCheckedSubscribeEvent.forEach(s=>s?.());
                    this.__viewCheckedSubscribeEvent = [];
                  });
              }`);
      }
      if (usedIterables.size > 0) {
        statements.push(
          "__cachedObservables: { [name: string]: Array<any> } = {}"
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
          ngAfterViewInitStatements.push(
            `this.__cachedObservables["${i}"] = this.${i}`
          );
        });
      }
      ngAfterViewInitStatements.push(
        `this._effectTimeout = setTimeout(()=>{
          this.__destroyEffects.push(${effects
            .map((e) => subscribe(e))
            .join(",")});
          }, 0)`
      );
      ngOnDestroyStatements.push(
        `this.__destroyEffects.forEach(d => d && d());
         clearTimeout(this._effectTimeout);
        `
      );
      return statements.join("\n");
    }

    return "";
  }

  compileTrackBy(options: toStringOptions): string {
    return (
      options.trackBy
        ?.map((trackBy) => trackBy.getTrackByDeclaration())
        .join("\n") || ""
    );
  }

  compileSpreadAttributes(
    ngOnChangesStatements: string[],
    coreImports: string[]
  ): string {
    const viewFunction = this.decorator.getViewFunction();
    if (viewFunction) {
      const options = {
        members: this.members,
        state: [],
        internalState: [],
        props: [],
        newComponentContext: this.viewModel ? "_viewModel" : "",
      };
      const expression = getTemplate(viewFunction, options);
      if (isElement(expression)) {
        options.newComponentContext = "this";
        const members = [];
        const statements = expression.getSpreadAttributes().map((o, i) => {
          const expressionString = o.expression.toString(options);
          const refString =
            o.refExpression instanceof SimpleExpression
              ? `this.${o.refExpression.toString()}?.nativeElement`
              : o.refExpression
                  .toString(options)
                  .replace(/(\w|\d)!?\.nativeElement/, "$1?.nativeElement");
          if (o.refExpression instanceof SimpleExpression) {
            coreImports.push("ViewChild", "ElementRef");
            members.push(
              `@ViewChild("${o.refExpression.toString()}", { static: false }) ${o.refExpression.toString()}?: ElementRef<HTMLDivElement>`
            );
          }
          return `
                    const _attr_${i}:{[name: string]:string } = ${expressionString} || {};
                    const _ref_${i} = ${refString};
                    if(_ref_${i}){
                        for(let key in _attr_${i}) {
                            _ref_${i}.setAttribute(key, _attr_${i}[key]);
                        }
                    }
                    `;
        });

        if (statements.length) {
          const methodName = "__applyAttributes__";
          ngOnChangesStatements.push(`this.${methodName}()`);

          members.push(`${methodName}(){
                        ${statements.join("\n")}
                    }`);

          return members.join(";\n");
        }
      }
    }
    return "";
  }

  compileNgStyleProcessor(options?: toStringOptions): string {
    if (options?.hasStyle) {
      return `__processNgStyle(value:any){
                    if (typeof value === "object") {
                        return Object.keys(value).reduce((v: { [name: string]: any }, k) => {
                            if (typeof value[k] === "number") {
                                v[k] = value[k] + "px";
                            } else {
                                v[k] = value[k];
                            }
                            return v;
                        }, {});
                    }
            
                    return value;
                }`;
    }
    return "";
  }

  compileLifeCycle(
    name: string,
    statements: string[],
    parameters: string[] = []
  ): string {
    if (statements.length) {
      return `${name}(${parameters.join(",")}){
                ${statements.join("\n")}
            }`;
    }
    return "";
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
        this.defaultOptionRules ? this.defaultOptionRules.toString() : "[]",
        []
      );
    }
    return "";
  }

  compileNgModel() {
    if (!this.modelProp) {
      return "";
    }

    const disabledProp = getProps(this.members).find(
      (m) => m._name.toString() === "disabled"
    );

    return `
        @HostListener('${this.modelProp.name}Change', ['$event']) change() { }
        @HostListener('onBlur', ['$event']) touched = () => {};
        
        writeValue(value: any): void {
            this.${this.modelProp.name} = value;
        }
    
        ${
          disabledProp
            ? `setDisabledState(isDisabled: boolean): void {
            this.disabled = isDisabled;
        }`
            : ""
        }
    
        registerOnChange(fn: () => void): void { this.change = fn; }
        registerOnTouched(fn: () => void): void { this.touched = fn; }
        `;
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
          acc[relativePath].push(component.name);
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

  getNestedExports(component: ComponentInput, selector: string) {
    const innerNested = (component.members.filter(
      (m) => m.isNested
    ) as Property[])
      .map((m) => this.processNestedProperty(m).join("\n"))
      .join("\n");

    return `
      @Directive({
        selector: "${selector}"
      })
      class Dx${component.name} extends ${component.name} {
        ${innerNested}
      }
    `;
  }

  getNestedFromComponentInput(
    component: ComponentInput,
    parentSelector: string
  ): { component: ComponentInput; parentSelector: string }[] {
    const nestedProps = component.members.filter(
      (m) => m.isNested
    ) as Property[];
    const components = component.context.components!;

    const nested = Object.keys(components).reduce(
      (acc, key) => {
        const property = nestedProps.find(
          ({ type }) => extractComplexType(type) === key
        );
        if (property) {
          const { name: propName, type: propType } = property;
          const isArray = isTypeArray(propType);
          const postfix = isArray ? "i" : "o";
          const selectorName = isArray ? removePlural(propName) : propName;
          const selector = getAngularSelector(selectorName, postfix);

          acc.push({
            component: components[key] as ComponentInput,
            parentSelector: `${parentSelector} ${selector}`,
          });
        }
        return acc;
      },
      [] as {
        component: ComponentInput;
        parentSelector: string;
      }[]
    );

    return nested.concat(
      nested.reduce(
        (acc, el) => {
          return acc.concat(
            this.getNestedFromComponentInput(el.component, el.parentSelector)
          );
        },
        [] as {
          component: ComponentInput;
          parentSelector: string;
        }[]
      )
    );
  }

  compileNestedComponents(nestedModules: string[]) {
    const components = this.context.components!;
    if (this.heritageClauses.length) {
      const heritage = this.heritageClauses[0].typeNodes[0];
      if (heritage instanceof Call && heritage.arguments.length) {
        const inheritFrom = heritage.arguments[0].toString();
        const heritageInput = components[inheritFrom] as ComponentInput;

        const collectedComponents = this.getNestedFromComponentInput(
          heritageInput,
          this.selector
        );
        const imports = this.getNestedImports(
          collectedComponents.map(({ component }) => component)
        );
        const nestedComponents = collectedComponents
          .map(({ component, parentSelector }) => {
            nestedModules.push(`Dx${component.name}`);
            return this.getNestedExports(component, parentSelector);
          })
          .reverse();

        return imports.concat(nestedComponents).join("\n");
      }
    }
    return "";
  }

  compileBindEvents(constructorStatements: string[]) {
    const events = this.members.filter((m) => m.isEvent);

    return events
      .map((e) => {
        constructorStatements.push(
          `this._${e.name}=this.${e.name}.emit.bind(this.${e.name});`
        );
        return `_${e.name}${compileType("any")}`;
      })
      .join(";\n");
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
      .concat(["CommonModule"]);

    const ngOnChangesStatements: string[] = [];
    const ngAfterViewInitStatements: string[] = [];
    const ngOnDestroyStatements: string[] = [];
    const ngAfterViewCheckedStatements: string[] = [];
    const ngDoCheckStatements: string[] = [];
    const constructorStatements: string[] = [];
    const coreImports: string[] = [];
    const constructorArguments: string[] = [];

    this.members.forEach((m) => {
      if (m.isProvider) {
        constructorArguments.push(`private ${m.name}: ${m.context}`);
        constructorStatements.push(
          `this.${m.name}.value = ${(m as Property).initializer}`
        );
      }
      if (m.isConsumer) {
        constructorArguments.push(
          `@SkipSelf() @Host() private ${m.name}: ${m.context}`
        );
      }
    });

    const decoratorToStringOptions: toStringOptions = {
      members: this.members,
      newComponentContext: this.viewModel ? "_viewModel" : "",
      disableTemplates: true,
    };

    const implementedInterfaces: string[] = [];
    let valueAccessor = "";
    if (this.modelProp) {
      implementedInterfaces.push("ControlValueAccessor");

      valueAccessor = `const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ${this.name}),
                multi: true
            }`;

      this.decorator.addParameter(
        "providers",
        new ArrayLiteral(
          [new SimpleExpression("CUSTOM_VALUE_ACCESSOR_PROVIDER")],
          true
        )
      );
    }

    const componentDecorator = this.decorator.toString(
      decoratorToStringOptions
    );
    const spreadAttributes = this.compileSpreadAttributes(
      ngOnChangesStatements,
      coreImports
    );

    this.members
      .filter((m) => m.isForwardRefProp)
      .forEach((m) => {
        ngAfterViewInitStatements.push(`
                this.${m.name}(this.${m.name}Ref);
            `);
      });

    const nestedModules = [] as string[];

    return `
        ${this.compileImports(coreImports)}
        ${this.compileNestedComponents(nestedModules)};
        ${this.compileDefaultOptions(constructorStatements)}
        ${valueAccessor}
        ${componentDecorator}
        ${this.modifiers.join(" ")} class ${this.name} ${
      props.length ? `extends ${props.join(" ")}` : ""
    } ${
      implementedInterfaces.length
        ? `implements ${implementedInterfaces.join(",")}`
        : ""
    } {
            ${this.members
              .filter((m) => !m.inherited && !(m instanceof SetAccessor))
              .map((m) =>
                m.toString({
                  members: this.members,
                  componentContext: SyntaxKind.ThisKeyword,
                  newComponentContext: SyntaxKind.ThisKeyword,
                })
              )
              .filter((m) => m)
              .join("\n")}
            ${spreadAttributes}
            ${this.compileTrackBy(decoratorToStringOptions)}
            ${this.compileEffects(
              ngAfterViewInitStatements,
              ngOnDestroyStatements,
              ngOnChangesStatements,
              ngAfterViewCheckedStatements,
              ngDoCheckStatements
            )}
            ${this.compileGetterCache(ngOnChangesStatements)}
            ${this.compileNgModel()}
            ${this.compileLifeCycle(
              "ngAfterViewInit",
              ngAfterViewInitStatements
            )}
            ${this.compileLifeCycle("ngOnChanges", ngOnChangesStatements, [
              `${ngOnChangesParameters[0]}: {[name:string]: any}`,
            ])}
            ${this.compileLifeCycle("ngOnDestroy", ngOnDestroyStatements)}
            ${this.compileLifeCycle(
              "ngAfterViewChecked",
              ngAfterViewCheckedStatements
            )}
            ${this.compileLifeCycle("ngDoCheck", ngDoCheckStatements)}
            ${this.compileBindEvents(constructorStatements)}
            ${this.compileLifeCycle(
              "constructor",
              constructorStatements.length
                ? [`super()`].concat(constructorStatements)
                : constructorStatements,
              constructorArguments
            )}
            ${this.members.filter((m) => m instanceof SetAccessor).join("\n")}
            ${this.compileNgStyleProcessor(decoratorToStringOptions)}
        }
        @NgModule({
            declarations: [${this.name}, ${nestedModules.join(", ")}],
            imports: [
                ${modules.join(",\n")}
            ],
            exports: [${this.name}, ${nestedModules.join(", ")}]
        })
        export class ${this.module} {}
        ${this.compileDefaultComponentExport()}
        `;
  }
}
