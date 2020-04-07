export class WidgetInput {

}

import { Component, NgModule, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
@Component({
    selector: "dx-widget",
    template: `<div #_auto_ref_0>
                </div>`
})
export default class Widget extends WidgetInput {
    get __attr1() {
        return {};
    }
    get getRestProps(){
        return {}
    }

    @ViewChild("_auto_ref_0", { static: false }) _auto_ref_0: ElementRef<HTMLDivElement>

    __applyAttributes__() {
        const _attr_0: { [name: string]: string } = this.__attr1 || {};
        const _ref_0 = this._auto_ref_0?.nativeElement;
        if (_ref_0) {
            for (let key in _attr_0) {
                _ref_0.setAttribute(key, _attr_0[key]);
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
