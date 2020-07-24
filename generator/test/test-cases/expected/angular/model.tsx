import { Input, Output, EventEmitter } from "@angular/core";
class ModelWidgetInput {
  @Input() baseStateProp?: boolean;
  @Output() baseStatePropChange: EventEmitter<boolean> = new EventEmitter();
  _baseStatePropChange!: (stateProp: boolean) => void;
  @Input() modelStateProp?: boolean;
  @Input() value?: boolean;
  @Output() modelStatePropChange: EventEmitter<boolean> = new EventEmitter();
  _modelStatePropChange!: (modelStateProp: boolean) => void;
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter();
  _valueChange!: (value: boolean) => void;
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
  }

  registerOnChange(fn: () => void): void {
    this.change = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.touched = fn;
  }

  constructor() {
    super();
    this._baseStatePropChange = this.baseStatePropChange.emit.bind(
      this.baseStatePropChange
    );
    this._modelStatePropChange = this.modelStatePropChange.emit.bind(
      this.modelStatePropChange
    );
    this._valueChange = this.valueChange.emit.bind(this.valueChange);
  }
}
@NgModule({
  declarations: [ModelWidget],
  imports: [CommonModule],
  exports: [ModelWidget],
})
export class DxModelWidgetModule {}
