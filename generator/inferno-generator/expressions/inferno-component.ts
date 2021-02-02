import {
  Method,
  BaseClassMember,
} from "../../base-generator/expressions/class-members";
import { Identifier } from "../../base-generator/expressions/common";
import {
  TypeExpression,
  FunctionTypeNode,
} from "../../base-generator/expressions/type";
import {
  Block,
  ReturnStatement,
} from "../../base-generator/expressions/statements";
import { GetAccessor } from "./class-members/get-accessor";
import { SimpleExpression } from "../../base-generator/expressions/base";
import { SetAccessor } from "../../angular-generator/expressions/class-members/set-accessor";
import { Parameter } from "../../base-generator/expressions/functions";
import { getProps } from "../../base-generator/expressions/component";
import { getChangeEventToken } from "../../react-generator/expressions/property-access";
import { Property } from "./class-members/property";
import { PreactComponent } from "../../preact-generator";
import { Decorators } from "../../component_declaration/decorators";

const getEffectRunParameter = (effect: BaseClassMember) =>
  effect.decorators
    .find((d) => d.name === Decorators.Effect)
    ?.getParameter("run")
    ?.valueOf();

export class InfernoComponent extends PreactComponent {
  REF_OBJECT_TYPE = "RefObject";

  compileImportStatements(hooks: string[]): string[] {
    const coreImports = [];
    const hooksSet = new Set(hooks);

    if (hooksSet.has("useRef")) {
      coreImports.push("createRef as infernoCreateRef");
    }

    const imports = [`import { createElement as h } from "inferno-compat";`];

    if (coreImports.length) {
      imports.push(`import { ${coreImports.join(",")} } from "inferno"`);
    }

    return imports;
  }

  compileApiRefImports() {}

  addPrefixToMembers(members: Array<Property | Method>) {
    return members;
  }

  processMembers(members: Array<Property | Method>) {
    return super.processMembers(members).map((m) => {
      if (m._name.toString() === "restAttributes") {
        m.prefix = "";
      }
      return m;
    });
  }

  getToStringOptions() {
    return {
      ...super.getToStringOptions(),
      newComponentContext: "this",
    };
  }

  createGetAccessor(
    name: Identifier,
    type: TypeExpression | string,
    block: Block
  ): GetAccessor {
    return new GetAccessor(undefined, undefined, name, [], type, block);
  }

  compileViewModelArguments(): string {
    return `${super.compileViewModelArguments()} as ${this.name}`;
  }

  compileStateSetterAndGetters(): string {
    const props = getProps(this.members);
    const members = (this.members.filter(
      (m) => m.isInternalState || m.isState
    ) as Property[]).reduce((result: Array<GetAccessor | SetAccessor>, m) => {
      const getterStatement = m.isInternalState
        ? `state.${m.name}`
        : `this.props.${m.name}!==undefined?this.props.${m.name}:state.${m.name}`;

      const changePropertyName = `${m.name}Change`;
      const changeProperty = props.find(
        (m) => m.name === changePropertyName
      ) as Property;

      const setStateStatement = `this.setState((state: any)=>{
        this._currentState = state;
        const newValue = value();
        ${
          changeProperty
            ? `this.props.${m.name}Change${getChangeEventToken(
                changeProperty
              )}(newValue)`
            : ""
        };
        this._currentState = null;
        return {${m.name}: newValue};
      })`;

      const setterStatement = setStateStatement;

      const type =
        m.questionOrExclamationToken !== "?" ? m.type : `${m.type}|undefined`;

      const getterName = m.isInternalState
        ? m._name
        : new Identifier(`__state_${m._name}`);

      result.push(
        this.createGetAccessor(
          getterName,
          type,
          new Block(
            [
              new SimpleExpression(
                "const state = this._currentState||this.state"
              ),
              new ReturnStatement(new SimpleExpression(getterStatement)),
            ],
            false
          )
        )
      );
      result.push(
        new Method(
          [],
          [],
          undefined,
          new Identifier(`set_${m._name}`),
          undefined,
          undefined,
          [
            new Parameter(
              [],
              [],
              undefined,
              new Identifier("value"),
              "",
              new FunctionTypeNode(undefined, [], type)
            ),
          ],
          "any",
          new Block([new SimpleExpression(setterStatement)], false)
        )
      );
      return result;
    }, []);

    return members.map((m) => m.toString(this.getToStringOptions())).join("\n");
  }

