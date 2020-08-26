import { Input, Output, EventEmitter } from "@angular/core";
export class GridColumnProps {
  @Input() name: string = "";
  @Input() index: number = 0;
  @Input() editing?: ColumnEditingProps;
  @Input() custom?: CustomProps[];
  @Output() indexChange: EventEmitter<number> = new EventEmitter();
}

export class CustomProps {}

export class AnotherCustomProps {}

export class EditingProps {
  @Input() editEnabled?: boolean = false;
  @Input() custom?: CustomProps[];
  @Input() anotherCustom?: AnotherCustomProps;
}

export class ColumnEditingProps {
  @Input() editEnabled?: boolean = false;
}

export class WidgetProps {
  @Input() columns?: Array<GridColumnProps | string>;
  @Input() editing?: EditingProps;
}

export class PickedProps {
  @Input() columns?: Array<GridColumnProps | string> = new WidgetProps()
    .columns;
  @Input() editing?: EditingProps = new WidgetProps().editing;
}
