import { Input } from "@angular/core"
class Props {
    @Input() childRef: (ref: any) => void = () => { };
    @Input() nullableRef: (ref: any) => void = () => { };
}

import { Component, NgModule, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common"

@Component({
    selector: "dx-ref-on-children-child",
    template: `<div #childRefRef>
            <div #nullableRefRef></div>
        </div>`
})
export default class RefOnChildrenChild extends Props {
    get __restAttributes(): any {
        return {}
    }
    @ViewChild("childRefRef", { static: false }) childRefRef!: ElementRef<HTMLDivElement>
    @ViewChild("nullableRefRef", { static: false }) nullableRefRef?: ElementRef<HTMLDivElement>

    ngAfterViewInit() {
        this.childRef(this.childRefRef);
        this.nullableRef(this.nullableRefRef);
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
