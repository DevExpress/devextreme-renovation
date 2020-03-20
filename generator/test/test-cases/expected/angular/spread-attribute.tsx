export class WidgetInput {

}

import { Component, NgModule, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
@Component({
    selector: "dx-widget",
    template: `<div #host>
                <input #_auto_ref_0/>
                </div>`
})
export default class Widget extends WidgetInput {
    @ViewChild("host", { static: false }) host: ElementRef<HTMLDivElement>

    get __attr1() {
        return {};
    }

    get __attr2() {
        return {};
    }

    @ViewChild("_auto_ref_0", { static: false }) _auto_ref_0: ElementRef<HTMLDivElement>

    __applyAttributes__() {
        const _attr_0: { [name: string]: string } = this.__attr1 || {};
        const _ref_0 = this.host?.nativeElement as any;
        if (_ref_0) {
            for (let key in _attr_0) {
                _ref_0.setAttribute(key, _attr_0[key]);
            }
        }

        const _attr_1: { [name: string]: string } = this.__attr2 || {};
        const _ref_1 = this._auto_ref_0?.nativeElement;
        if (_ref_1) {
            for (let key in _attr_1) {
                _ref_1.setAttribute(key, _attr_1[key]);
            }
        }
    }

    ngOnChanges() {
        this.__applyAttributes__()
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
