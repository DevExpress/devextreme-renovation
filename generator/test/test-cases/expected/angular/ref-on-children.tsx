import Child, { DxRefOnChildrenChildModule } from "./child"



class Props {

}

import { Component, NgModule, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common"


@Component({
    selector: "dx-ref-on-children-parent",
    template: `<dx-ref-on-children-child [childRef]="forwardRef_childRef"
#auto_ref0></dx-ref-on-children-child>`})
export default class RefOnChildrenParent extends Props {
    @ViewChild("child", { static: false }) child!: ElementRef<HTMLDivElement>
    __effect(): any {
        this.child!.nativeElement.innerHTML = "Ref from child"
    }
    get __restAttributes(): any {
        return {}
    }
    get forwardRef_childRef(): (ref: any) => void {

        if (this.__getterCache["forwardRef_childRef"] !== undefined) {
            return this.__getterCache["forwardRef_childRef"];
        }
        return this.__getterCache["forwardRef_childRef"] = ((): (ref: any) => void => {
            return (ref) => this.child = ref
        })();
    }


    __destroyEffects: any[] = [];
    __viewCheckedSubscribeEvent: Array<() => void> = [];
    __getterCache: {
        forwardRef_childRef?: (ref: any) => void
    } = {}

    ngAfterViewInit() {
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
