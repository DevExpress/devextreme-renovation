import { Component, NgModule, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: "dx-widget",
    template: `<div [ngStyle]="{height:_viewModel.height}">
                    <span ></span>
                    
                    <span ></span>
              </div>`
})
export default class DxWidgetComponent {
    @Input() height: number;
    @Input() width: number;

    _viewModel: any;
    ngDoCheck() {
        this._viewModel = viewModel1({
            props: {
                height: this.height,
                width: this.width
            }
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

function viewModel1(model: Widget) {
    return {
        height: model.height
    }
}
