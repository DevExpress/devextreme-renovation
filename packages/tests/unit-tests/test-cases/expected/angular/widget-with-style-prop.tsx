import { Component, Input } from '@angular/core';
@Component({
  template: '',
})
export class WidgetWithStylePropProps {
  @Input() style?: any;
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
  selector: 'dx-widget-with-style-prop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['style'],
  template: `<ng-template #widgetTemplate
    ><div [ngStyle]="__processNgStyle(style)"></div
  ></ng-template>`,
})
export default class WidgetWithStyleProp extends WidgetWithStylePropProps {
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

  __processNgStyle(value: any) {
    return normalizeStyles(value);
  }
}
@NgModule({
  declarations: [WidgetWithStyleProp],
  imports: [CommonModule],

  exports: [WidgetWithStyleProp],
})
export class DxWidgetWithStylePropModule {}
export { WidgetWithStyleProp as DxWidgetWithStylePropComponent };
