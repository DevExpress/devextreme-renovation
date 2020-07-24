import { Input, Output, EventEmitter } from "@angular/core";
export class GridColumn {
  @Input() name: string = "";
  @Input() index: number = 0;
  @Output() indexChange: EventEmitter<number> = new EventEmitter();
  _indexChange!: (index: number) => void;
}

export class Custom {}

export class AnotherCustom {}

export class Editing {
  @Input() editEnabled?: boolean = false;
  @Input() custom?: Custom[] = [];
  @Input() anotherCustom?: AnotherCustom = {};
}

export class WidgetInput {
  @Input() columns?: Array<GridColumn | string>;
  @Input() gridEditing?: Editing;
}
