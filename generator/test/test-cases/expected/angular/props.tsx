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
        this.onClick!.emit(10)
        return this.height;
    }
    get getRestProps(){
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