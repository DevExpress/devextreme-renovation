function view(model: Widget) {

}
function subscribe(p: string, s: number, i: number) {
    return 1;
}
function unsubscribe(id: number) {
    return undefined;
}
export class WidgetInput {
    @Input() p: string = "10";
    @Input() s: number = 10;
    @Output() sChange: EventEmitter<number> = new EventEmitter();
}

import { Component, NgModule, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common"
@Component({ selector: "dx-widget" })
export default class Widget extends WidgetInput {
    i: number = 10
    __setupData(): any {
        const id = subscribe(this.p, this.s, this.i);
        this.i = 15;
        return () => unsubscribe(id);
    }

    __destroyEffects: Array<() => any> = []

    ngAfterViewInit() {
        this.__destroyEffects.push(this.__setupData());
    }

    ngOnDestroy() {
        this.__destroyEffects.forEach(d => d && d());
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