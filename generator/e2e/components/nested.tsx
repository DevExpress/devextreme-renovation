import { Component, JSXComponent } from "../../component_declaration/common";
import { WithNestedInput } from "./nested-props";

function view({ props: { rows }, getRowCells }: WithNested) {
  return (
    <div>
      {rows ? (
        rows.length ? (
          rows?.map((_, index) => (
            <span key={index}>
              {getRowCells(index)}
              <br />
            </span>
          ))
        ) : (
          <span>{"Empty Array"}</span>
        )
      ) : (
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
    const cells = this.props.rows?.[index].cells;
    console.log(cells, this.props);
    return (
      cells
        ?.map((cell) => (typeof cell === "string" ? cell : cell.gridData))
        .join("|") || []
    );
  }
}
