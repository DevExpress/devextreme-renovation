import InnerWidget, { DxInnerWidgetModule } from './dx-inner-widget';

import { Input } from '@angular/core';
export class WidgetInput {
	  @Input() visible?: boolean;
}

import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'dx-widget',
    template: `<dx-inner-widget
                [selected]="selected"
                [value]="value"
                (onSelect)="onSelect($event)"
                (valueChange)="valueChange($event)"
              ></dx-inner-widget>`,
})
export default class Widget extends WidgetInput {
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
