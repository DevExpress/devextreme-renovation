import { Input } from "@angular/core"

export class Props {
    @Input() p: number = 10;
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"

@Component({
    selector: "dx-widget",
    template: `<div ></div>`
})
export default class Widget extends Props {
    i: number = 10
    get __g1(): number[] {
        if ("g1" in this.__getterCache) {
            return this.__getterCache["g1"]!
        }
        return this.__getterCache["g1"] = ((): number[] => {
            return [this.p, this.i];
        })();
    }
    get __g2(): number {
        return this.p;
    }
    get __restAttributes(): any {
        return {}
    }

    __getterCache: {
        g1?: number[]
    } = {}

    set _i(i: number) {
        this.i = i
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
