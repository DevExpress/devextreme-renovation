import Child, { DxRefOnChildrenChildModule } from "./child"



class Props {

}

import { Component, NgModule, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common"


@Component({
    selector: "dx-ref-on-children-parent",
    template: `<dx-ref-on-children-child #auto_ref0></dx-ref-on-children-child>`
})
export default class RefOnChildrenParent extends Props {
    @ViewChild("child", { static: false }) child!: ElementRef<HTMLDivElement>
    __effect(): any {
        this.child!.nativeElement.innerHTML = "Ref from child"
    }
    get __restAttributes(): any {
        return {}
    }
    @ViewChild("auto_ref0", { static: false }) auto_ref0?: Child

    __destroyEffects: any[] = [];
    __viewCheckedSubscribeEvent: Array<() => void> = [];

    ngAfterViewInit() {
        if (this.auto_ref0) {
            this.child = this.auto_ref0.childRef;
        }
        this.__destroyEffects.push(this.__effect());
    }

    ngOnDestroy() {
        this.__destroyEffects.forEach(d => d && d());
    }
}
@NgModule({
    declarations: [RefOnChildrenParent],
    imports: [
        DxRefOnChildrenChildModule,
        CommonModule
    ],
    exports: [RefOnChildrenParent]
})
export class DxRefOnChildrenParentModule { }