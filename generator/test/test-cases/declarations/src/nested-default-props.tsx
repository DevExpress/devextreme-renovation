import {
  ComponentBindings,
  Nested,
  OneWay,
} from "../../../../component_declaration/common";

@ComponentBindings()
export class GridCell {
  @OneWay() gridData: string = "defaultValue";
}

@ComponentBindings()
export class GridRow {
  @Nested() cells: (GridCell | string)[] = [new GridCell()];
}

@ComponentBindings()
export class WithNestedInput {
  @Nested() rows?: GridRow[] = [new GridRow()];
}

@ComponentBindings()
export class EmptyClass {}

@ComponentBindings()
export class FakeNested {
  @Nested() value?: EmptyClass[] = [new EmptyClass()];
}
