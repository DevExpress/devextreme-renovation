function view() {

}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"
@Component({
    selector: "dx-widget"
})
export default class Widget {
    _hovered: Boolean = false
    updateState(): any {
        this.__hovered = !this._hovered
    }
    get restAttributes(){
        return {}
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