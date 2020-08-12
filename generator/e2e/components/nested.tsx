import { Component, JSXComponent } from "../../component_declaration/common";
import { WithNestedInput } from "./nested-props.ts";

function view(model: WithNested) {
  return (
    <div>
      {model.props.gridDataRows?.map((_, index) => (
        <span key={index}>
          {model.getRowCells(index)}
          <br />
        </span>
      ))}
      {!model.props.gridDataRows && <span>{"No Data"}</span>}
    </div>
  );
}

@Component({
  view,
})
export default class WithNested extends JSXComponent(WithNestedInput) {
  getRowCells(index) {
    const cells = this.props.gridDataRows[index].gridDataCells;
    return (
      cells
        ?.map((cell) => (typeof cell === "string" ? cell : cell.gridData))
        .join("|") || []
    );
  }
}
