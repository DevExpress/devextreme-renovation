import { Component, JSXComponent } from "../../component_declaration/common";
import { WithNestedInput } from "./nested-props";

function view(model: WithNested) {
  return (
    <div>
      {model.props.rows?.map((_, index) => (
        <span key={index}>
          {model.getRowCells(index)}
          <br />
        </span>
      ))}
      {/*
        should be model.props.rows.length conditions after #501 is fixed 
      */}
      {!(model.props.rows && model.props.rows.length) && (
        <span>{"No Data"}</span>
      )}
    </div>
  );
}

@Component({
  view,
})
export default class WithNested extends JSXComponent(WithNestedInput) {
  getRowCells(index: number) {
    const cells = this.props.rows[index].cells;
    return (
      cells
        ?.map((cell) => (typeof cell === "string" ? cell : cell.gridData))
        .join("|") || []
    );
  }
}
