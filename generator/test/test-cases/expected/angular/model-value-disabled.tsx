import { Input, Output, EventEmitter } from "@angular/core";
class ModelWidgetInput {
  @Input() disabled?: boolean;
  @Input() value?: boolean;
  @Input() notValue?: boolean;
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter();
  _valueChange!: (value: boolean) => void;
  @Output() notValueChange: EventEmitter<boolean> = new EventEmitter();
  _notValueChange!: (notValue: boolean) => void;
}

import { Component, NgModule, forwardRef, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ModelWidget),
  multi: true,
};
@Component({
  selector: "dx-model-widget",
  providers: [CUSTOM_VALUE_ACCESSOR_PROVIDER],
  template: `<div>{{ value }}</div>`,
})
export default class ModelWidget extends ModelWidgetInput
  implements ControlValueAccessor {
  get __restAttributes(): any {
    return {};
  }

  @HostListener("valueChange", ["$event"]) change() {}
  @HostListener("onBlur", ["$event"]) touched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  registerOnChange(fn: () => void): void {
    this.change = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.touched = fn;
  }

  constructor() {
    super();
    this._valueChange = this.valueChange.emit.bind(this.valueChange);
    this._notValueChange = this.notValueChange.emit.bind(this.notValueChange);
  }
}
@NgModule({
  declarations: [ModelWidget],
  imports: [CommonModule],
  exports: [ModelWidget],
})
export class DxModelWidgetModule {}
