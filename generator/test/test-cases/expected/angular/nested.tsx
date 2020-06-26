declare type Column = { name: string, index?: number }
declare type Editing = { editEnabled?: boolean }


import { Input, ContentChildren, QueryList, Directive } from "@angular/core"
@Directive({
  selector: "dx-widget dxi-column"
})
class DxColumn implements Column {
  name!: string;
  index?: number
}
@Directive({
  selector: "dx-widget dxo-editing"
})
class DxEditing implements Editing {
  editEnabled?: boolean
}
class WidgetInput {
  @Input() collect?: Array<Column | string>;
  @ContentChildren(DxColumn) collectNested!: QueryList<DxColumn>;
  @Input() editing?: Editing;
  @ContentChildren(DxEditing) editingNested!: QueryList<DxEditing>;

}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"


@Component({
  selector: "dx-widget",
  template: `<div ></div>`
})
export default class Widget extends WidgetInput {
  __getColumns(): any {

    return (this.collect || this.collectNested.toArray())?.map((el) => typeof el === "string" ? el : el.name);
  }
  get __isEditable(): any {
    return (this.editing || this.editingNested.toArray()?.[0])?.editEnabled;
  }
  get __restAttributes(): any {
    return {}
  }












}
@NgModule({
  declarations: [Widget],
  imports: [
    CommonModule
  ],
  exports: [Widget]
})
export class DxWidgetModule { }