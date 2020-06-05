import BaseState, {DxModelWidgetModule} from "./model";

import { Input, Output, EventEmitter } from "@angular/core"
class WidgetInput {
    @Input() state1?: boolean = false;
    @Input() state2: boolean = false;
    @Input() stateProp?: boolean;
    @Output() state1Change?: EventEmitter<boolean> = new EventEmitter();
    @Output() state2Change?: EventEmitter<boolean> = new EventEmitter();
    @Output() statePropChange?: EventEmitter<boolean> = new EventEmitter();
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"

@Component({
    selector: "dx-widget",
    template: `<div>{{state1}}<dx-model-widget (baseStatePropChange)="__stateChange($event)"></dx-model-widget></div>`
})
export default class Widget extends WidgetInput {
    __updateState(): any {
        this.state1Change!.emit(this.state1 = !this.state1)
    }

    __updateState2(): any {
        const cur = this.state2;
        this.state2Change!.emit(this.state2 = cur !== false ? false : true)
    }

    __destruct(): any {
        const { state1 } = this;
        const s = state1;
    }

    __stateChange(stateProp: boolean): any {
        this.statePropChange!.emit(this.stateProp = stateProp);
    }

    get __restAttributes(): any{
        return {}
    }
}
@NgModule({
    declarations: [Widget],
    imports: [
        DxModelWidgetModule,
        CommonModule
    ],
    exports: [Widget]
})
export class DxWidgetModule { }