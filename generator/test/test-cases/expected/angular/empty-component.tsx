import { Component, NgModule, Input } from "@angular/core";
import { CommonModule } from "@angular/common"

@Component({
    selector: "dx-widget",
    template: `<div [ngStyle]="__processNgStyle({height:height})">
                    <span></span>
                    <span></span>
                </div>`
})
export default class Widget {
    @Input() height?: number;
    @Input() width?: number;

    get __restAttributes(): any {
        return {}
    }

    __processNgStyle(value: any) {
        if (typeof value === "object") {
            return Object.keys(value).reduce((v: { [name: string]: any }, k) => {
                if (typeof value[k] === "number") {
                    v[k] = value[k] + "px";
                } else {
                    v[k] = value[k];
                }
                return v;
            }, {});
        }

        return value;
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
