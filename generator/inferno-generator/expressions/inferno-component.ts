import { ReactComponent } from "../../react-generator/expressions/react-component";
import { Method } from "../../base-generator/expressions/class-members";
import { Identifier } from "../../base-generator/expressions/common";
import { TypeExpression } from "../../base-generator/expressions/type";
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

export class InfernoComponent extends ReactComponent {
  compileImportStatements(
    hooks: string[],
    compats: string[],
    core: string[]
  ): string[] {
    const imports = [
      `import { Component as InfernoComponent } from "inferno"`,
      `import { createElement as h } from "inferno-create-element"`,
    ];
    return imports;
  }

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
        ? `this.state.${m.name}`
        : `this.props.${m.name}!==undefined?this.props.${m.name}:this.state.${m.name}`;

      const setStateStatement = `this.setState({ ${m.name}: value })`;
      const changePropertyName = `${m.name}Change`;
      const changeProperty = props.find(
        (m) => m.name === changePropertyName
      ) as Property;
      const setterStatement = m.isInternalState
        ? setStateStatement
        : `${setStateStatement};
                this.props.${m.name}Change${getChangeEventToken(
            changeProperty
          )}(value)
              `;

      const type =
        m.questionOrExclamationToken !== "?" ? m.type : `${m.type}|undefined`;

      result.push(
        this.createGetAccessor(
          m._name,
          type,
          new Block(
            [new ReturnStatement(new SimpleExpression(getterStatement))],
            false
          )
        )
      );
      result.push(
        new SetAccessor(
          [],
          [],
          m._name,
          [new Parameter([], [], undefined, new Identifier("value"), "", type)],
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
      return `state: {
          ${state.map((p) => p.typeDeclaration())}
       };`;
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

  toString() {
    const propsType = this.compilePropsType();

    return `
            ${this.compileImports()}
            ${this.compileRestProps()}
            ${this.compileDefaultOptionsMethod()}
            ${this.modifiers.join(" ")} class ${
      this.name
    } extends InfernoComponent<${propsType}> {
                ${this.compileStateProperty()}
                refs: any;
                constructor(props: ${propsType}) {
                    super({
                        ${this.compileDefaultPropsObjectProperties()
                          .concat("...props")
                          .join(",")}
                    });
                    ${this.compileStateInitializer()}
                }

                ${this.compileStateSetterAndGetters()}

                ${this.methods
                  .map((m) => m.toString(this.getToStringOptions()))
                  .join("\n")}
                
                render(){
                    const props = this.props;
                    return ${this.compileViewCall()}
                }
            }
        `;
  }
}