  compileStateProperty(): string {
    const state = this.internalState.concat(this.state);

    if (state.length) {
      const type = `{
        ${state.map((p) => p.typeDeclaration())}
     }`;
      return `
      state: ${type};
      _currentState: ${type}|null = null;
      `;
    }

    return "state = {};";
  }

  compileStateInitializer(): string {
    const state = this.internalState.concat(this.state);

    if (state.length) {
      return `this.state = {
        ${state.map((p) => p.defaultDeclaration()).join(",\n")}
      };`;
    }

    return "";
  }

  compileEffects() {
    const createEffectsStatements: string[] = [];
    const updateEffectsStatements: string[] = [];
    if (this.effects.length) {
      const dependencies = this.effects.map((e) =>
        e.getDependency(this.getToStringOptions()).map((d) => `this.${d}`)
      );

      const create = this.effects.map((e, i) => {
        const dependency =
          getEffectRunParameter(e) !== "once" ? dependencies[i] : [];
        return `new InfernoEffect(this.${e.name}, [${dependency.join(",")}])`;
      });

      createEffectsStatements.push(`
       return [
          ${create.join(",")}
        ];
      `);

      const update = this.effects.reduce((result: string[], effect, index) => {
        const run = getEffectRunParameter(effect);

        if (run !== "once") {
          const dependency = dependencies[index];
          result.push(
            `this._effects[${index}]?.update([${dependency.join(",")}])`
          );
        }
        return result;
      }, []);

      updateEffectsStatements.push(update.join(";\n"));
    }

    return `
      ${this.compileLifeCycle("createEffects", createEffectsStatements)}
      ${this.compileLifeCycle("updateEffects", updateEffectsStatements)}
    `;
  }

  compileLifeCycle(name: string, statements: string[]) {
    if (statements.length) {
      return `${name}(){
        ${statements.join(";\n")}
      }`;
    }

    return "";
  }

  compileProviders(_providers: Property[], viewCallExpression: string) {
    return viewCallExpression;
  }

  compileGetChildContext() {
    const providers = this.members.filter((m) => m.isProvider);

    if (providers.length) {
      return this.compileLifeCycle("getChildContext", [
        `return {
          ...this.context,
          ${providers.map((p) => `${p.context}: this.${p.name}`).join(",\n")}
        }
      `,
      ]);
    }

    return "";
  }

  toString() {
    const propsType = this.compilePropsType();

    const properties = this.members.filter(
      (m) => m instanceof Property && !m.inherited && !m.isInternalState
    );
    const bindMethods = this.members
      .filter((m) => m instanceof Method && !(m instanceof GetAccessor))
      .map((m) => `this.${m.name} = this.${m.name}.bind(this)`)
      .join(";\n");

    return `
            ${this.compileImports()}
            ${this.compileRestProps()}
            ${this.compileTemplateGetter()}
            ${this.modifiers.join(" ")} class ${
      this.name
    } extends InfernoComponent<${propsType}> {
                ${this.compileStateProperty()}
                refs: any;
                ${properties
                  .map((p) => p.toString(this.getToStringOptions()))
                  .join(";\n")}
                  
                constructor(props: ${propsType}) {
                    super(props);
                    ${this.compileStateInitializer()}
                    ${bindMethods}
                }

                ${this.compileEffects()}

                ${this.compileStateSetterAndGetters()}
                
                ${this.compileGetChildContext()}

                ${this.effects
                  .concat(this.methods)
                  .concat(this.members.filter((m) => m.isApiMethod) as Method[])
                  .map((m) => m.toString(this.getToStringOptions()))
                  .join("\n")}
                
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
