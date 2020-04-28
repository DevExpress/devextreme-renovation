import InnerWidget, { DxInnerWidgetModule } from './dx-inner-widget';

export class WidgetInput {}

import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'dx-widget',
    template: `<dx-inner-widget
                [value]="__attr1.value"
                [selected]="__attr1.selected !== undefined ? __attr1.selected : false"
              ></dx-inner-widget>`,
})
export default class Widget extends WidgetInput {
    get __attr1() {
        return { value: 100, selected: true };
    }
    get __restAttributes() {
        return {};
    }
}
@NgModule({
    declarations: [Widget],
    imports: [
        DxInnerWidgetModule,
        CommonModule
    ],
    exports: [Widget],
})
export class DxWidgetModule {}
