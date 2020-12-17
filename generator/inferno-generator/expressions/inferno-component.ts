import { ReactComponent } from "../../react-generator/expressions/react-component";
import {
  Property,
  Method,
} from "../../base-generator/expressions/class-members";
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
    members = super.processMembers(members);
    return members.map((m) => {
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
    const members = (this.members.filter(
      (m) => m.isInternalState
    ) as Property[]).reduce((result: Array<GetAccessor | SetAccessor>, m) => {
      result.push(
        this.createGetAccessor(
          m._name,
          m.type,
          new Block(
            [
              new ReturnStatement(
                new SimpleExpression(`this.state.${m._name}`)
              ),
            ],
            false
          )
        )
      );
      result.push(
        new SetAccessor(
          [],
          [],
          m._name,
          [
            new Parameter(
              [],
              [],
              undefined,
              new Identifier("value"),
              m.questionOrExclamationToken,
              m.type
            ),
          ],
          new Block(
            [
              new SimpleExpression(`this.setState({
                            ${m.name}: value
                        })`),
            ],
            false
          )
        )
      );
      return result;
    }, []);

    return members.map((m) => m.toString(this.getToStringOptions())).join("\n");
  }

  toString() {
    const propsType = this.compilePropsType();
    const state = this.internalState.map((p) => {
      return p.defaultDeclaration();
    });

    return `
            ${this.compileImports()}
            ${this.compileRestProps()}
            ${this.modifiers.join(" ")} class ${
      this.name
    } extends InfernoComponent<${propsType}> {
                ${
                  state.length
                    ? `state = {
                        ${state.join(",\n")}
                    }`
                    : ""
                }
                constructor(props: ${propsType}) {
                    super({
                        ${this.compileDefaultPropsObjectProperties()
                          .concat("...props")
                          .join(",")}
                    });
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
