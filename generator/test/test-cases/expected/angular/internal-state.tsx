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
export default class DxWidgetComponent {
    _hovered: Boolean = false;
    updateState(): any {
        this._hovered = !this._hovered
    }

    _viewModel: any;

    ngDoCheck() {
        this._viewModel = viewModel({
            props: {},
            updateState: this.updateState
        });
    }

}
@NgModule({
    declarations: [DxWidgetComponent],
    imports: [
        CommonModule
    ],
    exports: [DxWidgetComponent]
})
export class DxWidgetModule { }