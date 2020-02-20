function viewModel() { }

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: "dx-widget",
    template: `<div>
        <div>
            <ng-content select="[namedSlot]"></ng-content>
        </div>
        <div>
            <ng-content></ng-content>
        </div>
    </div>`
})
export default class DxWidgetComponent {
    _viewModel: any;
    ngDoCheck() { 
        this._viewModel = viewModel({ props: {} });
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