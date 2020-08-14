import { Input, Output, EventEmitter } from "@angular/core";
class ModelWidgetInput {
  @Input() disabled?: boolean;
  @Input() value?: boolean;
  @Input() notValue?: boolean;
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter();
  @Output() notValueChange: EventEmitter<boolean> = new EventEmitter();
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  forwardRef,
  HostListener,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ModelWidget),
  multi: true,
};
@Component({
  selector: "dx-model-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    this.changeDetection.detectChanges();
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

  _valueChange: any;
  _notValueChange: any;
  constructor(private changeDetection: ChangeDetectorRef) {
    super();
    this._valueChange = (value: boolean) => {
      this.valueChange.emit(value);
      this.changeDetection.detectChanges();
    };
    this._notValueChange = (notValue: boolean) => {
      this.notValueChange.emit(notValue);
      this.changeDetection.detectChanges();
    };
  }
}
@NgModule({
  declarations: [ModelWidget],
  imports: [CommonModule],
  exports: [ModelWidget],
})
export class DxModelWidgetModule {}
