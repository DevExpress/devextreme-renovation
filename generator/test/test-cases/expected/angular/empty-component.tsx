import { Component, NgModule, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: "dx-widget",
    template: `<div [ngStyle]="{height:_viewModel.height}">
                    <span ></span>
                    
                    <span ></span>
              </div>`
})
export default class Widget {
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
    declarations: [Widget],
    imports: [
        CommonModule
    ],
    exports: [Widget]
})
export class DxWidgetModule { }

function viewModel1(model: Widget) {
    return {
        height: model.height
    }
}
