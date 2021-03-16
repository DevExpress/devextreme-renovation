import { Input } from "@angular/core";
export class GridCell {
  @Input() gridData?: string = "defaultValue";
}

export class GridRow {
  private __cells__?: (GridCell | string)[];
  @Input() set cells(value: (GridCell | string)[] | undefined) {
    this.__cells__ = value;
  }
  get cells(): (GridCell | string)[] | undefined {
    if (!this.__cells__) {
      return GridRow.defaultNestedCells;
    }
    return this.__cells__;
  }
  public static defaultNestedCells: (GridCell | string)[] = [new GridCell()];
}

export class WithNestedInput {
  private __rows__?: GridRow[];
  @Input() set rows(value: GridRow[] | undefined) {
    this.__rows__ = value;
  }
  get rows(): GridRow[] | undefined {
    if (!this.__rows__) {
      return WithNestedInput.defaultNestedRows;
    }
    return this.__rows__;
  }
  public static defaultNestedRows: GridRow[] = [new GridRow()];
  @Input() dateTime?: Date = new Date();
}

export class EmptyClass {}

export class FakeNested {
  private __value__?: EmptyClass[];
  @Input() set value(value: EmptyClass[] | undefined) {
    this.__value__ = value;
  }
  get value(): EmptyClass[] | undefined {
    if (!this.__value__) {
      return FakeNested.defaultNestedValue;
    }
    return this.__value__;
  }
  public static defaultNestedValue: EmptyClass[] = [new EmptyClass()];
}
