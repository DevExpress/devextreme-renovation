class WidgetInput  {
            
}

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
export default class DxWidgetComponent extends WidgetInput {
    
}

@NgModule({
    declarations: [DxWidgetComponent],
    imports: [
        CommonModule
    ],
    exports: [DxWidgetComponent]
})
export class DxWidgetModule { }