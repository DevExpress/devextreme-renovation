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
      return [new GridCell()];
    }
    return this.__cells__;
  }
}

export class WithNestedInput {
  private __rows__?: GridRow[];
  @Input() set rows(value: GridRow[] | undefined) {
    this.__rows__ = value;
  }
  get rows(): GridRow[] | undefined {
    if (!this.__rows__) {
      return [new GridRow()];
    }
    return this.__rows__;
  }
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
      return [new EmptyClass()];
    }
    return this.__value__;
  }
}
