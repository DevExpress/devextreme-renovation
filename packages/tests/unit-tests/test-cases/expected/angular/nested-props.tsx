import { Input, Output, EventEmitter } from "@angular/core";
export class GridColumnProps {
  __nameInternalValue: string = "";
  @Input()
  set name(value: string) {
    if (value !== undefined) this.__nameInternalValue = value;
    else this.__nameInternalValue = "";
  }
  get name() {
    return this.__nameInternalValue;
  }

  __indexInternalValue: number = 0;
  @Input()
  set index(value: number) {
    if (value !== undefined) this.__indexInternalValue = value;
    else this.__indexInternalValue = 0;
  }
  get index() {
    return this.__indexInternalValue;
  }
  private __editing__?: ColumnEditingProps;
  @Input() set editing(value: ColumnEditingProps | undefined) {
    this.__editing__ = value;
  }
  get editing(): ColumnEditingProps | undefined {
    return this.__editing__;
  }
  private __custom__?: CustomProps[];
  @Input() set custom(value: CustomProps[] | undefined) {
    this.__custom__ = value;
  }
  get custom(): CustomProps[] | undefined {
    return this.__custom__;
  }
  @Output() indexChange: EventEmitter<number> = new EventEmitter();
}

export class CustomProps {}

export class AnotherCustomProps {}

export class EditingProps {
  __editEnabledInternalValue: boolean = false;
  @Input()
  set editEnabled(value: boolean) {
    if (value !== undefined) this.__editEnabledInternalValue = value;
    else this.__editEnabledInternalValue = false;
  }
  get editEnabled() {
    return this.__editEnabledInternalValue;
  }
  private __custom__?: CustomProps[];
  @Input() set custom(value: CustomProps[] | undefined) {
    this.__custom__ = value;
  }
  get custom(): CustomProps[] | undefined {
    return this.__custom__;
  }
  private __anotherCustom__?: AnotherCustomProps;
  @Input() set anotherCustom(value: AnotherCustomProps | undefined) {
    this.__anotherCustom__ = value;
  }
  get anotherCustom(): AnotherCustomProps | undefined {
    return this.__anotherCustom__;
  }
}

export class ColumnEditingProps {
  __editEnabledInternalValue: boolean = false;
  @Input()
  set editEnabled(value: boolean) {
    if (value !== undefined) this.__editEnabledInternalValue = value;
    else this.__editEnabledInternalValue = false;
  }
  get editEnabled() {
    return this.__editEnabledInternalValue;
  }
}

export class WidgetProps {
  private __columns__?: Array<GridColumnProps | string>;
  @Input() set columns(value: Array<GridColumnProps | string> | undefined) {
    this.__columns__ = value;
  }
  get columns(): Array<GridColumnProps | string> | undefined {
    return this.__columns__;
  }
  private __editing__?: EditingProps;
  @Input() set editing(value: EditingProps) {
    this.__editing__ = value;
  }
  get editing(): EditingProps {
    if (!this.__editing__) {
      return WidgetProps.__defaultNestedValues.editing;
    }
    return this.__editing__;
  }
  public static __defaultNestedValues: any = { editing: new EditingProps() };
}

export class PickedProps {
  private __columns__?: Array<GridColumnProps | string>;
  @Input() set columns(value: Array<GridColumnProps | string> | undefined) {
    this.__columns__ = value;
  }
  get columns(): Array<GridColumnProps | string> | undefined {
    return this.__columns__;
  }
  private __editing__?: EditingProps;
  @Input() set editing(value: EditingProps) {
    this.__editing__ = value;
  }
  get editing(): EditingProps {
    if (!this.__editing__) {
      return PickedProps.__defaultNestedValues.editing;
    }
    return this.__editing__;
  }
  public static __defaultNestedValues: any = {
    editing: new WidgetProps().editing,
  };
}
