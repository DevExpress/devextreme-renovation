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
  selector: "dx-widget dxo-grid-editing dxo-another-custom",
})
class DxAnotherCustom extends AnotherCustom {}

@Directive({
  selector: "dx-widget dxo-grid-editing dxi-custom",
})
class DxCustom extends Custom {}

@Directive({
  selector: "dx-widget dxo-grid-editing",
})
class DxEditing extends Editing {
  private __custom?: DxCustom[] = [];
  @ContentChildren(DxCustom) customNested!: QueryList<DxCustom>;
  @Input() set custom(value: DxCustom[] | undefined) {
    this.__custom = value;
  }
  get custom(): DxCustom[] | undefined {
    if (this.__custom) {
      return this.__custom;
    }
    const nested = this.customNested.toArray();
    if (nested.length) {
      return nested;
    }
  }
  private __anotherCustom?: DxAnotherCustom = {};
  @ContentChildren(DxAnotherCustom) anotherCustomNested!: QueryList<
    DxAnotherCustom
  >;
  @Input() set anotherCustom(value: DxAnotherCustom | undefined) {
    this.__anotherCustom = value;
  }
  get anotherCustom(): DxAnotherCustom | undefined {
    if (this.__anotherCustom) {
      return this.__anotherCustom;
    }
    const nested = this.anotherCustomNested.toArray();
    if (nested.length) {
      return nested[0];
    }
  }
}

@Directive({
  selector: "dx-widget dxi-column",
})
class DxGridColumn extends GridColumn {}
@Component({ selector: "dx-widget", template: `<div></div>` })
export default class Widget extends WidgetInput {
  __getColumns(): any {
    const { columns } = this;
    return columns?.map((el) => (typeof el === "string" ? el : el.name));
  }
  get __isEditable(): any {
    return this.gridEditing?.editEnabled || this.gridEditing?.custom?.length;
  }
  private __columns?: Array<DxGridColumn | string>;
  @ContentChildren(DxGridColumn) columnsNested!: QueryList<DxGridColumn>;
  get columns(): Array<DxGridColumn | string> | undefined {
    if (this.__columns) {
      return this.__columns;
    }
    const nested = this.columnsNested.toArray();
    if (nested.length) {
      return nested;
    }
  }
  private __gridEditing?: DxEditing;
  @ContentChildren(DxEditing) gridEditingNested!: QueryList<DxEditing>;
  get gridEditing(): DxEditing | undefined {
    if (this.__gridEditing) {
      return this.__gridEditing;
    }
    const nested = this.gridEditingNested.toArray();
    if (nested.length) {
      return nested[0];
    }
  }
  get __restAttributes(): any {
    return {};
  }

  @Input() set columns(value: Array<DxGridColumn | string> | undefined) {
    this.__columns = value;
  }
  @Input() set gridEditing(value: DxEditing | undefined) {
    this.__gridEditing = value;
  }
}
@NgModule({
  declarations: [Widget, DxGridColumn, DxEditing, DxCustom, DxAnotherCustom],
  imports: [CommonModule],
  exports: [Widget, DxGridColumn, DxEditing, DxCustom, DxAnotherCustom],
})
export class DxWidgetModule {}
