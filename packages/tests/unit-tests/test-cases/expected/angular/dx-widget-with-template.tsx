import InnerWidget, {
  DxInnerWidgetModule,
} from './dependency-props';

import { Component, Input, TemplateRef } from '@angular/core';
@Component({
  template: '',
})
export class WidgetWithTemplateInput {
  @Input() template?: TemplateRef<any> | null = null;
  @Input() componentTemplate: TemplateRef<any> | null = null;
  @Input() arrowTemplate?: TemplateRef<any> | null = null;
}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dx-widget-with-template',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['template', 'componentTemplate', 'arrowTemplate'],
  template: `<ng-template #widgetTemplate
    ><div
      ><ng-container
        *ngTemplateOutlet="
          componentTemplate || componentTemplateDefault;
          context: { required: true }
        "
      >
      </ng-container
      ><ng-container *ngTemplateOutlet="template"></ng-container
      ><ng-container *ngTemplateOutlet="arrowTemplate"></ng-container></div
    ><ng-template #componentTemplateDefault let-required="required">
      <dx-inner-widget
        #compRef
        style="display: contents"
        [required]="required"
      ></dx-inner-widget>
      <ng-content
        *ngTemplateOutlet="compRef?.widgetTemplate"
      ></ng-content> </ng-template
  ></ng-template>`,
})
export default class WidgetWithTemplate extends WidgetWithTemplateInput {
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

  InnerWidgetDefaults = { visible: true, value: 14, valueChange: () => {} };
}
@NgModule({
  declarations: [WidgetWithTemplate],
  imports: [DxInnerWidgetModule, CommonModule],
  entryComponents: [InnerWidget],
  exports: [WidgetWithTemplate],
})
export class DxWidgetWithTemplateModule {}
export { WidgetWithTemplate as DxWidgetWithTemplateComponent };
