import { Input, Output, EventEmitter } from "@angular/core";
export class GridColumn {
  @Input() name: string = "";
  @Input() index: number = 0;
  @Input() editing?: ColumnEditing = {};
  @Output() indexChange: EventEmitter<number> = new EventEmitter();
}

export class Custom {}

export class AnotherCustom {}

export class Editing {
  @Input() editEnabled?: boolean = false;
  @Input() custom?: Custom[] = [];
  @Input() anotherCustom?: AnotherCustom = {};
}

export class ColumnEditing {
  @Input() editEnabled?: boolean = false;
}

export class WidgetInput {
  @Input() columns?: Array<GridColumn | string>;
  @Input() editing?: Editing;
}
