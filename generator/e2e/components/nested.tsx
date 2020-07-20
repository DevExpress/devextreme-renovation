import { Component, JSXComponent } from "../../component_declaration/common";
import { WithNestedInput } from "./nested-props.ts";

function view(model: WithNested) {
  return (
    <div>
      {model.cellsName.map((name) => (
        <span>{name}</span>
      ))}
    </div>
  );
}

@Component({
  view,
})
export default class WithNested extends JSXComponent(WithNestedInput) {
  get cellsName() {
    const cells = this.props.cells;
    return (
      cells?.map((cell) => (typeof cell === "string" ? cell : cell.data)) || []
    );
  }
}
