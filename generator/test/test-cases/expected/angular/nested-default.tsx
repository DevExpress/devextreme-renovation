import { WithNestedInput } from "./nested-default-props";
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

import { GridRow, GridCell } from "./nested-default-props";

@Directive({
  selector: "dx-with-nested dxi-row dxi-cell",
})
class DxWithNestedRowCell extends GridCell {}

@Directive({
  selector: "dx-with-nested dxi-row",
})
class DxWithNestedRow extends GridRow {
  private __cells?: (DxWithNestedRowCell | string)[];
  @ContentChildren(DxWithNestedRowCell)
  cellsNested?: QueryList<DxWithNestedRowCell>;
  @Input() set cells(value: (DxWithNestedRowCell | string)[] | undefined) {
    this.__cells = value;
  }
  get cells(): (DxWithNestedRowCell | string)[] | undefined {
    if (this.__cells) {
      return this.__cells;
    }
    const nested = this.cellsNested?.toArray();
    if (nested && nested.length) {
      return nested;
    }
    return GridRow.defaultNestedCells;
  }
}

@Component({
  selector: "dx-with-nested",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["rows", "dateTime"],
  template: `<div
    ><ng-container *ngIf="rows"
      ><ng-container *ngIf="rows.length"
        ><ng-container
          *ngFor="let _ of rows; index as index; trackBy: _trackBy_rows_0"
          ><span>{{ __getRowCells(index) }}<br /></span></ng-container
      ></ng-container>
      <span *ngIf="!rows.length">Empty Array</span></ng-container
    >
    <span *ngIf="!rows">No Data</span></div
  >`,
})
export default class WithNested extends WithNestedInput {
  __getRowCells(index: number): any {
    const cells = this.rows?.[index].cells;
    return (
      cells
        ?.map((cell) => (typeof cell === "string" ? cell : cell.gridData))
        .join("|") || []
    );
  }
  private __rows?: DxWithNestedRow[];
  @ContentChildren(DxWithNestedRow) rowsNested?: QueryList<DxWithNestedRow>;
  get rows(): DxWithNestedRow[] | undefined {
    if (this.__rows) {
      return this.__rows;
    }
    const nested = this.rowsNested?.toArray();
    if (nested && nested.length) {
      return nested;
    }
    return WithNestedInput.defaultNestedRows;
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

  _trackBy_rows_0(index: number, _: any) {
    return index;
  }

  ngAfterViewInit() {
    this._detectChanges();
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
  @Input() set rows(value: DxWithNestedRow[] | undefined) {
    this.__rows = value;
    this._detectChanges();
  }
}
@NgModule({
  declarations: [WithNested, DxWithNestedRow, DxWithNestedRowCell],
  imports: [CommonModule],

  exports: [WithNested, DxWithNestedRow, DxWithNestedRowCell],
})
export class DxWithNestedModule {}
export { WithNested as DxWithNestedComponent };