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
  @Input() custom?: DxCustom[] = [];
  @ContentChildren(DxCustom) customNested!: QueryList<DxCustom>;
  get __getNestedCustom() {
    return this.custom || this.customNested.toArray();
  }
  @Input() anotherCustom?: DxAnotherCustom = {};
  @ContentChildren(DxAnotherCustom) anotherCustomNested!: QueryList<
    DxAnotherCustom
  >;
  get __getNestedAnotherCustom() {
    return this.anotherCustom || this.anotherCustomNested.toArray()?.[0];
  }
}

@Directive({
  selector: "dx-widget dxi-column",
})
class DxGridColumn extends GridColumn {}
@Component({ selector: "dx-widget", template: `<div></div>` })
export default class Widget extends WidgetInput {
  __getColumns(): any {
    return this.__getNestedColumns?.map((el) =>
      typeof el === "string" ? el : el.name
    );
  }
  get __isEditable(): any {
    return (
      this.__getNestedGridEditing?.editEnabled ||
      this.__getNestedGridEditing?.custom?.length
    );
  }
  @Input() columns?: Array<DxGridColumn | string>;
  @ContentChildren(DxGridColumn) columnsNested!: QueryList<DxGridColumn>;
  @Input() gridEditing?: DxEditing;
  @ContentChildren(DxEditing) gridEditingNested!: QueryList<DxEditing>;
  get __restAttributes(): any {
    return {};
  }

  get __getNestedColumns() {
    return this.columns || this.columnsNested.toArray();
  }
  get __getNestedGridEditing() {
    return this.gridEditing || this.gridEditingNested.toArray()?.[0];
  }
}
@NgModule({
  declarations: [Widget, DxGridColumn, DxEditing],
  imports: [CommonModule],
  exports: [Widget, DxGridColumn, DxEditing],
})
export class DxWidgetModule {}
