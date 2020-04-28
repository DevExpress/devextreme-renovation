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
export default class Widget extends WidgetInput {
    get __restAttributes(): any {
        return {}
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