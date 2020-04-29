import InnerWidget, { DxInnerWidgetModule } from './dx-inner-widget';

import { Input, Output, EventEmitter } from '@angular/core';
export class WidgetInput {
	@Input() visible?: boolean;
	@Input() value?: boolean;
	@Output() valueChange: EventEmitter<boolean> = new EventEmitter();
}

import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'dx-widget',
	template: `<dx-inner-widget
              [value]="value"
              (valueChange)="valueChange!.emit($event)"
            ></dx-inner-widget>`,
})
export default class Widget extends WidgetInput {
	get __restAttributes():any {
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
