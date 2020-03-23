import { Component, NgModule, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
@Component({
    selector: "dx-widget",
    template: `<div #divRef><div #explicitRef><div #nullableRef></div></div></div>`
})
export default class Widget {
    @ViewChild("divRef", { static: false }) divRef!: ElementRef<HTMLDivElement>;
    @ViewChild("nullableRef", { static: false }) nullableRef?: ElementRef<HTMLDivElement>;
    @ViewChild("explicitRef", { static: false }) explicitRef!: ElementRef<HTMLDivElement>;

    clickHandler() {
        const html = this.divRef.nativeElement.outerHTML + this.explicitRef!.nativeElement.outerHTML;
    }

    getHeight() { 
        return this.divRef.nativeElement.outerHTML + this.nullableRef?.nativeElement.outerHTML;
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