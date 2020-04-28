function view(model: Widget) {

}

import { Input } from "@angular/core"
class WidgetInput {
    @Input() size?: { width: number, height: number } = {
        width: 10,
        height: 20
    };
    @Input() type?: string = "type";

}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"

@Component({ selector: "dx-widget" })
export default class Widget extends WidgetInput {
    get __getHeight(): number {
        return this.size!.height;
    }
    get __type(): string {
        return this.type!;
    }
    get __restAttributes(): any {
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
