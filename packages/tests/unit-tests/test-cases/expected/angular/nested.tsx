import { PickedProps, GridColumnProps } from "./nested-props";
export const CustomColumnComponent = (props: GridColumnProps) => {};
import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
  Input,
  ContentChildren,
  QueryList,
  Directive,
} from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  EditingProps,
  CustomProps,
  ColumnEditingProps,
  AnotherCustomProps,
} from "./nested-props";

@Directive({
  selector: "dx-widget dxo-editing dxo-another-custom",
})
class DxWidgetEditingAnotherCustom extends AnotherCustomProps {}

@Directive({
  selector: "dx-widget dxo-editing dxi-custom",
})
class DxWidgetEditingCustom extends CustomProps {}

@Directive({
  selector: "dx-widget dxi-column dxo-editing",
})
class DxWidgetColumnEditing extends ColumnEditingProps {}

@Directive({
  selector: "dx-widget dxi-column dxi-custom",
})
class DxWidgetColumnCustom extends CustomProps {}

@Directive({
  selector: "dx-widget dxo-editing",
})
class DxWidgetEditing extends EditingProps {
  private __custom?: DxWidgetEditingCustom[];
  @ContentChildren(DxWidgetEditingCustom)
  customNested?: QueryList<DxWidgetEditingCustom>;
  @Input() set custom(value: DxWidgetEditingCustom[] | undefined) {
    this.__custom = value;
  }
  get custom(): DxWidgetEditingCustom[] | undefined {
    if (this.__custom) {
      return this.__custom;
    }
    const nested = this.customNested?.toArray();
    if (nested && nested.length) {
      return nested;
    }
  }
  private __anotherCustom?: DxWidgetEditingAnotherCustom;
  @ContentChildren(DxWidgetEditingAnotherCustom)
  anotherCustomNested?: QueryList<DxWidgetEditingAnotherCustom>;
  @Input() set anotherCustom(value: DxWidgetEditingAnotherCustom | undefined) {
    this.__anotherCustom = value;
  }
  get anotherCustom(): DxWidgetEditingAnotherCustom | undefined {
    if (this.__anotherCustom) {
      return this.__anotherCustom;
    }
    const nested = this.anotherCustomNested?.toArray();
    if (nested && nested.length) {
      return nested[0];
    }
  }
}

@Directive({
  selector: "dx-widget dxi-column",
})
class DxWidgetColumn extends GridColumnProps {
  private __editing?: DxWidgetColumnEditing;
  @ContentChildren(DxWidgetColumnEditing)
  editingNested?: QueryList<DxWidgetColumnEditing>;
  @Input() set editing(value: DxWidgetColumnEditing | undefined) {
    this.__editing = value;
  }
  get editing(): DxWidgetColumnEditing | undefined {
    if (this.__editing) {
      return this.__editing;
    }
    const nested = this.editingNested?.toArray();
    if (nested && nested.length) {
      return nested[0];
    }
  }
  private __custom?: DxWidgetColumnCustom[];
  @ContentChildren(DxWidgetColumnCustom)
  customNested?: QueryList<DxWidgetColumnCustom>;
  @Input() set custom(value: DxWidgetColumnCustom[] | undefined) {
    this.__custom = value;
  }
  get custom(): DxWidgetColumnCustom[] | undefined {
    if (this.__custom) {
      return this.__custom;
    }
    const nested = this.customNested?.toArray();
    if (nested && nested.length) {
      return nested;
    }
  }
}

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["columns", "editing"],
  template: `<div></div>`,
})
export default class Widget extends PickedProps {
  __getColumns(): any {
    return this.columns?.map((el) => (typeof el === "string" ? el : el.name));
  }
  get __isEditable(): any {
    return this.editing?.editEnabled || this.editing?.custom?.length;
  }
  private __columns?: Array<DxWidgetColumn | string>;
  @ContentChildren(DxWidgetColumn) columnsNested?: QueryList<DxWidgetColumn>;
  get columns(): Array<DxWidgetColumn | string> | undefined {
    if (this.__columns) {
      return this.__columns;
    }
    const nested = this.columnsNested?.toArray();
    if (nested && nested.length) {
      return nested;
    }
  }
  private __editing?: DxWidgetEditing;
  @ContentChildren(DxWidgetEditing) editingNested?: QueryList<DxWidgetEditing>;
  get editing(): DxWidgetEditing | undefined {
    if (this.__editing) {
      return this.__editing;
    }
    const nested = this.editingNested?.toArray();
    if (nested && nested.length) {
      return nested[0];
    }
  }
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  ngAfterViewInit() {
    this._detectChanges();
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
  @Input() set columns(value: Array<DxWidgetColumn | string> | undefined) {
    this.__columns = value;
    this._detectChanges();
  }
  @Input() set editing(value: DxWidgetEditing | undefined) {
    this.__editing = value;
    this._detectChanges();
  }
}
@NgModule({
  declarations: [
    Widget,
    DxWidgetColumn,
    DxWidgetEditing,
    DxWidgetColumnCustom,
    DxWidgetColumnEditing,
    DxWidgetEditingCustom,
    DxWidgetEditingAnotherCustom,
  ],
  imports: [CommonModule],

  exports: [
    Widget,
    DxWidgetColumn,
    DxWidgetEditing,
    DxWidgetColumnCustom,
    DxWidgetColumnEditing,
    DxWidgetEditingCustom,
    DxWidgetEditingAnotherCustom,
  ],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
