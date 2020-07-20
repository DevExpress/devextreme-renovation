import { Input, Output, EventEmitter } from "@angular/core";
export class GridColumn {
  @Input() name: string = "";
  @Input() index: number = 0;
  @Output() indexChange: EventEmitter<number> = new EventEmitter();
}

export class Custom {}

export class Editing {
  @Input() editEnabled?: boolean = false;
  @Input() custom?: Custom[] = [];
}

export class WidgetInput {
  @Input() columns?: Array<GridColumn | string>;
  @Input() gridEditing?: Editing;
}
