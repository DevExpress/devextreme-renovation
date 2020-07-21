import {
  ComponentBindings,
  Nested,
  OneWay,
} from "../../component_declaration/common";

@ComponentBindings()
export class GridCell {
  @OneWay() data?: string = "";
}

@ComponentBindings()
export class WithNestedInput {
  @Nested() cells?: (GridCell | string)[];
}
