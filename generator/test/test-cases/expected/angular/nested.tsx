import { WidgetInput } from "./nested-props";
import {
  Component,
  NgModule,
  Input,
  ContentChildren,
  QueryList,
  Directive,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { GridColumn, Editing, Custom, AnotherCustom } from "./nested-props";

@Directive({
  selector: "dx-widget dxo-another-custom",
})
class DxAnotherCustom extends AnotherCustom {}

@Directive({
  selector: "dx-widget dxi-custom",
})
class DxCustom extends Custom {}

@Directive({
  selector: "dx-widget dxo-grid-editing",
})
class DxEditing extends Editing {
  @ContentChildren(DxCustom) customNested!: QueryList<DxCustom>;
  @ContentChildren(DxAnotherCustom) anotherCustomNested!: QueryList<
    DxAnotherCustom
  >;
}

@Directive({
  selector: "dx-widget dxi-column",
})
class DxGridColumn extends GridColumn {}
@Component({ selector: "dx-widget", template: `<div></div>` })
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
  @Input() columns?: Array<DxGridColumn | string>;
  @Input() gridEditing?: DxEditing;
  @ContentChildren(DxGridColumn) columnsNested!: QueryList<DxGridColumn>;
  @ContentChildren(DxEditing) gridEditingNested!: QueryList<DxEditing>;
}
@NgModule({
  declarations: [Widget, DxGridColumn, DxEditing],
  imports: [CommonModule],
  exports: [Widget, DxGridColumn, DxEditing],
})
export class DxWidgetModule {}
