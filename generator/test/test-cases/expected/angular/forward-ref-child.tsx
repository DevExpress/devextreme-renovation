import { Input } from "@angular/core"
class Props {
    @Input() childRef: (ref: any) => void = () => { };
    @Input() nullableRef: (ref: any) => void = () => { };

}

import { Component, NgModule, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common"


@Component({
    selector: "dx-ref-on-children-child",
    template: `<div #childRefRef><div #nullableRefRef></div></div>`
})
export default class RefOnChildrenChild extends Props {
    get __restAttributes(): any {
        return {}
    }
    @ViewChild("childRefRef", { static: false }) childRefRef!: ElementRef<HTMLDivElement>
    @ViewChild("nullableRefRef", { static: false }) nullableRefRef?: ElementRef<HTMLDivElement>
    get forwardRef_childRef(): (ref: any) => void {
        if (this.__getterCache["forwardRef_childRef"] !== undefined) {
            return this.__getterCache["forwardRef_childRef"];
        }
        return this.__getterCache["forwardRef_childRef"] = ((): (ref: any) => void => {
            return (ref) => this.childRefRef = ref
        })();
    }
    get forwardRef_nullableRef(): (ref: any) => void {
        if (this.__getterCache["forwardRef_nullableRef"] !== undefined) {
            return this.__getterCache["forwardRef_nullableRef"];
        }
        return this.__getterCache["forwardRef_nullableRef"] = ((): (ref: any) => void => {
            return (ref) => this.nullableRefRef = ref
        })();
    }

    __getterCache: {
        forwardRef_childRef?: (ref: any) => void;
        forwardRef_nullableRef?: (ref: any) => void
    } = {}

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