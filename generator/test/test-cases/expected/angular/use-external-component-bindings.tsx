import Props from "./component-bindings-only";

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { convertRulesToOptions, Rule } from "../../../../../component_declaration/default_options"
type WidgetOptionRule = Rule<Props>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
    __defaultOptionRules.push(rule);

}
@Component({
    selector: "dx-widget",
    template: `<div >{{height}}</div>`
})
export default class Widget extends Props {
    get __restAttributes(): any {
        return {}
    }

    constructor() {
        super();

        const defaultOptions = convertRulesToOptions(__defaultOptionRules);
        for (let option in defaultOptions) {
            this[option] = defaultOptions[option];
        }
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
