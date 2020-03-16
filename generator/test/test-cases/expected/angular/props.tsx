function view() {

}
function viewModel() {

}

import { Component, NgModule, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: "dx-widget"
})
export default class Widget {
    @Input() height: number = 10;
    @Output() onClick: EventEmitter<any> = new EventEmitter();

    getHeight(): number {
        this.onClick.emit(10);
        return this.height;
    }

    _viewModel: any;
    ngDoCheck() { 
        this._viewModel = viewModel({
            props: {
                height: this.height,
                onClick: this.onClick
            },
            getHeight: this.getHeight
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
