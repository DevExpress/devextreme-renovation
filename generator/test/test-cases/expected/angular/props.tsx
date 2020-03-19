function view(model: Widget) {

}
class WidgetInput {
    @Input() height: number = 10;
    @Output() onClick: EventEmitter<any> = new EventEmitter();

}

import { Component, NgModule, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common"
@Component({ selector: "dx-widget" })
export default class Widget extends WidgetInput {
    __getHeight(): number {
        this.onClick!.emit(10)
        return this.height;
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