import {
  WidgetWithProps,
  DxWidgetWithPropsModule,
} from "./dx-widget-with-props";
import {
  PublicWidgetWithProps,
  DxPublicWidgetWithPropsModule,
} from "./dx-public-widget-with-props";
import { Component } from "@angular/core";
@Component({
  template: "",
})
export class WidgetWithNestedWidgetsProps {}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  TemplateRef,
  Input,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget-with-nested-widgets",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #widgetTemplate
      ><div
        ><dx-widget-with-props
          value="private widget"
          #widgetwithprops7
          style="display: contents"
        ></dx-widget-with-props
        ><ng-content
          *ngTemplateOutlet="widgetwithprops7?.widgetTemplate"
        ></ng-content
        ><dx-public-widget-with-props
          value="public widget"
          #publicwidgetwithprops2
          style="display: contents"
          [_private]="true"
        ></dx-public-widget-with-props
        ><ng-content
          *ngTemplateOutlet="publicwidgetwithprops2?.widgetTemplate"
        ></ng-content></div
    ></ng-template>
    <ng-container
      *ngTemplateOutlet="_private ? null : widgetTemplate"
    ></ng-container>`,
})
export default class WidgetWithNestedWidgets extends WidgetWithNestedWidgetsProps {
  @Input() _private = false;
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
  declarations: [WidgetWithNestedWidgets],
  imports: [
    DxWidgetWithPropsModule,
    DxPublicWidgetWithPropsModule,
    CommonModule,
  ],
  entryComponents: [WidgetWithProps, PublicWidgetWithProps],
  exports: [WidgetWithNestedWidgets],
})
export class DxWidgetWithNestedWidgetsModule {}
export { WidgetWithNestedWidgets as DxWidgetWithNestedWidgetsComponent };
