import {
  ComponentBindings,
  Nested,
  OneWay,
} from "../../component_declaration/common";

@ComponentBindings()
export class GridCell {
  @OneWay() gridData?: string = "";
}

@ComponentBindings()
export class GridRow {
  @Nested() gridDataCells?: (GridCell | string)[];
}

@ComponentBindings()
export class WithNestedInput {
  @Nested() gridDataRows?: GridRow[];
}
