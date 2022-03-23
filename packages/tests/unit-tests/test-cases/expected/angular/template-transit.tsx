import WidgetWithTemplate, {
  DxWidgetWithTemplateModule,
} from './dx-widget-with-template';

import { Component, Input, TemplateRef } from '@angular/core';
@Component({
  template: '',
})
export class TemplateTransitWidgetInput {
  @Input() templateProp?: TemplateRef<any> | null = null;
  @Input() componentTemplateProp?: TemplateRef<any> | null = null;
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
  selector: 'dx-template-transit-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['templateProp', 'componentTemplateProp'],
  template: `<ng-template #widgetTemplate
    ><dx-widget-with-template
      [template]="templateProp"
      [componentTemplate]="componentTemplateProp"
      #widgetwithtemplate1
      style="display: contents"
    ></dx-widget-with-template
    ><ng-content
      *ngTemplateOutlet="widgetwithtemplate1?.widgetTemplate"
    ></ng-content
  ></ng-template>`,
})
export default class TemplateTransitWidget extends TemplateTransitWidgetInput {
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
}
@NgModule({
  declarations: [TemplateTransitWidget],
  imports: [DxWidgetWithTemplateModule, CommonModule],
  entryComponents: [WidgetWithTemplate],
  exports: [TemplateTransitWidget],
})
export class DxTemplateTransitWidgetModule {}
export { TemplateTransitWidget as DxTemplateTransitWidgetComponent };
