import { Input } from "@angular/core";

export class WidgetWithRefPropInput {
    @Input() parentRef?: any;
    @Input() nullableRef?: any;
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"

@Component({
    selector: "dx-widget-with-ref-prop",
    template: `<div ></div>`
})
export default class WidgetWithRefProp extends WidgetWithRefPropInput {
    get __restAttributes(): any {
        return {}
    }
}
@NgModule({
    declarations: [WidgetWithRefProp],
    imports: [
        CommonModule
    ],
    exports: [WidgetWithRefProp]
})
export class DxWidgetWithRefPropModule { }
