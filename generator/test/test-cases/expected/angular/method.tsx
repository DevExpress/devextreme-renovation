import { Input } from "@angular/core";
class WidgetInput {
    @Input() prop1?: number;
    @Input() prop2?: number;
}

import { Component, NgModule, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
@Component({
    selector: "dx-widget",
    template: `<div #divRef></div>`
})
export default class Widget extends WidgetInput {
    @ViewChild("divRef", { static: false }) divRef: ElementRef<HTMLDivElement>;

    getHeight(p:number=10, p1:any): string { 
        return `${this.prop1} + ${this.prop2} + ${this.divRef!.nativeElement.innerHTML}`;
    }

    getSize(): string { 
        return `${this.prop1} + ${this.divRef!.nativeElement.innerHTML}`;
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