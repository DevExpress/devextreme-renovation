import {
  ComponentBindings,
  Nested,
  OneWay,
  TwoWay,
} from "@devextreme-generator/declarations";

@ComponentBindings()
export class GridColumnProps {
  @OneWay() name: string = "";
  @TwoWay() index: number = 0;
  @Nested() editing?: ColumnEditingProps;
  @Nested() custom?: CustomProps[];
}

@ComponentBindings()
export class CustomProps {}

@ComponentBindings()
export class AnotherCustomProps {}

@ComponentBindings()
export class EditingProps {
  @OneWay() editEnabled?: boolean = false;
  @Nested() custom?: CustomProps[];
  @Nested() anotherCustom?: AnotherCustomProps;
}

@ComponentBindings()
export class ColumnEditingProps {
  @OneWay() editEnabled?: boolean = false;
}

@ComponentBindings()
export class WidgetProps {
  @Nested() columns?: Array<GridColumnProps | string>;
  @Nested() editing?: EditingProps;
}

export type PickedProps = Pick<WidgetProps, "editing" | "columns">;
