import { Input, Output, EventEmitter } from "@angular/core";
class ModelWidgetInput {
  @Input() baseStateProp?: boolean;
  @Output() baseStatePropChange: EventEmitter<boolean | undefined> =
    new EventEmitter();
  @Input() modelStateProp?: boolean;
  @Input() value?: boolean;
  @Output() modelStatePropChange: EventEmitter<boolean | undefined> =
    new EventEmitter();
  @Output() valueChange: EventEmitter<boolean | undefined> = new EventEmitter();
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
  inputs: ["baseStateProp", "modelStateProp", "value"],
  outputs: ["baseStatePropChange", "modelStatePropChange", "valueChange"],
  template: `<div>{{ baseStateProp }}</div>`,
})
export default class ModelWidget
  extends ModelWidgetInput
  implements ControlValueAccessor
{
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  @HostListener("modelStatePropChange", ["$event"]) change() {}
  @HostListener("onBlur", ["$event"]) touched = () => {};

  writeValue(value: any): void {
    this.modelStateProp = value;
    this._detectChanges();
  }

  registerOnChange(fn: () => void): void {
    this.change = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.touched = fn;
  }

  _baseStatePropChange: any;
  _modelStatePropChange: any;
  _valueChange: any;
  constructor(private changeDetection: ChangeDetectorRef) {
    super();
    this._baseStatePropChange = (e: any) => {
      this.baseStatePropChange.emit(e);
      this._detectChanges();
    };
    this._modelStatePropChange = (e: any) => {
      this.modelStatePropChange.emit(e);
      this._detectChanges();
    };
    this._valueChange = (e: any) => {
      this.valueChange.emit(e);
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
