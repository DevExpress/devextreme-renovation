import { Input, Output, EventEmitter } from "@angular/core";
class ModelWidgetInput {
  @Input() baseStateProp?: boolean;
  @Output() baseStatePropChange: EventEmitter<boolean> = new EventEmitter();
  @Input() modelStateProp?: boolean;
  @Input() value?: boolean;
  @Output() modelStatePropChange: EventEmitter<boolean> = new EventEmitter();
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter();
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
  template: `<div>{{ baseStateProp }}</div>`,
})
export default class ModelWidget extends ModelWidgetInput
  implements ControlValueAccessor {
  get __restAttributes(): any {
    return {};
  }

  @HostListener("modelStatePropChange", ["$event"]) change() {}
  @HostListener("onBlur", ["$event"]) touched = () => {};

  writeValue(value: any): void {
    this.modelStateProp = value;
    this.changeDetection.detectChanges();
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
    this._baseStatePropChange = (stateProp: boolean) => {
      this.baseStatePropChange.emit(stateProp);
      this.changeDetection.detectChanges();
    };
    this._modelStatePropChange = (modelStateProp: boolean) => {
      this.modelStatePropChange.emit(modelStateProp);
      this.changeDetection.detectChanges();
    };
    this._valueChange = (value: boolean) => {
      this.valueChange.emit(value);
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
