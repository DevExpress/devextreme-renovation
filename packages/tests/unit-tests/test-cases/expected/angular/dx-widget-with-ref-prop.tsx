import { Component, Input } from '@angular/core';
@Component({
  template: '',
})
export class WidgetWithRefPropInput {
  @Input() parentRef?: any;
  @Input() nullableRef?: any;
}

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
  selector: 'dx-widget-with-ref-prop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['parentRef', 'nullableRef'],
  template: `<ng-template #widgetTemplate><div></div></ng-template>`,
})
export default class WidgetWithRefProp extends WidgetWithRefPropInput {
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
  declarations: [WidgetWithRefProp],
  imports: [CommonModule],

  exports: [WidgetWithRefProp],
})
export class DxWidgetWithRefPropModule {}
export { WidgetWithRefProp as DxWidgetWithRefPropComponent };
