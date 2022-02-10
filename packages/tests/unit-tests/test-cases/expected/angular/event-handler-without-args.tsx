import {
  WidgetWithProps,
  DxWidgetWithPropsModule,
} from "./dx-widget-with-props";
import { Component } from "@angular/core";
@Component({
  template: "",
})
class WidgetInput {}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #widgetTemplate
    ><dx-widget-with-props
      (onClick)="__onClickWithoutArgs()"
      #widgetwithprops1
      style="display: contents"
    ></dx-widget-with-props
    ><ng-content
      *ngTemplateOutlet="widgetwithprops1?.widgetTemplate"
    ></ng-content
    ><dx-widget-with-props
      (onClick)="__onClickWithArgs($event)"
      #widgetwithprops2
      style="display: contents"
    ></dx-widget-with-props
    ><ng-content
      *ngTemplateOutlet="widgetwithprops2?.widgetTemplate"
    ></ng-content
    ><dx-widget-with-props
      (onClick)="__onClickGetter($event)"
      #widgetwithprops3
      style="display: contents"
    ></dx-widget-with-props
    ><ng-content
      *ngTemplateOutlet="widgetwithprops3?.widgetTemplate"
    ></ng-content
  ></ng-template>`,
})
export default class Widget extends WidgetInput {
  __onClickWithoutArgs(): any {}
  __onClickWithArgs(args: unknown): any {}
  get __onClickGetter(): any {
    return () => {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  @ViewChild("widgetTemplate", { static: true })
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
  declarations: [Widget],
  imports: [DxWidgetWithPropsModule, CommonModule],
  entryComponents: [WidgetWithProps],
  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
