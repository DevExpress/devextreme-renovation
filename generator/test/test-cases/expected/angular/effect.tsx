function view() { }
function viewModel() { }

function subscribe(p: string, s: number, i: number) {
    return 1;
}

function unsubscribe(id: number) {
    return undefined;
}

import { Component, NgModule, Input, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: "dx-widget"
})
export default class DxWidgetComponent {
    @Input() height: number = 10;
    @Input() onClick: EventEmitter<any> = new EventEmitter();

    getHeight(): number {
        this.onClick.emit(10);
        return this.height;
    }

    _viewModel: any;
    ngDoCheck() { 
        this._viewModel = viewModel({
            props: {
                p: this.p,
                s: this.s
            },
            i: this.i
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