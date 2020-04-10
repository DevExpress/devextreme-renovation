function viewModel() {

}
function view() {

}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"
@Component({
    name: "Component",
    selector: "dx-widget"
})
export default class Widget {
    _hovered: Boolean = false
    updateState(): any {
        this.__hovered = !this._hovered
    }

    _viewModel: any

    ngDoCheck() {
        this._viewModel = viewModel({
            props: {},
            updateState: this.updateState
        });
    }

    set  __hovered(_hovered:Boolean){
        this._hovered=_hovered
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