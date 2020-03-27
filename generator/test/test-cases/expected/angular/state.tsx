import { Input, Output, EventEmitter } from "@angular/core"
class WidgetInput {
    @Input() pressed?: boolean = false;
    @Output() pressedChange?: EventEmitter<boolean> = new EventEmitter();
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"

@Component({
    selector: "dx-widget",
    template: `<div>{{pressed}}</div>`
})
export default class Widget extends WidgetInput {
    __updateState(): any {
        this.pressedChange!.emit(this.pressed = !this.pressed)
    }
}
@NgModule({
    declarations: [Widget],
    imports: [
        CommonModule
    ],
    exports: [Widget]
})
export class DxWidgetModule { }