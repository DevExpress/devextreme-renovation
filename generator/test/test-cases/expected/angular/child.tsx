import { ViewChild, ElementRef } from "@angular/core"
class Props {
    @ViewChild("childRef", { static: false }) childRef!: ElementRef<HTMLDivElement>;
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"

@Component({
    selector: "dx-ref-on-children-child",
    template: `<div #childRef></div>`
})
export default class RefOnChildrenChild extends Props {
    get __restAttributes(): any {
        return {}
    }
}
@NgModule({
    declarations: [RefOnChildrenChild],
    imports: [
        CommonModule
    ],
    exports: [RefOnChildrenChild]
})
export class DxRefOnChildrenChildModule { }
