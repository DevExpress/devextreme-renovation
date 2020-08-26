import {
  ComponentBindings,
  Nested,
  OneWay,
  TwoWay,
} from "../../../../component_declaration/common";

@ComponentBindings()
export class GridColumn {
  @OneWay() name: string = "";
  @TwoWay() index: number = 0;
  @Nested() editing?: ColumnEditing;
  @Nested() custom?: Custom[];
}

@ComponentBindings()
export class Custom {}

@ComponentBindings()
export class AnotherCustom {}

@ComponentBindings()
export class Editing {
  @OneWay() editEnabled?: boolean = false;
  @Nested() custom?: Custom[];
  @Nested() anotherCustom?: AnotherCustom;
}

@ComponentBindings()
export class ColumnEditing {
  @OneWay() editEnabled?: boolean = false;
}

@ComponentBindings()
export class WidgetInput {
  @Nested() columns?: Array<GridColumn | string>;
  @Nested() editing?: Editing;
}

export type PickedProps = Pick<WidgetInput, "editing" | "columns">;
