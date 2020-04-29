function view(model: Widget) {

}
import { Input, Output, EventEmitter } from "@angular/core";
class WidgetInput {
    @Input() height: number = 10;
    @Output() onClick: EventEmitter<number> = new EventEmitter();

}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"
@Component({ selector: "dx-widget" })
export default class Widget extends WidgetInput {
    __getHeight(): number {
        this.onClick!.emit(10);
        this.onClick!.emit(11);
        return this.height;
    }
    get __restAttributes(): any{
        return {}
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