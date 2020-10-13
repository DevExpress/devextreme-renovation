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
import { SimpleExpression } from "../../base-generator/expressions/base";
import {
  Block,
  ReturnStatement,
} from "../../base-generator/expressions/statements";
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
import {
  removePlural,
  compileType,
  capitalizeFirstLetter,
} from "../../base-generator/utils/string";
import { If } from "../../base-generator/expressions/conditions";
import { PropertyAccess } from "../../base-generator/expressions/property-access";
import {
  BindingElement,
  BindingPattern,
} from "../../base-generator/expressions/binding-pattern";

const CUSTOM_VALUE_ACCESSOR_PROVIDER = "CUSTOM_VALUE_ACCESSOR_PROVIDER";

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

export const convertSelectorToName = (selector: string) =>
  selector
    .replace(/dx[io]?-/g, "")
    .split(/[- ]/)
    .map((str) => capitalizeFirstLetter(str))
    .join("");

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
    componentDecorator.addParameter(
      "changeDetection",
      new SimpleExpression("ChangeDetectionStrategy.OnPush")
    );
    this.decorator = componentDecorator;
  }

  createNestedState(
    name: string,
    questionOrExclamationToken: string,
    type: string
  ) {
    return new Property(
      [],
      ["private"],
      new Identifier(`__${name}`),
      questionOrExclamationToken,
      `${type}`,
      undefined
    );
  }

  createNestedPropertySetter(
    decorator: Decorator[],
    modifiers: string[],
    name: string,
    questionOrExclamationToken: string,
    type: string,
    onPushStrategy: boolean
  ) {
    if (questionOrExclamationToken === "?") {
      type = type + "| undefined";
    }
    const statements = [new SimpleExpression(`this.__${name}=value;`)];
    if (onPushStrategy) {
      statements.push(new SimpleExpression(`this._detectChanges();`));
    }

    onPushStrategy;

    return new SetAccessor(
      decorator,
      modifiers,
      new Identifier(`${name}`),
      [new Parameter([], [], undefined, new Identifier("value"), "", type)],
      new Block(statements, true)
    );
  }

  createNestedPropertyGetter(
    modifiers: string[],
    name: string,
    questionOrExclamationToken: string,
    type: string
  ) {
    const isArray = isTypeArray(type);
    const indexGetter = isArray ? "" : "[0]";
    const condition = `this.__${name}`.concat(
      isArray ? `&& this.__${name}.length` : ""
    );
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
          new SimpleExpression(`if (${condition}) {
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
    type: string
  ) {
    return new Property(
      decorator,
      modifiers,
      new Identifier(`${name}Nested`),
      questionOrExclamationToken,
      type,
      undefined
    );
  }

  processNestedProperty(
    property: Property,
    onPushStrategy: boolean = false,
    selector: string = this.selector
  ) {
    const {
      decorators,
      modifiers,
      questionOrExclamationToken,
      type,
      name,
    } = property;

    const nestedCompDecorator = [
      new Decorator(
        new Call(new Identifier(Decorators.NestedComp), undefined, []),
        {}
      ),
    ];

    const nestedName = `Dx${convertSelectorToName(
      `${selector} ${isTypeArray(type) ? removePlural(name) : name}`
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
        questionOrExclamationToken,
        nestedName
      ),
      this.createNestedPropertySetter(
        decorators,
        modifiers,
        name,
        questionOrExclamationToken,
        complexType,
        onPushStrategy
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
        return acc.concat(this.processNestedProperty(m, true));
      }
      if (m.isConsumer) {
        return acc.concat(
          new Property(
            [],
            [],
            new Identifier(`${m.name}Consumer`),
            undefined,
            m.type
          ),
          m
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
          new Call(new Identifier("ViewChild"), undefined, [
            new SimpleExpression(`"${name}"`),
          ]),
          {}
        ),
      ];
      const parameters = [
        new Parameter(
          [],
          [],
          undefined,
          new Identifier("slot"),
          undefined,
          new SimpleTypeExpression("ElementRef<HTMLDivElement>")
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
        true
      );

      members.push(new SetAccessor(decorators, [], name, parameters, body));
    });

    members.push(
      new Method(
        undefined,
        undefined,
        undefined,
        new Identifier("_detectChanges"),
        undefined,
        undefined,
        [],
        SyntaxKind.VoidKeyword,
        new Block(
          [
            new SimpleExpression(`setTimeout(() => {
            ${new If(
              new SimpleExpression(
                "this.changeDetection && !(this.changeDetection as ViewRef).destroyed"
              ),
              new SimpleExpression("this.changeDetection.detectChanges()")
            )}
          })`),
          ],
          true
        )
      )
    );

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
                "",
                member.type,
                undefined
              ),
            ],
            new Block(
              [
                new SimpleExpression(`this.${member.name}=${member._name}`),
                new SimpleExpression("this._detectChanges()"),
              ],
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
        const allDeps = g.getDependency({
          members: this.members,
          componentContext: SyntaxKind.ThisKeyword,
        });
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
        const allDeps = e.getDependency({
          members: this.members,
          componentContext: SyntaxKind.ThisKeyword,
        });
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
              this._detectChanges();
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
    coreImports: string[],
    ngAfterViewInitStatements: string[],
    ngAfterViewCheckedStatements: string[]
  ): string {
    const viewFunction = this.decorator.getViewFunction();
    if (viewFunction) {
      const options: toStringOptions = {
        members: this.members,
        newComponentContext: this.viewModel ? "_viewModel" : "",
      };
      const expression = getTemplate(viewFunction, options);
      const allDependency: string[] = [];
      if (isElement(expression)) {
        options.newComponentContext = SyntaxKind.ThisKeyword;
        const members = [];

        const statements = expression.getSpreadAttributes().map((o, i) => {
          const expressionString = o.expression.toString(options);
          const dependency = (o.expression as PropertyAccess).getDependency(
            options
          );

          const dependencyMembers = this.members.filter((m) =>
            dependency.some((d) => d === m._name.toString())
          );

          allDependency.push.apply(
            allDependency,
            dependencyMembers
              .filter((m) => m instanceof Method)
              .reduce(
                (d: string[], m) =>
                  d.concat(
                    m.getDependency({
                      ...options,
                      componentContext: SyntaxKind.ThisKeyword,
                    })
                  ),
                dependency
              )
          );

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
                    const _attr_${i}:{[name: string]:any } = ${expressionString} || {};
                    const _ref_${i} = ${refString};
                    if(_ref_${i}){
                        for(let key in _attr_${i}) {
                            _ref_${i}.setAttribute(key, _attr_${i}[key].toString());
                        }
                    }
                    `;
        });

        if (statements.length) {
          const methodName = "__applyAttributes__";
          const scheduledApplyAttributes = "scheduledApplyAttributes";
          ngAfterViewCheckedStatements.push(`if(this.${scheduledApplyAttributes}){
            this.${methodName}();
            this.${scheduledApplyAttributes} = false;
          }`);

          const [propsDependency, internalStateDependency] = separateDependency(
            allDependency.filter(
              (d) =>
                !this.members.some(
                  (m) => m._name.toString() === d && m instanceof Method
                )
            ),
            this.members.filter((m) => m.isInternalState) as Property[]
          );

          internalStateDependency.forEach((name) => {
            const setter = this.members.find(
              (p) => p.name === `_${name}`
            ) as SetAccessor;
            if (setter) {
              const expression = `this.${scheduledApplyAttributes} = this`;
              if (
                !setter.body.statements.some(
                  (expr) => expr.toString() === expression
                )
              ) {
                setter.body.statements.push(new SimpleExpression(expression));
              }
            }
          });

          if (propsDependency.length) {
            ngOnChangesStatements.push(`if([${propsDependency
              .map((d) => `"${d}"`)
              .join(",")}].some(d=>
              ${ngOnChangesParameters[0]}[d] && !${
              ngOnChangesParameters[0]
            }[d].firstChange)){
                this.${scheduledApplyAttributes} = true;
            }`);
          }

          ngAfterViewInitStatements.push(`this.${methodName}()`);

          members.push(`
            ${scheduledApplyAttributes} = false;
            ${methodName}(){
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
    if (statements.length || (name !== "ngOnChanges" && parameters.length)) {
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
            this._detectChanges();
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

  getNestedExports(component: ComponentInput, selector: string) {
    const innerNested = (component.members.filter(
      (m) => m.isNested
    ) as Property[])
      .map((m) => this.processNestedProperty(m, false, selector).join("\n"))
      .join("\n");

    const name = convertSelectorToName(selector);

    return `
      @Directive({
        selector: "${selector}"
      })
      class Dx${name} extends ${component.name} {
        ${innerNested}
      }
    `;
  }

  getNestedFromComponentInput(
    component: ComponentInput,
    parentSelector: string = this.selector
  ): { component: ComponentInput; name: string }[] {
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
            name: `${parentSelector} ${selector}`,
          });
        }
        return acc;
      },
      [] as {
        component: ComponentInput;
        name: string;
      }[]
    );

    return nested.concat(
      nested.reduce(
        (acc, el) => {
          return acc.concat(
            this.getNestedFromComponentInput(el.component, el.name)
          );
        },
        [] as {
          component: ComponentInput;
          name: string;
        }[]
      )
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
        collectedComponents.map(({ component }) => component)
      );
      const nestedComponents = collectedComponents
        .map(({ component, name }) => {
          nestedModules.push(`Dx${convertSelectorToName(name)}`);
          return this.getNestedExports(component, name);
        })
        .reverse();

      return imports.concat(nestedComponents).join("\n");
    }
    return "";
  }

  compileBindEvents(constructorStatements: string[]) {
    const events = this.members.filter((m) => m.isEvent);

    return events
      .map((e) => {
        const parameters = (e.type as FunctionTypeNode).parameters || [];
        constructorStatements.push(
          `this._${e.name}=(${parameters.join(",")}) => {
            this.${e.name}.emit(${parameters.map((p) => p.name).join(",")});
            ${
              this.members.some(
                (m) => m.isState && e.name === `${m.name}Change`
              )
                ? "this._detectChanges();"
                : ""
            }
          }`
        );
        return `_${e.name}${compileType("any")}`;
      })
      .join(";\n");
  }

  compilePortalComponent(
    coreImports: string[],
    cdkImports: string[],
    importModules: string[]
  ) {
    coreImports.push("ViewChild");
    coreImports.push("ComponentFactoryResolver");
    coreImports.push("ApplicationRef");
    coreImports.push("Injector");
    coreImports.push("ElementRef");
    cdkImports.push("DomPortalOutlet");
    cdkImports.push("DomPortal");
    importModules.push("DxPortal");

    return `@Component({
        selector: "dx-portal",
        template: \`<div #content style="display:contents" *ngIf="container">
          <ng-content></ng-content>
        </div>\`
      })
      class DxPortal {
        @Input() container?: HTMLElement;
        @ViewChild("content") content?: ElementRef<HTMLDivElement>;
        _portal?: DomPortal;
        _outlet?: DomPortalOutlet;

        constructor(
          private _cfr: ComponentFactoryResolver,
          private _ar: ApplicationRef,
          private _injector: Injector,
        ) {}

        _renderPortal() {
          if(this._portal && this._portal.isAttached) {
            this._portal.detach();
          }
          if (this.content) {
            this._portal = new DomPortal(this.content);
          }
        }

        _renderOutlet() {
          if(this._outlet) {
            this._outlet.detach();
          }
          if (this.container && document) {
            this._outlet = new DomPortalOutlet(
              this.container,
              this._cfr,
              this._ar,
              this._injector,
              document
            );
          }
        }

        _attachPortal() {
          if(this._outlet && this._portal) {
            this._outlet.attach(this._portal);
          }
        }

        ngAfterViewInit(changes: any) {
          this._renderPortal();
          this._renderOutlet();
          this._attachPortal();
        }

        ngOnChanges(changes: any) {
          if (changes.container) {
            this._renderPortal();
            this._renderOutlet();
            this._attachPortal();
          }
        }

        ngOnDestroy() {
          if(this._outlet) {
            this._outlet.dispose();
          }
        }
      }`;
  }

  compileCdkImports(cdkImports: string[] = []) {
    if (cdkImports.length) {
      return `import { ${[...new Set(cdkImports)].join(
        ","
      )} } from "@angular/cdk/portal"`;
    }
    return "";
  }

  fillProviders() {
    let providers: string[] = [];

    const contextProperties = this.members.filter(
      (m) => m.isConsumer || m.isProvider
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
        "providers",
        new ArrayLiteral(
          providers.map((p) => new SimpleExpression(p)),
          true
        )
      );
    }
  }

  compileValueAccessor(implementedInterfaces: string[]): string {
    if (this.modelProp) {
      implementedInterfaces.push("ControlValueAccessor");
      return `const ${CUSTOM_VALUE_ACCESSOR_PROVIDER} = {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ${this.name}),
                multi: true
            }`;
    }

    return "";
  }

  compileContext(
    constructorStatements: string[],
    constructorArguments: string[],
    ngDoCheckStatements: string[],
    ngOnDestroyStatements: string[]
  ): string {
    let destroyContext = "";
    this.members.forEach((m) => {
      if (m.isProvider) {
        const name = m instanceof GetAccessor ? `${m._name}Provider` : m.name;
        constructorArguments.push(`@Host() private ${name}: ${m.context}`);

        if (!(m instanceof GetAccessor)) {
          constructorStatements.push(
            `this.${m.name}.value = ${(m as Property).initializer}`
          );
        } else {
          if (m instanceof GetAccessor) {
            ngDoCheckStatements.push(m.getter(SyntaxKind.ThisKeyword));
          }
        }
      }
      if (m.isConsumer) {
        constructorArguments.push(
          `@SkipSelf() @Optional() private ${m.name}: ${m.context}`
        );
        destroyContext = "_destroyContext: Array<()=>void> = [];";
        constructorStatements.push(
          `if(!${m.name}){
            this.${m.name} = new ${m.context}();
          } else {
            const changeHandler = (value: ${m.type})=>{
              this.${m.name}Consumer = value
              this._detectChanges();
            };
            const subscription = ${m.name}.change.subscribe(changeHandler);
            this._destroyContext.push(()=>{
              subscription.unsubscribe();
            });
          }
          this.${m.name}Consumer = this.${m.name}.value;
          `
        );
      }
    });

    if (destroyContext.length) {
      ngOnDestroyStatements.push(`this._destroyContext.forEach(d=>d())`);
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
            .join(",");
          return defaults ? `${c.name}Defaults = {${defaults}}` : "";
        })
        .filter((d) => d)
        .join("\n");
    }
    return "";
  }

  returnGetAccessorBlock(
    argumentPattern: BindingPattern,
    options: toStringOptions,
    spreadVar: BindingElement
  ) {
    const propsNames = getProps(options.members).map((p) => p._name.toString());
    const argNames = argumentPattern.getAllDependency(options);
    const res = propsNames
      .filter((p) => !argNames.includes(p))
      .map(
        (r) =>
          new BindingElement(
            "",
            new Identifier(r),
            new Identifier(`this.${r}`),
            undefined
          )
      );
    return new Block(
      [new ReturnStatement(new BindingPattern(res, "object"))],
      true
    );
  }
  createViewSpreadAccessor(name: Identifier, body: Block) {
    return new GetAccessor(undefined, undefined, name, [], undefined, body);
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
    const coreImports: string[] = [
      "ChangeDetectionStrategy",
      "ChangeDetectorRef",
      "ViewRef",
    ];
    const constructorArguments: string[] = [
      "private changeDetection: ChangeDetectorRef",
    ];

    const cdkImports: string[] = [];

    const spreadGetAccessor = this.getViewSpreadAccessor();
    if (spreadGetAccessor) {
      this.members.push(spreadGetAccessor);
    }

    const decoratorToStringOptions: toStringOptions = {
      members: this.members,
      newComponentContext: this.viewModel ? "_viewModel" : "",
      disableTemplates: true,
    };

    const implementedInterfaces: string[] = [];

    this.fillProviders();
    const componentDecorator = this.decorator.toString(
      decoratorToStringOptions
    );
    const spreadAttributes = this.compileSpreadAttributes(
      ngOnChangesStatements,
      coreImports,
      ngAfterViewInitStatements,
      ngAfterViewCheckedStatements
    );

    this.members
      .filter((m) => m.isForwardRefProp)
      .forEach((m) => {
        const token = (m as Property).isOptional ? "?." : "";
        ngAfterViewInitStatements.push(`
                this.${m.name}${token}(this.${m.name}Ref);
            `);
      });

    const nestedModules = [] as string[];
    const importModules = [] as string[];

    const portalComponent = this.containsPortal()
      ? this.compilePortalComponent(coreImports, cdkImports, importModules)
      : "";

    if (this.members.some((m) => m.isNestedComp)) {
      ngAfterViewInitStatements.push("this._detectChanges()");
    }

    const trackBy = this.compileTrackBy(decoratorToStringOptions);

    return `
        ${this.compileImports(coreImports)}
        ${this.compileCdkImports(cdkImports)}
        ${this.compileNestedComponents(nestedModules)}
        ${portalComponent}
        ${this.compileDefaultOptions(constructorStatements)}
        ${this.compileValueAccessor(implementedInterfaces)}
        ${componentDecorator}
        ${this.modifiers.join(" ")} class ${this.name} ${
      props.length ? `extends ${props.join(" ")}` : ""
    } ${
      implementedInterfaces.length
        ? `implements ${implementedInterfaces.join(",")}`
        : ""
    } {
            ${this.extractGlobalsFromTemplate(
              componentDecorator + trackBy,
              " = "
            ).join(";\n")}
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
            ${trackBy}
            ${this.compileContext(
              constructorStatements,
              constructorArguments,
              ngDoCheckStatements,
              ngOnDestroyStatements
            )}
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
              (constructorStatements.length || constructorArguments.length) &&
                this.heritageClauses.length
                ? ["super()"].concat(constructorStatements)
                : constructorStatements,
              constructorArguments
            )}
            ${this.members.filter((m) => m instanceof SetAccessor).join("\n")}
            ${this.compileNgStyleProcessor(decoratorToStringOptions)}
            ${this.compileDefaultPropsForTemplates(decoratorToStringOptions)}
        }
        @NgModule({
            declarations: [${this.name}, ${nestedModules
      .concat(importModules)
      .join(", ")}],
            imports: [
                ${modules.join(",\n")}
            ],
            exports: [${this.name}, ${nestedModules.join(", ")}]
        })
        export class ${this.module} {}
        export { ${this.name} as Dx${this.name}Component };
        ${this.compileDefaultComponentExport()}
        `;
  }
}
