import WidgetWithTemplate, {
  DxWidgetWithTemplateModule,
} from './dx-widget-with-template';
import InnerWidget, { DxInnerWidgetModule } from './dx-inner-widget';
import { Component } from '@angular/core';
@Component({
  template: '',
})
export class WidgetProps {}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dx-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #widgetTemplate
    ><dx-widget-with-template
      [template]="CustomTemplate"
      [componentTemplate]="InnerWidget"
      [arrowTemplate]="__arrowtemplate__generated1"
      #widgetwithtemplate1
      style="display: contents"
      ><ng-template
        #InnerWidget
        let-selected="selected"
        let-value="value"
        let-onSelect="onSelect"
        let-valueChange="valueChange"
        ><dx-inner-widget
          [selected]="selected"
          [value]="value !== undefined ? value : InnerWidgetDefaults.value"
          (onSelect)="onSelect($event)"
          (valueChange)="
            (valueChange !== undefined
              ? valueChange
              : InnerWidgetDefaults.valueChange)($event)
          "
          #innerwidget1
          style="display: contents"
        ></dx-inner-widget
        ><ng-content
          *ngTemplateOutlet="innerwidget1?.widgetTemplate"
        ></ng-content></ng-template
      ><ng-template #CustomTemplate let-text="text" let-value="value"
        ><span>{{ text }}</span></ng-template
      ><ng-template #__arrowtemplate__generated1 let-name="name" let-id="id"
        ><div>{{ name }}</div></ng-template
      ></dx-widget-with-template
    ><ng-content
      *ngTemplateOutlet="widgetwithtemplate1?.widgetTemplate"
    ></ng-content
    ><dx-widget-with-template
      [arrowTemplate]="__arrowtemplate__generated2"
      #widgetwithtemplate2
      style="display: contents"
      ><ng-template #__arrowtemplate__generated2 let-name="name" let-id="id"
        ><div>{{ id }}</div></ng-template
      ></dx-widget-with-template
    ><ng-content
      *ngTemplateOutlet="widgetwithtemplate2?.widgetTemplate"
    ></ng-content
  ></ng-template>`,
})
export default class Widget extends WidgetProps {
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

  InnerWidgetDefaults = { value: 14, valueChange: () => {} };
}
@NgModule({
  declarations: [Widget],
  imports: [DxWidgetWithTemplateModule, DxInnerWidgetModule, CommonModule],
  entryComponents: [WidgetWithTemplate, InnerWidget],
  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
