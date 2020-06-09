
import { Input, TemplateRef } from "@angular/core";
export class WidgetInput {
    @Input() headerTemplate?: TemplateRef<any>;
    @Input() template!: TemplateRef<any>;
    @Input() contentTemplate!: TemplateRef<any>;
    @Input() footerTemplate!: TemplateRef<any>;
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
@Component({
    selector: "dx-widget",
    template: `<div>
        <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
        <ng-container *ngIf="contentTemplate">
            <ng-container *ngTemplateOutlet="contentTemplate; context:{data:{p1: 'value'}, index:10}"></ng-container>
        </ng-container>
        <ng-container *ngIf="!contentTemplate">
            <ng-container *ngTemplateOutlet="template"></ng-container>
        </ng-container>
        <ng-container *ngTemplateOutlet="footerTemplate; context:{someProp:true}"></ng-container>
    </div>`
})
export default class Widget extends WidgetInput {
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