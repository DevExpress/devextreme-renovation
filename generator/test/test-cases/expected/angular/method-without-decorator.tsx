class WidgetInput {}

import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({ selector: 'dx-widget', template: `<div></div>` })
export default class Widget extends WidgetInput {
    private __privateMethod(a: number): any {}
    __method1(a: number): void {
        return this.__privateMethod(a);
    }
    __method2(): null {
        return null;
    }
    get __restAttributes() {
        return {};
    }
}
@NgModule({
    declarations: [Widget],
    imports: [CommonModule],
    exports: [Widget],
})
export class DxWidgetModule {}
