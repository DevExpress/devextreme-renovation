import {
  Component,
  ComponentBindings,
  JSXComponent,
  Nested,
} from "../../component_declaration/common";

declare type Cell = {
  data: string;
};

function view(model: WithNested) {
  return (
    <div>
      {model.cellsName.map((name) => (
        <span>{name}</span>
      ))}
    </div>
  );
}

@ComponentBindings()
export class WithNestedInput {
  @Nested() cells?: (Cell | string)[];
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
