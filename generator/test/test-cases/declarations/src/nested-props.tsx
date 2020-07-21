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
}

@ComponentBindings()
export class Custom {}

@ComponentBindings()
export class AnotherCustom {}

@ComponentBindings()
export class Editing {
  @OneWay() editEnabled?: boolean = false;
  @Nested() custom?: Custom[] = [];
  @Nested() anotherCustom?: AnotherCustom = {};
}

@ComponentBindings()
export class WidgetInput {
  @Nested() columns?: Array<GridColumn | string>;
  @Nested() gridEditing?: Editing;
}
