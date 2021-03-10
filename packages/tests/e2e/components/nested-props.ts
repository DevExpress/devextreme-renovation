import {
  ComponentBindings,
  Nested,
  OneWay,
} from "@devextreme-generator/declaration";

@ComponentBindings()
export class GridCell {
  @OneWay() gridData?: string = "defaultValue";
}

@ComponentBindings()
export class GridRow {
  @Nested() cells?: (GridCell | string)[];
}

@ComponentBindings()
export class WithNestedInput {
  @Nested() rows?: GridRow[];
}
