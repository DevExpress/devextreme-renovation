import { Injectable, Input } from "@angular/core";
@Injectable()
export class GridCell {
  @Input() gridData: string = "defaultValue";
}

@Injectable()
export class GridRow {
  private __cells__?: (GridCell | string)[];
  @Input() set cells(value: (GridCell | string)[]) {
    this.__cells__ = value;
  }
  get cells(): (GridCell | string)[] {
    if (!this.__cells__) {
      return GridRow.__defaultNestedValues.cells;
    }
    return this.__cells__;
  }
  public static __defaultNestedValues: any = { cells: [new GridCell()] };
}

@Injectable()
export class WithNestedInput {
  private __rows__?: GridRow[];
  @Input() set rows(value: GridRow[] | undefined) {
    this.__rows__ = value;
  }
  get rows(): GridRow[] | undefined {
    if (!this.__rows__) {
      return WithNestedInput.__defaultNestedValues.rows;
    }
    return this.__rows__;
  }
  public static __defaultNestedValues: any = { rows: [new GridRow()] };
}

@Injectable()
export class EmptyClass {}

@Injectable()
export class FakeNested {
  private __value__?: EmptyClass[];
  @Input() set value(value: EmptyClass[] | undefined) {
    this.__value__ = value;
  }
  get value(): EmptyClass[] | undefined {
    if (!this.__value__) {
      return FakeNested.__defaultNestedValues.value;
    }
    return this.__value__;
  }
  public static __defaultNestedValues: any = { value: [new EmptyClass()] };
}
