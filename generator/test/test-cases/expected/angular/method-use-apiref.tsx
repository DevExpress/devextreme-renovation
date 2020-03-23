
import BaseWidget, {DxWidgetModule} from "./method";

class WidgetWithApiRefInput {
    @Input() prop1?: number;
}

import { Component, NgModule, Input, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
@Component({
    selector: "dx-widget-with-api-ref",
    template: `<dx-widget #baseRef [prop1]="prop1"></dx-widget>`
})
export default class WidgetWithApiRef extends WidgetWithApiRefInput {
    @ViewChild("baseRef", { static: false }) baseRef?: BaseWidget;

    getSomething(): string { 
        return `${this.prop1} + ${this.baseRef?.getHeight()}`;
    }
}
@NgModule({
    declarations: [WidgetWithApiRef],
    imports: [
        DxWidgetModule,
        CommonModule
    ],
    exports: [WidgetWithApiRef]
})
export class DxWidgetWithApiRefModule { }