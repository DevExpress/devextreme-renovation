import Child, { DxRefOnChildrenChildModule } from "./child"

class Props {

}

import { Component, NgModule, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common"

@Component({
    selector: "dx-ref-on-children-parent",
    template: `<dx-ref-on-children-child [childRef]="forwardRef_child"></dx-ref-on-children-child>`
})
export default class RefOnChildrenParent extends Props {
    child: ElementRef<HTMLDivElement>
    __effect(): any {
        this.child!.nativeElement.innerHTML = "Ref from child"
    }
    get __restAttributes(): any {
        return {}
    }
    get forwardRef_child(): (ref: any) => void {

        if (this.__getterCache["forwardRef_child"] !== undefined) {
            return this.__getterCache["forwardRef_child"];
        }
        return this.__getterCache["forwardRef_child"] = ((): (ref: any) => void => {
            return (ref) => this.child = ref
        })();
    }

    __destroyEffects: any[] = [];
    __viewCheckedSubscribeEvent: Array<() => void> = [];
    __getterCache: {
        forwardRef_child?: (ref: any) => void
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
