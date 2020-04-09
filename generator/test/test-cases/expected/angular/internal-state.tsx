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
        this._hovered = !this._hovered
    }
    get restAttributes(){
        return {}
    }

    _viewModel: any

    ngDoCheck() {
        this._viewModel = viewModel({
            props: {},
            updateState: this.updateState
            restAttributes: this.restAttributes,
        });
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