import Widget, { DxWidgetModule } from './props-any-undefined-unknown';
import { Component } from '@angular/core';
@Component({
  template: '',
})
class MethodPassWidgetInput {}

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
  selector: 'dx-method-pass-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #widgetTemplate
    ><dx-widget
      [unknownProp]="__someMethod"
      #widget1
      style="display: contents"
    ></dx-widget
    ><ng-content *ngTemplateOutlet="widget1?.widgetTemplate"></ng-content
  ></ng-template>`,
})
export default class MethodPassWidget extends MethodPassWidgetInput {
  value: number = 1;
  __someMethod(): number {
    return this.value;
  }
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
    this.__someMethod = this.__someMethod.bind(this);
  }
  set _value(value: number) {
    this.value = value;
    this._detectChanges();
  }
}
@NgModule({
  declarations: [MethodPassWidget],
  imports: [DxWidgetModule, CommonModule],
  entryComponents: [Widget],
  exports: [MethodPassWidget],
})
export class DxMethodPassWidgetModule {}
export { MethodPassWidget as DxMethodPassWidgetComponent };
