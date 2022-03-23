import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { isSlotEmpty } from '@devextreme/runtime/angular';
@Component({
  template: '',
})
export class WidgetOneProps {
  @Input() text?: string;
  __slotChildren?: ElementRef<HTMLDivElement>;
  get children(): boolean {
    return !isSlotEmpty(this.__slotChildren);
  }
}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dx-widget-one',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['text'],
  template: `<ng-template #widgetTemplate
    ><div
      ><span>One -{{ text }}</span
      ><div #slotChildren style="display: contents"></div>
      <ng-container [ngTemplateOutlet]="dxchildren"></ng-container>
      <div class="dx-slot-end" style="display: contents"></div></div
    ><ng-template #dxchildren><ng-content></ng-content></ng-template
  ></ng-template>`,
})
export default class WidgetOne extends WidgetOneProps {
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  @ViewChild('widgetTemplate', { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }
  @ViewChild('slotChildren') set slotChildren(
    slot: ElementRef<HTMLDivElement>
  ) {
    const oldValue = this.children;
    this.__slotChildren = slot;
    const newValue = this.children;
    if (!!oldValue !== !!newValue) {
      this._detectChanges();
    }
  }
}
@NgModule({
  declarations: [WidgetOne],
  imports: [CommonModule],

  exports: [WidgetOne],
})
export class DxWidgetOneModule {}
export { WidgetOne as DxWidgetOneComponent };
