import { Input, Output, EventEmitter } from "@angular/core"
class ModelWidgetInput {
    @Input() baseStateProp?: boolean;
    @Output() baseStatePropChange: EventEmitter<boolean> = new EventEmitter();
    @Input() modelStateProp?: boolean;
    @Input() value?: boolean;
    @Output() modelStatePropChange: EventEmitter<boolean> = new EventEmitter();
    @Output() valueChange: EventEmitter<boolean> = new EventEmitter();
}

import { Component, NgModule, forwardRef, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ModelWidget),
    multi: true
}

@Component({
    selector: "dx-model-widget",
    providers: [ CUSTOM_VALUE_ACCESSOR_PROVIDER ],
    template: `<div>{{baseStateProp}}</div>`
})
export default class ModelWidget extends ModelWidgetInput implements ControlValueAccessor {
    get __restAttributes(): any{
        return {}
    }

    @HostListener('modelStatePropChange', ['$event']) change() { }
    @HostListener('onBlur', ['$event']) touched = () => {};

    writeValue(value: any): void {
        this.modelStateProp = value;
    }

    registerOnChange(fn: () => void): void { this.change = fn; }
    registerOnTouched(fn: () => void): void { this.touched = fn; }
}
@NgModule({
    declarations: [ModelWidget],
    imports: [
        CommonModule
    ],
    exports: [ModelWidget]
})
export class DxModelWidgetModule { }