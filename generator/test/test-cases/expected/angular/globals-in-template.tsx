import { COMPONENT_INPUT_CLASS } from "./component-input"

export const PREFIX = "dx";
export const CLASS_NAME = PREFIX + "c1" + "c2" + COMPONENT_INPUT_CLASS;

export class WidgetProps {

}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"

@Component({
    selector: "dx-widget-with-globals",
    template: `<div [class]="('dx'+'c1'+'c2'+'c3')"></div>`
})
export default class WidgetWithGlobals extends WidgetProps {
    get __restAttributes() {
        return {}
    }

}
@NgModule({
    declarations: [WidgetWithGlobals],
    imports: [
        CommonModule
    ],
    exports: [WidgetWithGlobals]
})
export class DxWidgetWithGlobalsModule { }
