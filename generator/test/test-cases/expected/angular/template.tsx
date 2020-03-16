
export class WidgetInput {
    @Input() template: TemplateRef<any>;
    @Input() contentTemplate: TemplateRef<any>;
}

import { Component, NgModule, Input, TemplateRef } from "@angular/core";
import { CommonModule } from "@angular/common";
@Component({
    selector: "dx-widget",
    template: `<div>
        <ng-container *ngTemplateOutlet="contentTemplate; context:{p1: 'value'}"></ng-container>
        <ng-container *ngTemplateOutlet="template"></ng-container>
    </div>`
})
export default class Widget extends WidgetInput {

}
@NgModule({
    declarations: [Widget],
    imports: [
        CommonModule
    ],
    exports: [Widget]
})
export class DxWidgetModule { }