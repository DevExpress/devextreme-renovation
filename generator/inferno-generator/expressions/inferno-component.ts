import { ReactComponent } from "../../react-generator/expressions/react-component";
import {
  Property,
  Method,
} from "../../base-generator/expressions/class-members";
import { Identifier } from "../../base-generator/expressions/common";
import { TypeExpression } from "../../base-generator/expressions/type";
import { Block } from "../../base-generator/expressions/statements";
import { GetAccessor } from "./class-members/get-accessor";

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
    type: TypeExpression,
    block: Block
  ): GetAccessor {
    return new GetAccessor(undefined, undefined, name, [], type, block);
  }

  compileViewModelArguments(): string {
    return `${super.compileViewModelArguments()} as ${this.name}`;
  }

  toString() {
    const propsType = this.compilePropsType();
    return `
            ${this.compileImports()}
            ${this.compileRestProps()}
            ${this.modifiers.join(" ")} class ${
      this.name
    } extends InfernoComponent<${propsType}> {
                constructor(props: ${propsType}) {
                    super({
                      ${this.compileDefaultPropsObjectProperties().join(",")},
                      ...props
                    });
                  }

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
