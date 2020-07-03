declare type Column = { name: string; index?: number };
declare type Editing = { editEnabled?: boolean };
declare type Custom = {};

import { Input, ContentChildren, QueryList, Directive } from "@angular/core";
@Directive({
  selector: "dx-widget dxi-column",
})
class DxColumn implements Column {
  @Input() name!: string;
  @Input() index?: number;
}
@Directive({
  selector: "dx-widget dxo-grid-editing",
})
class DxEditing implements Editing {
  @Input() editEnabled?: boolean;
}
@Directive({
  selector: "dx-widget dxi-some-array",
})
class DxCustom implements Custom {}
class WidgetInput {
  @Input() columns?: Array<Column | string>;
  @Input() gridEditing?: Editing;
  @Input() someArray?: Array<Custom>;
  @ContentChildren(DxColumn) columnsNested!: QueryList<DxColumn>;
  @ContentChildren(DxEditing) gridEditingNested!: QueryList<DxEditing>;
  @ContentChildren(DxCustom) someArrayNested!: QueryList<DxCustom>;
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  template: `<div></div>`,
})
export default class Widget extends WidgetInput {
  __getColumns(): any {
    return (this.columns || this.columnsNested.toArray())?.map((el) =>
      typeof el === "string" ? el : el.name
    );
  }
  get __isEditable(): any {
    return (this.gridEditing || this.gridEditingNested.toArray()?.[0])
      ?.editEnabled;
  }
  get __restAttributes(): any {
    return {};
  }
}
@NgModule({
  declarations: [Widget, DxColumn, DxEditing, DxCustom],
  imports: [CommonModule],
  exports: [Widget, DxColumn, DxEditing, DxCustom],
})
export class DxWidgetModule {}
