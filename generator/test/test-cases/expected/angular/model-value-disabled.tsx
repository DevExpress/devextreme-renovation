import { Input, Output, EventEmitter } from "@angular/core";
class ModelWidgetInput {
  @Input() disabled?: boolean;
  @Input() value?: boolean;
  @Input() notValue?: boolean;
  @Output() valueChange: EventEmitter<boolean | undefined> = new EventEmitter();
  @Output() notValueChange: EventEmitter<
    boolean | undefined
  > = new EventEmitter();
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
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
  inputs: ["disabled", "value", "notValue"],
  outputs: ["valueChange", "notValueChange"],
  template: `<div>{{ value }}</div>`,
})
export default class ModelWidget
  extends ModelWidgetInput
  implements ControlValueAccessor {
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  @HostListener("valueChange", ["$event"]) change() {}
  @HostListener("onBlur", ["$event"]) touched = () => {};

  writeValue(value: any): void {
    this.value = value;
    this._detectChanges();
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
    this._valueChange = (e: any) => {
      this.valueChange.emit(e);
      this._detectChanges();
    };
    this._notValueChange = (e: any) => {
      this.notValueChange.emit(e);
      this._detectChanges();
    };
  }
}
@NgModule({
  declarations: [ModelWidget],
  imports: [CommonModule],
  exports: [ModelWidget],
})
export class DxModelWidgetModule {}
export { ModelWidget as DxModelWidgetComponent };
