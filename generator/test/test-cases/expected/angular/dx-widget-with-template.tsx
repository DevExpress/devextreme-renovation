import { Input, TemplateRef } from "@angular/core"
export class WidgetWithTemplateInput {
    @Input() template?: TemplateRef<any>;
    @Input() componentTemplate?: TemplateRef<any>;
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"

@Component({
    selector: "dx-widget-with-template",
    template: `<div>
        <ng-container *ngTemplateOutlet="componentTemplate">
        </ng-container><ng-container *ngTemplateOutlet="template"></ng-container>
    </div>`
})
export default class WidgetWithTemplate extends WidgetWithTemplateInput {
    get __restAttributes(): any {
        return {}
    }
}
@NgModule({
    declarations: [WidgetWithTemplate],
    imports: [
        CommonModule
    ],
    exports: [WidgetWithTemplate]
})
export class DxWidgetWithTemplateModule { }
