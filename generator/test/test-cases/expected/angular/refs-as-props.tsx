import WidgetWithRefProp, { DxWidgetWithRefPropModule } from './dx-widget-with-ref-prop';

import { Input } from '@angular/core';
class WidgetInput {
	  @Input() nullableRef?: HTMLDivElement;
}

import { Component, NgModule, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'dx-widget',
    template: `
        <div #divRef>
            <dx-widget-with-ref-prop
                [parentRef]="divRef"
                [nullableRef]="nullableRef"
            ></dx-widget-with-ref-prop>
        </div>
    `,
})
export default class Widget extends WidgetInput {
    @ViewChild('divRef', { static: false }) divRef!: ElementRef<HTMLDivElement>;
    __getSize(): any {
        return this.divRef.nativeElement.outerHTML + this.nullableRef?.outerHTML;
    }
    __getNullable(): any {
        const { nullableRef } = this
        return nullableRef?.outerHTML;
    }
    get __restAttributes(): any {
        return {};
    }
}
@NgModule({
    declarations: [Widget],
    imports: [DxWidgetWithRefPropModule, CommonModule],
    exports: [Widget],
})
export class DxWidgetModule {}
